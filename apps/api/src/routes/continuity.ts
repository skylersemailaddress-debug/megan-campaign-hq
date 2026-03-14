import express from "express";
import fs from "fs";
import path from "path";

export const continuityRouter = express.Router();

function runtimeDir() {
  return path.resolve(process.cwd(), "../../brain/runtime_sessions");
}

function readJson(file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

continuityRouter.get("/latest", (_req, res) => {
  const dir = runtimeDir();

  const operator = readJson(path.join(dir, "current_operator_state.json"));
  const summary = readJson(path.join(dir, "latest_session_summary.json"));

  res.json({
    ok: true,
    operator_state: operator,
    session_summary: summary
  });
});
