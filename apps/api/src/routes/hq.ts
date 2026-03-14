import express from "express";
import fs from "fs";
import path from "path";
import { composeBrainPrompt } from "../brain/composeBrainPrompt";
import { loadMemory } from "../services/memoryLoader";
import { loadSessionMemory, appendSessionTurn } from "../services/sessionSummaryService";
import { writeCurrentOperatorState, loadCurrentOperatorState } from "../services/currentOperatorStateService";

export const hqRouter = express.Router();

function readBrainFile(fileName: string): string {
  const filePath = path.resolve(process.cwd(), "../../brain", fileName);
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return "";
  }
}

function buildParitySystemPrompt(params: {
  dashboardState: any;
  campaignBrain: any;
  workingMemory: any;
  sessionSummary: string;
  recentTurns: any[];
  operatorState: any;
}) {
  const promptCore = readBrainFile("megan_hq_system_prompt.txt");
  const identity = readBrainFile("megan_hq_identity.md");
  const memoryPolicy = readBrainFile("memory_write_policy.md");
  const runtimeSpec = readBrainFile("hq_chat_runtime_spec.md");
  const uiContract = readBrainFile("ui_command_contract.json");
  const runtimeContext = composeBrainPrompt(params.dashboardState);

  return [
    promptCore,
    "",
    "IDENTITY",
    identity,
    "",
    "MEMORY WRITE POLICY",
    memoryPolicy,
    "",
    "RUNTIME SPEC",
    runtimeSpec,
    "",
    "UI COMMAND CONTRACT",
    uiContract,
    "",
    "CURRENT OPERATOR STATE",
    JSON.stringify(params.operatorState || {}, null, 2),
    "",
    "CAMPAIGN BRAIN",
    JSON.stringify(params.campaignBrain || {}, null, 2),
    "",
    "WORKING MEMORY",
    JSON.stringify(params.workingMemory || {}, null, 2),
    "",
    "SESSION SUMMARY",
    params.sessionSummary || "",
    "",
    "RECENT SESSION TURNS",
    JSON.stringify(params.recentTurns || [], null, 2),
    "",
    "RUNTIME CONTEXT",
    runtimeContext
  ].filter(Boolean).join("\n\n");
}

function extractResponseText(data: any): string {
  return (
    data?.output_text ||
    data?.output
      ?.flatMap((item: any) => item?.content || [])
      ?.filter((content: any) => content?.type === "output_text")
      ?.map((content: any) => content?.text || "")
      ?.join("\n") ||
    "No response"
  );
}

hqRouter.get("/state", async (_req, res) => {
  try {
    const operatorState = loadCurrentOperatorState();
    res.json({
      ok: true,
      operator_state: operatorState
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err?.message || "Unknown error"
    });
  }
});

hqRouter.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const sessionId = String(req.body?.session_id || req.body?.sessionId || "default").trim();

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "message required"
      });
    }

    let dashboardState: any = {};
    try {
      const dashboardRes = await fetch("http://127.0.0.1:4000/dashboard/state");
      dashboardState = await dashboardRes.json();
    } catch {
      dashboardState = {};
    }

    let campaignBrain: any = {};
    let workingMemory: any = {};
    try {
      const memory = await loadMemory();
      campaignBrain = memory.campaignBrain || {};
      workingMemory = memory.workingMemory || {};
    } catch {
      campaignBrain = {};
      workingMemory = {};
    }

    const operatorState = loadCurrentOperatorState();
    const sessionMemory = loadSessionMemory(sessionId);
    const userSessionState = appendSessionTurn(sessionId, "user", message);

    const systemPrompt = buildParitySystemPrompt({
      dashboardState,
      campaignBrain,
      workingMemory,
      sessionSummary: userSessionState.summary || sessionMemory.summary,
      recentTurns: userSessionState.recentTurns || sessionMemory.recentTurns,
      operatorState
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const fallbackReply = "Megan Campaign HQ API is connected, but OPENAI_API_KEY is not set yet.";

      const assistantSessionState = appendSessionTurn(sessionId, "assistant", fallbackReply);

      writeCurrentOperatorState({
        sessionId,
        sessionSummary: assistantSessionState.summary,
        recentTurns: assistantSessionState.recentTurns,
        lastUserMessage: message,
        lastAssistantMessage: fallbackReply
      });

      return res.json({
        ok: true,
        reply: fallbackReply,
        assistant_text: fallbackReply,
        routing: {},
        memory_actions: [],
        ui_commands: [],
        meta: {
          parity_mode: true,
          session_memory_enabled: true,
          continuity_enabled: true,
          session_id: sessionId,
          fallback_mode: true,
          reason: "missing_openai_api_key"
        }
      });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: message }]
          }
        ]
      })
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      return res.status(500).json({
        ok: false,
        error: "OpenAI request failed",
        details: errorText
      });
    }

    const data = await openaiRes.json();
    const text = extractResponseText(data);

    const assistantSessionState = appendSessionTurn(sessionId, "assistant", text);

    writeCurrentOperatorState({
      sessionId,
      sessionSummary: assistantSessionState.summary,
      recentTurns: assistantSessionState.recentTurns,
      lastUserMessage: message,
      lastAssistantMessage: text
    });

    return res.json({
      ok: true,
      reply: text,
      assistant_text: text,
      routing: {},
      memory_actions: [],
      ui_commands: [],
      meta: {
        parity_mode: true,
        session_memory_enabled: true,
        continuity_enabled: true,
        session_id: sessionId
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown error"
    });
  }
});
