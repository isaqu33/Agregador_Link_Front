const LINKS = ["Meu portfólio", "Instagram", "Canal no YouTube", "Fale comigo no WhatsApp"];

// Prévia estática de uma página FaceLink dentro de um celular (só HTML/CSS).
export default function PhoneMockup() {
  return (
    <div className="relative w-[280px] h-[560px] rounded-[44px] p-[10px] bg-zinc-800 border border-zinc-700 shadow-2xl shadow-violet-900/30">
      <div className="relative w-full h-full rounded-[34px] overflow-hidden flex flex-col items-center px-5 pt-12 bg-gradient-to-b from-violet-500 via-violet-700 to-indigo-900">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[22px] rounded-full bg-zinc-900" />
        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center text-3xl font-semibold text-violet-700 ring-4 ring-white/30">
          M
        </div>
        <p className="mt-3 text-white font-semibold text-lg">@maria</p>
        <p className="text-white/75 text-xs text-center mt-1 mb-6">Designer e criadora de conteúdo</p>
        <div className="w-full flex flex-col gap-3">
          {LINKS.map((label) => (
            <div
              key={label}
              className="w-full h-11 rounded-full bg-white/95 text-violet-900 text-[13px] font-medium flex items-center justify-center"
            >
              {label}
            </div>
          ))}
        </div>
        <p className="absolute bottom-4 text-[11px] text-white/70 font-medium">FaceLink</p>
      </div>
    </div>
  );
}
