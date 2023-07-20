import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//imports do react router dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

//imports das pages para adicionar no 'link' do reactRouter
import Links from "./pages/Links";
import Appearance from "./pages/Appearance";
import Apresentacao from "./pages/apresentacao";
import PerfilId from "./pages/PerfilId";
import Login from "./pages/Login";

//import necessáro para o twindsCss funcionar
import "./global.css";

//import para private rout
import PrivateRoute from "./routes/PrivateRoute";

import Preview from "./pages/Preview";

//importações para o provaider do redux
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

// importações para persist
import { PersistGate } from "redux-persist/integration/react";

// imports do react aquery
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ChakraProvider } from "@chakra-ui/react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<Apresentacao />} /> */}

              <Route path="/login" element={<Login />} />

              <Route path="costumer" element={<PrivateRoute rout={<App />} />}>
                <Route index element={<Links />}></Route>
                <Route path="appearance" element={<Appearance />} />
                {/* <Route path="preview" element={<Preview />} /> */}
              </Route>

              <Route path=":id" element={<PerfilId />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
