import { useQuery } from "react-query";
import useApi from "../server/api";
import { usePageContext } from "../contexts/PageContext";
import { dataToPreviue } from "../utils/types";

// Chave única do usuário logado (perfil + links). Invalide com
// `queryClient.invalidateQueries(ME_KEY)` depois de qualquer mutation: as páginas extras usam
// chaves que começam por ME_KEY, então a mesma chamada atualiza a página aberta no painel.
export const ME_KEY = "me";

export const pageKey = (pageId: string) => (pageId ? [ME_KEY, "page", pageId] : ME_KEY);

// Perfil + links da página que o painel está editando (principal ou extra) + dados da conta
// (e-mail, confirmação, lista de páginas), sempre no mesmo formato.
export default function useMe(options?: { onError?: () => void }) {
  const { getMe, getPage } = useApi();
  const { pageId } = usePageContext();

  const account = useQuery(ME_KEY, getMe, {
    staleTime: 1000 * 60 * 5,
    select: (res) => res.data as dataToPreviue,
    onError: options?.onError,
  });

  const page = useQuery(pageKey(pageId) as any, () => getPage(pageId), {
    enabled: !!pageId,
    staleTime: 1000 * 60 * 5,
    select: (res: any) => res.data as dataToPreviue,
  });

  if (!pageId) return account;

  return {
    ...page,
    data: page.data && {
      ...page.data,
      email: account.data?.email,
      emailVerified: account.data?.emailVerified,
      pages: account.data?.pages,
    },
  } as typeof account;
}
