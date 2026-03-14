import fs from "fs";
import path from "path";

export function loadSystemPrompt(){
 const p=path.resolve(process.cwd(),"../../brain/megan_hq_system_prompt.txt");
 return fs.readFileSync(p,"utf8");
}

export function buildRuntimePrompt(ctx:any){
 return [
  ctx.systemPrompt,
  "RUNTIME CONTEXT",
  JSON.stringify(ctx.dashboardState||{},null,2),
  JSON.stringify(ctx.campaignBrain||{},null,2),
  JSON.stringify(ctx.workingMemory||{},null,2)
 ].join("\n\n");
}
