import assert from "node:assert/strict";
import test from "node:test";
import { getMongoDatabaseName } from "../src/common/config/envConfig.js";

test("NODE_ENV selects the matching AtomicTasks database", () => {
  assert.equal(getMongoDatabaseName("development"), "atomictask_dev");
  assert.equal(getMongoDatabaseName("stage"), "atomictask_stage");
  assert.equal(getMongoDatabaseName("production"), "atomictask_prod");
});

test("unsupported NODE_ENV values are rejected", () => {
  assert.throws(() => getMongoDatabaseName("test"), /Unsupported NODE_ENV/);
});
