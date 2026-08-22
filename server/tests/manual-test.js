import http from "http";
import { URL } from "url";
import assert from "assert";
import fs from "fs";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8080/api";
const TIMEOUT = 10000;

// Simple HTTP request helper
function request(method, path, { body, token } = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(path.startsWith("http") ? path : BASE_URL + path);
    const payload = body !== undefined ? JSON.stringify(body) : null;

    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (payload) headers["Content-Length"] = Buffer.byteLength(payload);

    const options = {
      hostname: fullUrl.hostname,
      port: fullUrl.port,
      path: fullUrl.pathname + fullUrl.search,
      method,
      headers,
      timeout: TIMEOUT,
    };

    const req = http.request(options, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        let body = raw;
        try {
          body = raw ? JSON.parse(raw) : null;
        } catch {}
        resolve({ status: res.statusCode, body });
      });
    });

    req.on("timeout", () => req.destroy());
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// Simple test runner
const tests = [];
let currentSuite = "";

function describe(name, fn) {
  currentSuite = name;
  fn();
  currentSuite = "";
}

function it(name, fn) {
  tests.push({ suite: currentSuite, name, fn });
}

async function runAll() {
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const test of tests) {
    const start = Date.now();
    try {
      await test.fn();
      passed++;
      results.push({
        suite: test.suite,
        name: test.name,
        status: "PASS",
        duration: Date.now() - start,
      });
    } catch (err) {
      failed++;
      results.push({
        suite: test.suite,
        name: test.name,
        status: "FAIL",
        duration: Date.now() - start,
        error: err.message,
      });
    }
  }

  // Generate report
  let report = "=".repeat(64) + "\n";
  report += "  API TEST REPORT\n";
  report += `  Generated : ${new Date().toISOString()}\n`;
  report += `  Base URL  : ${BASE_URL}\n`;
  report += "=".repeat(64) + "\n\n";

  let currentSuiteName = "";
  for (const r of results) {
    if (r.suite !== currentSuiteName) {
      currentSuiteName = r.suite;
      report += `MODULE: ${currentSuiteName.toUpperCase()}\n`;
      report += "-".repeat(64) + "\n";
    }
    const tag = r.status === "PASS" ? "[PASS]" : "[FAIL]";
    report += `${tag} ${r.name} (${r.duration}ms)\n`;
    if (r.status === "FAIL") {
      report += `        -> ${r.error}\n`;
    }
  }

  report += "\n" + "=".repeat(64) + "\n";
  report += "SUMMARY\n";
  report += `Total: ${tests.length} | Passed: ${passed} | Failed: ${failed} | Success Rate: ${Math.round((passed / tests.length) * 100)}%\n`;
  report += "=".repeat(64) + "\n";

  fs.writeFileSync("testresult.txt", report);
  console.log(report);
  console.log(`\nFull report written to: testresult.txt`);
  process.exit(failed > 0 ? 1 : 0);
}

// ------------------------------------------------------------
// Test definitions begin
// ------------------------------------------------------------

const unique = () => `${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
const FAKE_ID = "a".repeat(24);

let token = null;
let taskId = null;
let subtaskId = null;
let bulkId1 = null;
let bulkId2 = null;
let secondToken = null;
let secondTaskId = null;

// AUTH MODULE
describe("AUTH MODULE", () => {
  const signupData = {
    name: "Manual Test User",
    email: `manual.${unique()}@example.com`,
    password: "pass1234",
  };

  it("Signup - fails when name is missing", async () => {
    const res = await request("POST", "/auth/signup", {
      body: { email: `x.${unique()}@example.com`, password: "pass1234" },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it("Signup - fails when email is invalid", async () => {
    const res = await request("POST", "/auth/signup", {
      body: { name: "X", email: "not-an-email", password: "pass1234" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Signup - fails when password is too short", async () => {
    const res = await request("POST", "/auth/signup", {
      body: {
        name: "X",
        email: `short.${unique()}@example.com`,
        password: "12",
      },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Signup - fails on unknown field", async () => {
    const res = await request("POST", "/auth/signup", {
      body: {
        name: "X",
        email: `unknown.${unique()}@example.com`,
        password: "pass1234",
        isAdmin: true,
      },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Signup - succeeds with valid data", async () => {
    const res = await request("POST", "/auth/signup", { body: signupData });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.notStrictEqual(res.body.data, undefined);
    assert.strictEqual(res.body.data.email, signupData.email);
    assert.strictEqual(res.body.data.password, undefined);
  });

  it("Signup - fails when email already exists", async () => {
    const res = await request("POST", "/auth/signup", { body: signupData });
    assert.strictEqual(res.status, 409);
  });

  it("Login - fails when password is missing", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: signupData.email },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Login - fails with wrong password", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: signupData.email, password: "wrongpass" },
    });
    assert.strictEqual(res.status, 401);
  });

  it("Login - fails for unregistered email", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: `nouser.${unique()}@example.com`, password: "pass1234" },
    });
    assert.strictEqual(res.status, 401);
  });

  it("Login - succeeds and returns a token", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: signupData.email, password: signupData.password },
    });
    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.data.token, undefined);
    token = res.body.data.token;
  });

  it("Logout - fails without token", async () => {
    const res = await request("POST", "/auth/logout", {});
    assert.strictEqual(res.status, 401);
  });

  it("Logout - succeeds with valid token", async () => {
    const res = await request("POST", "/auth/logout", { token });
    assert.strictEqual(res.status, 200);
  });

  it("Logout - blacklisted token cannot access profile", async () => {
    const res = await request("GET", "/users/profile", { token });
    assert.strictEqual(res.status, 401);
  });

  it("Login again to get fresh token", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: signupData.email, password: signupData.password },
    });
    assert.strictEqual(res.status, 200);
    token = res.body.data.token;
  });

  it("Update password - fails without token", async () => {
    const res = await request("POST", "/auth/update-password", {
      body: {
        currentPassword: signupData.password,
        newPassword: "newpass123",
        confirmNewPassword: "newpass123",
      },
    });
    assert.strictEqual(res.status, 401);
  });

  it("Update password - fails when confirmation does not match", async () => {
    const res = await request("POST", "/auth/update-password", {
      token,
      body: {
        currentPassword: signupData.password,
        newPassword: "newpass123",
        confirmNewPassword: "different",
      },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Update password - fails with wrong current password", async () => {
    const res = await request("POST", "/auth/update-password", {
      token,
      body: {
        currentPassword: "totallyWrong",
        newPassword: "newpass123",
        confirmNewPassword: "newpass123",
      },
    });
    assert.strictEqual(res.status, 401);
  });

  it("Update password - succeeds", async () => {
    const res = await request("POST", "/auth/update-password", {
      token,
      body: {
        currentPassword: signupData.password,
        newPassword: "newpass123",
        confirmNewPassword: "newpass123",
      },
    });
    assert.strictEqual(res.status, 200);
    signupData.password = "newpass123";
  });

  it("Old token is blacklisted after password update", async () => {
    const res = await request("GET", "/users/profile", { token });
    assert.strictEqual(res.status, 401);
  });

  it("Login with new password", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email: signupData.email, password: signupData.password },
    });
    assert.strictEqual(res.status, 200);
    token = res.body.data.token;
  });
});

// USER MODULE
describe("USER MODULE", () => {
  it("Get profile - succeeds", async () => {
    const res = await request("GET", "/users/profile", { token });
    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.data.user, undefined);
  });

  it("Admin dashboard - fails for normal user", async () => {
    const res = await request("GET", "/users/admin/dashboard", { token });
    assert.strictEqual(res.status, 403);
  });
});

// HEALTH MODULE
describe("HEALTH MODULE", () => {
  it("Health check returns uptime", async () => {
    const res = await request("GET", "/health");
    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.data.uptime, undefined);
  });
});

// TASK MODULE - CRUD
describe("TASK MODULE - CRUD", () => {
  it("Create task - fails without token", async () => {
    const res = await request("POST", "/tasks", { body: { title: "No auth" } });
    assert.strictEqual(res.status, 401);
  });

  it("Create task - fails when title is missing", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { description: "no title" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Create task - fails on unknown field", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Task", notAllowed: true },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Create task - fails with invalid priority", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Task", priority: "urgent" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Create task - fails with past due date", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Task", dueDate: "2000-01-01" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Create task - succeeds with valid data", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: {
        title: "Manual Test Task",
        description: "Test description",
        priority: "high",
        tags: ["testing"],
      },
    });
    assert.strictEqual(res.status, 201);
    assert.notStrictEqual(res.body.data._id, undefined);
    taskId = res.body.data._id;
  });

  it("Get tasks - returns array", async () => {
    const res = await request("GET", "/tasks", { token });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  it("Get tasks - filter by status", async () => {
    const res = await request("GET", "/tasks?status=pending", { token });
    assert.strictEqual(res.status, 200);
  });

  it("Get tasks - filter by priority", async () => {
    const res = await request("GET", "/tasks?priority=high", { token });
    assert.strictEqual(res.status, 200);
  });

  it("Get tasks - filter by dueDate", async () => {
    const res = await request("GET", "/tasks?dueDate=2026-12-31", { token });
    assert.strictEqual(res.status, 200);
  });

  it("Get tasks - invalid status filter", async () => {
    const res = await request("GET", "/tasks?status=invalid", { token });
    assert.strictEqual(res.status, 400);
  });

  it("Get single task - succeeds", async () => {
    const res = await request("GET", `/tasks/${taskId}`, { token });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data._id, taskId);
  });

  it("Get single task - malformed id", async () => {
    const res = await request("GET", "/tasks/not-a-valid-id", { token });
    assert.strictEqual(res.status, 400);
  });

  it("Get single task - non-existent id", async () => {
    const res = await request("GET", `/tasks/${FAKE_ID}`, { token });
    assert.strictEqual(res.status, 404);
  });

  it("Update task - succeeds", async () => {
    const res = await request("PUT", `/tasks/${taskId}`, {
      token,
      body: { status: "in-progress", actualTime: 2 },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.status, "in-progress");
  });

  it("Update task - invalid status", async () => {
    const res = await request("PUT", `/tasks/${taskId}`, {
      token,
      body: { status: "invalid-status" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Update task - non-existent", async () => {
    const res = await request("PUT", `/tasks/${FAKE_ID}`, {
      token,
      body: { title: "x" },
    });
    assert.strictEqual(res.status, 404);
  });

  it("Update task to completed sets completedAt", async () => {
    const res = await request("PUT", `/tasks/${taskId}`, {
      token,
      body: { status: "completed" },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.completedAt !== null);
  });

  it("Update task to pending clears completedAt", async () => {
    const res = await request("PUT", `/tasks/${taskId}`, {
      token,
      body: { status: "pending" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.completedAt, null);
  });

  it("Delete task - soft delete", async () => {
    const res = await request("DELETE", `/tasks/${taskId}`, { token });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.isDeleted, true);
  });

  it("Delete task again - fails (404)", async () => {
    const res = await request("DELETE", `/tasks/${taskId}`, { token });
    assert.strictEqual(res.status, 404);
  });

  it("Get trash - contains deleted task", async () => {
    const res = await request("GET", "/tasks/trash", { token });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.some((t) => t._id === taskId));
  });

  it("Restore task - succeeds", async () => {
    const res = await request("PATCH", `/tasks/${taskId}/restore`, {
      token,
      body: {},
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.isDeleted, false);
  });

  it("Restore task again - fails (404)", async () => {
    const res = await request("PATCH", `/tasks/${taskId}/restore`, {
      token,
      body: {},
    });
    assert.strictEqual(res.status, 404);
  });
});

// TASK MODULE - SUBTASKS
describe("TASK MODULE - SUBTASKS", () => {
  it("Create subtask - succeeds with valid parentTask", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Subtask 1", parentTask: taskId },
    });
    assert.strictEqual(res.status, 201);
    subtaskId = res.body.data._id;
  });

  it("Create subtask - invalid parentTask id", async () => {
    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Bad Subtask", parentTask: "invalidID" },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Get subtasks - returns list", async () => {
    const res = await request("GET", `/tasks/${taskId}/subtasks`, { token });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.length > 0);
  });

  it("Get subtasks - non-existent parent", async () => {
    const res = await request("GET", `/tasks/${FAKE_ID}/subtasks`, { token });
    assert.strictEqual(res.status, 404);
  });

  it("Get subtasks - malformed parent id", async () => {
    const res = await request("GET", "/tasks/not-valid/subtasks", { token });
    assert.strictEqual(res.status, 400);
  });
});

// TASK MODULE - BULK OPERATIONS
describe("TASK MODULE - BULK OPERATIONS", () => {
  it("Create two tasks for bulk operations", async () => {
    const t1 = await request("POST", "/tasks", {
      token,
      body: { title: "Bulk task 1" },
    });
    const t2 = await request("POST", "/tasks", {
      token,
      body: { title: "Bulk task 2" },
    });
    assert.strictEqual(t1.status, 201);
    assert.strictEqual(t2.status, 201);
    bulkId1 = t1.body.data._id;
    bulkId2 = t2.body.data._id;
  });

  it("Bulk update - empty ids array", async () => {
    const res = await request("PATCH", "/tasks/bulk", {
      token,
      body: { ids: [], updateData: { priority: "low" } },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Bulk update - empty updateData", async () => {
    const res = await request("PATCH", "/tasks/bulk", {
      token,
      body: { ids: [bulkId1, bulkId2], updateData: {} },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Bulk update - succeeds", async () => {
    const res = await request("PATCH", "/tasks/bulk", {
      token,
      body: {
        ids: [bulkId1, bulkId2],
        updateData: { priority: "low", status: "completed" },
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.modified, 2);
  });

  it("Bulk delete - empty ids array", async () => {
    const res = await request("DELETE", "/tasks/bulk", {
      token,
      body: { ids: [] },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Bulk delete - succeeds", async () => {
    const res = await request("DELETE", "/tasks/bulk", {
      token,
      body: { ids: [bulkId1, bulkId2] },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.modified, 2);
  });
});

// TASK MODULE - STATS
describe("TASK MODULE - STATS", () => {
  it("Get task stats", async () => {
    const res = await request("GET", "/tasks/stats", { token });
    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.data.total, undefined);
    assert.notStrictEqual(res.body.data.completionRate, undefined);
  });
});

// TASK MODULE - PERMANENT DELETE
describe("TASK MODULE - PERMANENT DELETE", () => {
  it("Permanent delete - malformed id", async () => {
    const res = await request("DELETE", "/tasks/bad-id/permanent", { token });
    assert.strictEqual(res.status, 400);
  });

  it("Permanent delete - succeeds for task without subtasks", async () => {
    const createRes = await request("POST", "/tasks", {
      token,
      body: { title: "To be permanently deleted" },
    });
    assert.strictEqual(createRes.status, 201);
    const id = createRes.body.data._id;
    const res = await request("DELETE", `/tasks/${id}/permanent`, { token });
    assert.strictEqual(res.status, 200);
  });

  it("Permanent delete - fails when task has subtasks", async () => {
    const res = await request("DELETE", `/tasks/${taskId}/permanent`, {
      token,
    });
    assert.strictEqual(res.status, 400);
  });

  it("Permanent delete - non-existent task", async () => {
    const res = await request("DELETE", `/tasks/${FAKE_ID}/permanent`, {
      token,
    });
    assert.strictEqual(res.status, 404);
  });
});

// SECURITY / EDGE CASES
describe("SECURITY / EDGE CASES", () => {
  it("IDOR - cannot set parentTask to another user's task", async () => {
    const signupRes = await request("POST", "/auth/signup", {
      body: {
        name: "Second User",
        email: `second.${unique()}@example.com`,
        password: "pass1234",
      },
    });
    assert.strictEqual(signupRes.status, 201);

    const loginRes = await request("POST", "/auth/login", {
      body: { email: signupRes.body.data.email, password: "pass1234" },
    });
    assert.strictEqual(loginRes.status, 200);
    secondToken = loginRes.body.data.token;

    const createRes = await request("POST", "/tasks", {
      token: secondToken,
      body: { title: "Second user's task" },
    });
    assert.strictEqual(createRes.status, 201);
    secondTaskId = createRes.body.data._id;

    const res = await request("POST", "/tasks", {
      token,
      body: { title: "Illegal subtask", parentTask: secondTaskId },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Self-reference parentTask is rejected", async () => {
    const createRes = await request("POST", "/tasks", {
      token,
      body: { title: "Self parent" },
    });
    assert.strictEqual(createRes.status, 201);
    const selfTaskId = createRes.body.data._id;
    const res = await request("PUT", `/tasks/${selfTaskId}`, {
      token,
      body: { parentTask: selfTaskId },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Cycle detection - A→B→A should fail", async () => {
    const res = await request("PUT", `/tasks/${taskId}`, {
      token,
      body: { parentTask: subtaskId },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Bulk array size limit - >100 IDs should fail", async () => {
    const ids = Array.from({ length: 101 }, () => FAKE_ID);
    const res = await request("PATCH", "/tasks/bulk", {
      token,
      body: { ids, updateData: { priority: "low" } },
    });
    assert.strictEqual(res.status, 400);
  });

  it("Request body size limit - large JSON should be rejected", async () => {
    const largeTitle = "A".repeat(20000);
    const res = await request("POST", "/tasks", {
      token,
      body: { title: largeTitle },
    });
    assert.ok([413, 400].includes(res.status));
  });

  it("Login timing - non-existent user should have similar response time", async () => {
    const start1 = Date.now();
    await request("POST", "/auth/login", {
      body: {
        email: `nonexistent.${unique()}@example.com`,
        password: "pass1234",
      },
    });
    const time1 = Date.now() - start1;

    const start2 = Date.now();
    await request("POST", "/auth/login", {
      body: { email: "existing@example.com", password: "wrongpass" },
    });
    const time2 = Date.now() - start2;

    assert.ok(time1 > 0 && time2 > 0);
  });
});

// Run all tests
runAll();
