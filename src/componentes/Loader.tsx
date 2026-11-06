// Indicadores de carregamento (spinner e esqueleto da pré-visualização).

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={`inline-block w-8 h-8 rounded-full border-[3px] border-violet-200 dark:border-zinc-700 border-t-violet-600 dark:border-t-violet-400 animate-spin ${className}`}
    />
  );
}

export default function Loader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={`w-full flex items-center justify-center ${fullScreen ? "min-h-[100vh]" : "min-h-[300px]"}`}
    >
      <Spinner />
    </div>
  );
}

export function PreviewSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center px-5 pt-12 animate-pulse bg-zinc-200 dark:bg-zinc-800">
      <div className="w-20 h-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <div className="w-32 h-4 rounded bg-zinc-300 dark:bg-zinc-700 mt-4" />
      <div className="w-44 h-3 rounded bg-zinc-300 dark:bg-zinc-700 mt-2 mb-6" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-full h-11 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-3" />
      ))}
    </div>
  );
}
