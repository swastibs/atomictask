import assert from "node:assert/strict";
import test from "node:test";
import RegisterDto from "../src/modules/auth/dto/register.dto.js";
import UpdateProfileDto from "../src/modules/auth/dto/updateProfile.dto.js";

test("registration normalizes name and email and removes unknown fields", () => {
  const result = RegisterDto.validate({
    name: " Ada Lovelace ",
    email: "ADA@example.com",
    password: "a secure password",
    role: "admin",
  });

  assert.equal(result.errors, null);
  assert.deepEqual(result.value, {
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "a secure password",
  });
});

test("registration rejects passwords exceeding bcrypt's UTF-8 byte limit", () => {
  const result = RegisterDto.validate({
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "é".repeat(37),
  });

  assert.ok(result.errors);
  assert.equal(result.value, null);
});

test("profile updates reject empty changes and role assignment", () => {
  assert.ok(UpdateProfileDto.validate({}).errors);
  assert.ok(UpdateProfileDto.validate({ role: "admin" }).errors);
  assert.ok(UpdateProfileDto.validate({ name: "Ada" }).errors === null);
});
