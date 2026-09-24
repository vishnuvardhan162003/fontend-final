const PARTNERS = ['Nimbus Labs', 'Fielddesk', 'Vertek', 'Marrow', 'Cloudscript', 'Haven Retail']

export default function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="container-page">
        <p className="text-center font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
          Graduates now building at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="font-display text-sm font-semibold tracking-tight text-slate-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
