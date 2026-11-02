import { Link as IconLink } from "phosphor-react";

export default function LogoApp() {
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm">
        <IconLink size={20} weight="bold" color="#ffffff" />
      </span>
      <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Face<span className="text-violet-600 dark:text-violet-400">Link</span>
      </span>
    </div>
  );
}
