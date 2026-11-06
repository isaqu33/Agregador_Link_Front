"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

// QR Code gerado no navegador (nada é enviado a terceiros).
export default function QrCode({
  texto,
  tamanho = 200,
  className = "",
}: {
  texto: string;
  tamanho?: number;
  className?: string;
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let vivo = true;
    QRCode.toDataURL(texto, { width: tamanho * 2, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => vivo && setSrc(url))
      .catch(() => vivo && setSrc(""));
    return () => {
      vivo = false;
    };
  }, [texto, tamanho]);

  if (!src)
    return (
      <div style={{ width: tamanho, height: tamanho }} className={`bg-zinc-100 rounded-lg ${className}`} />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt="QR Code"
      width={tamanho}
      height={tamanho}
      className={`rounded-lg bg-white ${className}`}
    />
  );
}
