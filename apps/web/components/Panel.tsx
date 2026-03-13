import { ReactNode } from 'react';

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/90">{title}</div>
      {children}
    </section>
  );
}
