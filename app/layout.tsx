import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ColorModeScript } from "@chakra-ui/react";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FaceLink",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* aplica o tema antes da primeira pintura, evitando o flash claro */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var m=localStorage.getItem('chakra-ui-color-mode');if(m==='dark'||(m!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ColorModeScript initialColorMode="system" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
