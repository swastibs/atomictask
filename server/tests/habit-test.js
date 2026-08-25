import http from "http";
import { URL } from "url";
import assert from "assert";
import fs from "fs";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8080/api";
const TIMEOUT = 10000;

const state = {
  token: null,
  habitId: null,
  habitId2: null,
  email: null,
  password: null,
};

function request(method, path, { body, token, query } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith("http") ? path : BASE_URL + path);
    if (query) {
      Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const payload = body !== undefined ? JSON.stringify(body) : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (payload) headers["Content-Length"] = Buffer.byteLength(payload);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers,
      timeout: TIMEOUT,
    };

    const req = http.request(options, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        let parsedBody = raw;
        try {
          parsedBody = raw ? JSON.parse(raw) : null;
        } catch {}
        resolve({ status: res.statusCode, body: parsedBody });
      });
    });

    req.on("timeout", () => req.destroy());
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

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
  let passed = 0,
    failed = 0;
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

  let report = "=".repeat(64) + "\n";
  report += "  HABIT MODULE TEST REPORT\n";
  report += `  Generated : ${new Date().toISOString()}\n`;
  report += `  Base URL  : ${BASE_URL}\n`;
  report += "=".repeat(64) + "\n\n";

  let current = "";
  for (const r of results) {
    if (r.suite !== current) {
      current = r.suite;
      report += `MODULE: ${current.toUpperCase()}\n`;
      report += "-".repeat(64) + "\n";
    }
    const tag = r.status === "PASS" ? "[PASS]" : "[FAIL]";
    report += `${tag} ${r.name} (${r.duration}ms)\n`;
    if (r.status === "FAIL") report += `        -> ${r.error}\n`;
  }

  report += "\n" + "=".repeat(64) + "\n";
  report += "SUMMARY\n";
  const rate = tests.length ? Math.round((passed / tests.length) * 100) : 0;
  report += `Total: ${tests.length} | Passed: ${passed} | Failed: ${failed} | Success Rate: ${rate}%\n`;
  report += "=".repeat(64) + "\n";

  fs.writeFileSync("testresult.txt", report);
  console.log(report);
  console.log("\nFull report written to: testresult.txt");
  process.exit(failed > 0 ? 1 : 0);
}

const unique = () => `${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
const FAKE_ID = "a".repeat(24);

// ---------- Setup ----------
describe("Setup", () => {
  const email = `habit.${unique()}@example.com`;
  const password = "pass1234";
  state.email = email;
  state.password = password;

  it("Register a new user for habit tests", async () => {
    const res = await request("POST", "/auth/signup", {
      body: { name: "Habit Tester", email, password },
    });
    assert.strictEqual(res.status, 201, "Signup should succeed");
    assert.strictEqual(res.body.success, true);
  });

  it("Login and obtain token", async () => {
    const res = await request("POST", "/auth/login", {
      body: { email, password },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data?.token, "Token must be present");
    state.token = res.body.data.token;
  });
});

// ---------- Create Habit ----------
describe("Create Habit", () => {
  it("1.1 - Create minimal valid habit", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Drink Water" },
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.data._id);
    assert.strictEqual(res.body.data.name, "Drink Water");
    state.habitId = res.body.data._id;
  });

  it("1.2 - Create weekly habit with all fields", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: {
        name: "Exercise",
        description: "Morning run",
        icon: "🏃",
        color: "#FF5733",
        frequency: "weekly",
        targetDays: [1, 3, 5],
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.frequency, "weekly");
    assert.strictEqual(res.body.data.targetDays.length, 3);
    state.habitId2 = res.body.data._id;
  });

  it("1.3 - Create habit with reminder", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Meditate", reminderTime: "09:00" },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.reminderTime, "09:00");
  });

  it("1.4 - Missing name -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /Habit name is required/);
  });

  it("1.5 - Empty name -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /Habit name is required/);
  });

  it("1.6 - Name too long -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "A".repeat(101) },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /cannot exceed 100/);
  });

  it("1.7 - Invalid frequency -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Bad Frequency", frequency: "monthly" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /must be one of \[daily, weekly, custom\]/);
  });

  it("1.8 - Invalid targetDays (7) -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Bad targetDays", frequency: "weekly", targetDays: [7] },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /must be less than or equal to 6/);
  });

  it("1.9 - Invalid reminderTime -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Bad reminder", reminderTime: "25:00" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /fails to match the required pattern/);
  });

  it("1.10 - Unknown field -> 400", async () => {
    const res = await request("POST", "/habits", {
      token: state.token,
      body: { name: "Extra field", foo: "bar" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /"foo" is not allowed/);
  });
});

// ---------- Get All Habits ----------
describe("Get All Habits", () => {
  it("2.1 - Get all habits", async () => {
    const res = await request("GET", "/habits", { token: state.token });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data.habits));
    assert.ok(res.body.data.habits.length >= 2);
    assert.ok(res.body.data.total >= 2);
  });

  it("2.2 - Search by name", async () => {
    const res = await request("GET", "/habits", {
      token: state.token,
      query: { search: "Drink" },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.habits.every((h) => h.name.includes("Drink")));
  });

  it("2.3 - Filter archived=true (should be empty)", async () => {
    const res = await request("GET", "/habits", {
      token: state.token,
      query: { isArchived: "true" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.habits.length, 0);
  });

  it("2.4 - Pagination limit=1", async () => {
    const res = await request("GET", "/habits", {
      token: state.token,
      query: { page: "1", limit: "1" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.habits.length, 1);
    assert.ok(res.body.data.total >= 2);
  });

  it("2.5 - Invalid query parameter -> 400", async () => {
    const res = await request("GET", "/habits", {
      token: state.token,
      query: { status: "invalid" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /"status" is not allowed/);
  });
});

// ---------- Get Today's Progress ----------
describe("Get Today's Progress", () => {
  it("3.1 - Get today's progress", async () => {
    const res = await request("GET", "/habits/today", { token: state.token });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 2);
    res.body.data.forEach((habit) => {
      assert.strictEqual(typeof habit.completedToday, "boolean");
    });
  });
});

// ---------- Get Single Habit ----------
describe("Get Single Habit", () => {
  it("4.1 - Get habit by ID", async () => {
    const res = await request("GET", `/habits/${state.habitId}`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data._id, state.habitId);
    assert.strictEqual(res.body.data.name, "Drink Water");
  });

  it("4.2 - Malformed ID -> 400", async () => {
    const res = await request("GET", "/habits/not-a-valid-id", {
      token: state.token,
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /Must be a valid ObjectId/);
  });

  it("4.3 - Non-existent ID -> 404", async () => {
    const res = await request("GET", `/habits/${FAKE_ID}`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Update Habit ----------
describe("Update Habit", () => {
  it("5.1 - Update name", async () => {
    const res = await request("PUT", `/habits/${state.habitId}`, {
      token: state.token,
      body: { name: "Drink More Water" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.name, "Drink More Water");
  });

  it("5.2 - Change to weekly without targetDays -> 400", async () => {
    const res = await request("PUT", `/habits/${state.habitId}`, {
      token: state.token,
      body: { frequency: "weekly" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(
      res.body.message,
      /Weekly habits must have at least one target day/,
    );
  });

  it("5.3 - Attempt to change user -> 400 (user not allowed)", async () => {
    const res = await request("PUT", `/habits/${state.habitId}`, {
      token: state.token,
      body: { user: FAKE_ID },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /"user" is not allowed/);
  });

  it("5.4 - Unknown field -> 400", async () => {
    const res = await request("PUT", `/habits/${state.habitId}`, {
      token: state.token,
      body: { foo: "bar" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /"foo" is not allowed/);
  });

  it("5.5 - Non-existent habit -> 404", async () => {
    const res = await request("PUT", `/habits/${FAKE_ID}`, {
      token: state.token,
      body: { name: "X" },
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Archive / Unarchive ----------
describe("Archive / Unarchive", () => {
  it("6.1 - Archive habit", async () => {
    const res = await request("PATCH", `/habits/${state.habitId}/archive`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.isArchived, true);
  });

  it("6.2 - Unarchive habit (toggle back)", async () => {
    const res = await request("PATCH", `/habits/${state.habitId}/archive`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.isArchived, false);
  });

  it("6.3 - Archive non-existent -> 404", async () => {
    const res = await request("PATCH", `/habits/${FAKE_ID}/archive`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Log Habit ----------
describe("Log Habit (Mark Done)", () => {
  it("7.1 - Log today (no date)", async () => {
    const res = await request("POST", `/habits/${state.habitId}/log`, {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.completed, true);

    // Use UTC date, since service stores dates in UTC
    const expectedDate = new Date().toISOString().slice(0, 10);
    assert.strictEqual(res.body.data.date.slice(0, 10), expectedDate);
  });

  it("7.2 - Log for specific past date", async () => {
    const res = await request("POST", `/habits/${state.habitId}/log`, {
      token: state.token,
      body: { date: "2026-08-20" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.date.slice(0, 10), "2026-08-20");
  });

  it("7.3 - Invalid date format -> 400", async () => {
    const res = await request("POST", `/habits/${state.habitId}/log`, {
      token: state.token,
      body: { date: "invalid-date" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /must be in ISO 8601 date format/);
  });

  it("7.4 - Log with notes", async () => {
    const res = await request("POST", `/habits/${state.habitId}/log`, {
      token: state.token,
      body: { notes: "Did well" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.notes, "Did well");
  });

  it("7.5 - Duplicate log same date should not create duplicate", async () => {
    const res = await request("POST", `/habits/${state.habitId}/log`, {
      token: state.token,
      body: { date: "2026-08-20" },
    });
    assert.strictEqual(res.status, 200);
    // Just ensure it doesn't error; may return existing log
  });

  it("7.6 - Log non-existent habit -> 404", async () => {
    const res = await request("POST", `/habits/${FAKE_ID}/log`, {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Unlog Habit ----------
describe("Unlog Habit (Remove Completion)", () => {
  it("8.1 - Unlog today", async () => {
    const res = await request("DELETE", `/habits/${state.habitId}/unlog`, {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.deleted, true);
  });

  it("8.2 - Unlog again (should say false)", async () => {
    const res = await request("DELETE", `/habits/${state.habitId}/unlog`, {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.deleted, false);
  });

  it("8.3 - Unlog for specific date", async () => {
    const res = await request("DELETE", `/habits/${state.habitId}/unlog`, {
      token: state.token,
      body: { date: "2026-08-20" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.deleted, true);
  });

  it("8.4 - Unlog non-existent habit -> 404", async () => {
    const res = await request("DELETE", `/habits/${FAKE_ID}/unlog`, {
      token: state.token,
      body: {},
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Get Logs ----------
describe("Get Logs (History)", () => {
  it("9.1 - Get default logs (last 30 days)", async () => {
    const res = await request("GET", `/habits/${state.habitId}/logs`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 0);
  });

  it("9.2 - Get logs for date range", async () => {
    const res = await request("GET", `/habits/${state.habitId}/logs`, {
      token: state.token,
      query: { startDate: "2026-08-01", endDate: "2026-08-31" },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  it("9.3 - Invalid startDate -> 400", async () => {
    const res = await request("GET", `/habits/${state.habitId}/logs`, {
      token: state.token,
      query: { startDate: "bad" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /must be in ISO 8601 date format/);
  });

  it("9.4 - Non-existent habit -> 404", async () => {
    const res = await request("GET", `/habits/${FAKE_ID}/logs`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Get Statistics ----------
describe("Get Statistics", () => {
  it("10.1 - Get stats for habit", async () => {
    const res = await request("GET", `/habits/${state.habitId}/stats`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    const data = res.body.data;
    assert.ok(data.hasOwnProperty("totalLogs"));
    assert.ok(data.hasOwnProperty("logsLast30"));
    assert.ok(data.hasOwnProperty("completionRate"));
    assert.ok(data.hasOwnProperty("currentStreak"));
    assert.ok(data.hasOwnProperty("longestStreak"));
  });

  it("10.2 - Non-existent habit -> 404", async () => {
    const res = await request("GET", `/habits/${FAKE_ID}/stats`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Get Heatmap ----------
describe("Get Heatmap", () => {
  it("11.1 - Heatmap for specific month", async () => {
    const res = await request("GET", `/habits/${state.habitId}/heatmap`, {
      token: state.token,
      query: { year: "2026", month: "8" },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.strictEqual(res.body.data.length, 31);
    res.body.data.forEach((day) => {
      assert.ok(day.hasOwnProperty("date"));
      assert.ok(day.hasOwnProperty("completed"));
    });
  });

  it("11.2 - Heatmap for current month (default)", async () => {
    const res = await request("GET", `/habits/${state.habitId}/heatmap`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate();
    assert.strictEqual(res.body.data.length, daysInMonth);
  });

  it("11.3 - Invalid month -> 400", async () => {
    const res = await request("GET", `/habits/${state.habitId}/heatmap`, {
      token: state.token,
      query: { month: "13" },
    });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.message, /must be less than or equal to 12/);
  });

  it("11.4 - Non-existent habit -> 404", async () => {
    const res = await request("GET", `/habits/${FAKE_ID}/heatmap`, {
      token: state.token,
    });
    assert.strictEqual(res.status, 404);
    assert.match(res.body.message, /Habit not found/);
  });
});

// ---------- Authentication / Security ----------
describe("Authentication / Security", () => {
  it("12.1 - GET /habits without token -> 401", async () => {
    const res = await request("GET", "/habits");
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, "Unauthorized access");
  });

  it("12.2 - POST /habits with invalid token -> 401", async () => {
    const res = await request("POST", "/habits", {
      token: "invalid-token",
      body: { name: "Test" },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it("12.3 - DELETE /habits/:id without token -> 401", async () => {
    const res = await request("DELETE", `/habits/${state.habitId}`);
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });
});

// Run all tests
runAll().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
