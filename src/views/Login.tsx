import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LogoApp from "../componentes/logoApp";
import PhoneMockup from "../componentes/PhoneMockup";
import ThemeToggle from "../componentes/ThemeToggle";
import screenSize from "../hooks/screenSize";
import useApi from "../server/api";

export default function Login({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const router = useRouter();
  const tamanhoTela = screenSize();
  const { registerUser } = useApi();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser({ name, email, password });
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Email ou senha inválidos");
        return;
      }

      router.replace("/costumer");
      router.refresh();
    } catch (err: any) {
      setError(
        err?.response?.status === 409
          ? "Email já cadastrado"
          : "Não foi possível concluir. Confira os dados (senha com no mínimo 8 caracteres)."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 rounded-lg px-3 mb-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition";

  return (
    <div className="w-full min-h-[100vh] box-border flex flex-col px-6 py-5">
      <div className="flex items-center justify-between">
        <LogoApp />
        <ThemeToggle />
      </div>
      <div className="w-[100%]  flex-1  flex justify-around items-center flex-wrap-reverse m-0 p-[5px] box-border">
        {tamanhoTela > 916 ? <PhoneMockup /> : null}

        <div className="w-full max-w-[400px] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Bem-vindo!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">{mode === "login" ? "Entre na sua conta para continuar." : "Crie sua conta em poucos segundos."}</p>

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/costumer" })}
                className="w-full h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <img src="/assets/google.png" alt="" width={18} height={18} />
                Continuar com Google
              </button>
              <div className="flex items-center gap-3 my-4 text-xs text-zinc-400">
                <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                ou
                <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            {mode === "register" && (
              <input
                className={inputClass}
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            )}
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : 1}
              maxLength={72}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {mode === "login" && (
              <Link href="/forgot-password" className="self-end -mt-1 mb-3 text-[13px] text-violet-700 dark:text-violet-300 hover:underline">
                Esqueci minha senha
              </Link>
            )}

            {error && <p className="text-red-600 text-[13px] mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium mb-4 transition-colors disabled:opacity-60"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
            </button>

            <button
              type="button"
              className="text-[13px] text-violet-700 dark:text-violet-300 hover:underline"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "register" : "login");
              }}
            >
              {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
