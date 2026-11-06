import { FormEvent, useState } from "react";
import Link from "next/link";
import AuthCard, { botaoAuth, inputAuth } from "../componentes/AuthCard";
import useApi from "../server/api";

export default function ForgotPassword() {
  const { forgotPassword } = useApi();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await forgotPassword(email.trim());
      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthCard
      titulo="Recuperar senha"
      subtitulo="Informe seu e-mail e enviaremos um link para criar uma nova senha."
    >
      {enviado ? (
        <p className="text-sm text-zinc-700 dark:text-zinc-300" role="status">
          Se esse e-mail estiver cadastrado, você vai receber o link em alguns minutos. Confira também o spam.
        </p>
      ) : (
        <form onSubmit={enviar} className="flex flex-col">
          <input
            className={inputAuth}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            maxLength={254}
          />
          {erro && <p className="text-red-600 text-[13px] mb-3">{erro}</p>}
          <button type="submit" disabled={carregando} className={botaoAuth}>
            {carregando ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}
      <Link
        href="/login"
        className="block text-center text-[13px] text-violet-700 dark:text-violet-300 hover:underline mt-4"
      >
        Voltar para o login
      </Link>
    </AuthCard>
  );
}
