export function AskHQPane() {
  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-4">
      <div className="mb-2 text-lg font-semibold">Ask HQ</div>
      <div className="mb-4 text-sm text-slate-300">
        Persistent GPT pane placeholder. Wire this to the Custom GPT tool bridge so all state reads and writes happen through structured backend tools.
      </div>
      <div className="flex-1 rounded-xl border border-dashed border-white/10 p-3 text-sm text-slate-400">
        Example prompts:
        <ul className="mt-2 list-disc pl-5">
          <li>Show me the approval backlog.</li>
          <li>Generate today&apos;s daily campaign brief.</li>
          <li>Create an intake item for a website homepage update request.</li>
        </ul>
      </div>
    </div>
  );
}
