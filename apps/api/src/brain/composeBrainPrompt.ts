import { SYSTEM_PROMPT } from "./systemPrompt";
import { WEBSITE_RULES } from "./websiteRules";
import { MESSAGING_RULES } from "./messagingRules";
import { TOOL_POLICY } from "./toolPolicy";

export function composeBrainPrompt(state: any) {
  return [
    SYSTEM_PROMPT,
    WEBSITE_RULES,
    MESSAGING_RULES,
    TOOL_POLICY,
    "Live Dashboard State:",
    JSON.stringify(state, null, 2)
  ].join("\n\n");
}
