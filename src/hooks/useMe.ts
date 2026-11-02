import { useQuery } from "react-query";
import useApi from "../server/api";
import { dataToPreviue } from "../utils/types";

// Chave única do usuário logado (perfil + links). Invalide com
// `queryClient.invalidateQueries(ME_KEY)` depois de qualquer mutation.
export const ME_KEY = "me";

export default function useMe(options?: { onError?: () => void }) {
  const { getMe } = useApi();

  return useQuery(ME_KEY, getMe, {
    staleTime: 1000 * 60 * 5,
    select: (res) => res.data as dataToPreviue,
    onError: options?.onError,
  });
}
