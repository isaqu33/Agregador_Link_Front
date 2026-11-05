import { useEffect, useState } from "react";
import Link from "next/link";
import AuthCard, { botaoAuth } from "../componentes/AuthCard";
import { Spinner } from "../componentes/Loader";
import useApi from "../server/api";

export default function VerifyEmail({ token }: { token: string }) {
  const { verifyEmail } = useApi();
  const [estado, setEstado] = useState<"verificando" | "ok" | "erro">(token ? "verificando" : "erro");

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setEstado("ok"))
      .catch(() => setEstado("erro"));
  }, [token]);

  return (
    <AuthCard titulo="Confirmação de e-mail">
      {estado === "verificando" && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
      {estado === "ok" && (
        <p className="text-sm text-zinc-700 dark:text-zinc-300" role="status">
          E-mail confirmado! Obrigado.
        </p>
      )}
      {estado === "erro" && (
        <p className="text-sm text-red-600" role="alert">
          Este link é inválido ou já foi usado. Se precisar, peça um novo no painel.
        </p>
      )}
      {estado !== "verificando" && (
        <Link href="/costumer" className={`${botaoAuth} flex items-center justify-center mt-4`}>
          Ir para o painel
        </Link>
      )}
    </AuthCard>
  );
}
