'use client';

import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

// "system" segue o sistema até o usuário escolher; a escolha fica no localStorage do Chakra
const theme = extendTheme({
  config: { initialColorMode: 'system', useSystemColorMode: false },
});

// O Tailwind usa a classe `dark` no <html>; o Chakra é a fonte única do tema.
function ThemeSync() {
  const { colorMode } = useColorMode();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
  }, [colorMode]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // limpa o cache do Redux persistido que versões antigas gravavam no navegador
  useEffect(() => {
    try {
      localStorage.removeItem('persist:root');
    } catch {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} disableGlobalStyle={true}>
        <ThemeSync />
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
