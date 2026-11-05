"use client";

import LogoApp from "./logoApp";
import ThemeToggle from "./ThemeToggle";

// Casca das telas de autenticação simples (recuperar senha, confirmar e-mail)
export default function AuthCard({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: React.ReactNode }) {
  return (
    <div className="w-full min-h-[100vh] box-border flex flex-col px-6 py-5">
      <div className="flex items-center justify-between">
        <LogoApp />
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[400px] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{titulo}</h1>
          {subtitulo ? <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitulo}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const inputAuth =
  "w-full h-11 rounded-lg px-3 mb-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-500/30 transition";
export const botaoAuth =
  "w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60";
