import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "../api.js";
import { recoverAlreadyDeliveredPoll } from "./login.js";

test("recovers an already_delivered poll response from a 409", () => {
  const error = new ApiError("", 409, { status: "already_delivered" });
  assert.deepEqual(recoverAlreadyDeliveredPoll(error), error.body);
});
