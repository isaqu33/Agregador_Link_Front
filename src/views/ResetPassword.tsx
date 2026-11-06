import { FormEvent, useState } from "react";
import Link from "next/link";
import AuthCard, { botaoAuth, inputAuth } from "../componentes/AuthCard";
import useApi from "../server/api";

export default function ResetPassword({ token }: { token: string }) {
  const { resetPassword } = useApi();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    if (senha !== confirma) {
      setErro("As senhas não conferem.");
      return;
    }
    setCarregando(true);
    try {
      await resetPassword(token, senha);
      setOk(true);
    } catch (err: any) {
      setErro(
        err?.response?.status === 400 && !Array.isArray(err?.response?.data?.message)
          ? "Este link é inválido ou expirou. Peça um novo."
          : "Não foi possível redefinir. A senha precisa ter de 8 a 72 caracteres."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (!token) {
    return (
      <AuthCard titulo="Link inválido">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Este link não é válido.</p>
        <Link
          href="/forgot-password"
          className="block text-center text-[13px] text-violet-700 dark:text-violet-300 hover:underline mt-4"
        >
          Pedir um novo link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard titulo="Nova senha" subtitulo="Escolha uma senha com pelo menos 8 caracteres.">
      {ok ? (
        <>
          <p className="text-sm text-zinc-700 dark:text-zinc-300" role="status">
            Senha alterada com sucesso!
          </p>
          <Link href="/login" className={`${botaoAuth} flex items-center justify-center mt-4`}>
            Entrar
          </Link>
        </>
      ) : (
        <form onSubmit={enviar} className="flex flex-col">
          <input
            className={inputAuth}
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
          />
          <input
            className={inputAuth}
            type="password"
            placeholder="Repita a nova senha"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
          />
          {erro && <p className="text-red-600 text-[13px] mb-3">{erro}</p>}
          <button type="submit" disabled={carregando} className={botaoAuth}>
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
