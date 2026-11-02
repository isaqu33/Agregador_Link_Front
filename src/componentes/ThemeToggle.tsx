import { useColorMode } from "@chakra-ui/react";
import { Moon, Sun } from "phosphor-react";

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const escuro = colorMode === "dark";

  return (
    <button
      type="button"
      onClick={toggleColorMode}
      aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
