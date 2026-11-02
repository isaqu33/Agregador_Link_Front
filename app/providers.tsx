'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../src/redux/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider disableGlobalStyle={true}>{children}</ChakraProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
