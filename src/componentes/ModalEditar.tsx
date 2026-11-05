import {
  useDisclosure,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { PencilSimpleLine } from "phosphor-react";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ME_KEY } from "../hooks/useMe";
import useApi from "../server/api";
import { link } from "../utils/types";
import { montarLink, tipoPorNome, valorDoLink } from "../utils/objectstoberendered";

interface ModalEditarProp {
  dataLink: link;
}

function ModalEditar({ dataLink }: ModalEditarProp) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tipo = tipoPorNome(dataLink.type);
  const semUrl = tipo?.campo === "nenhum";
  const { editLink } = useApi();
  const client = useQueryClient();

  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");
  const [erros, setErros] = useState<{ nome?: string; url?: string; geral?: string }>({});

  const { mutate, isLoading } = useMutation(
    (link: string) => editLink({ id: dataLink.id as string, name: nome.trim(), ...(semUrl ? {} : { link }) }),
    {
      onSuccess: async () => {
        await client.invalidateQueries(ME_KEY);
        onClose();
      },
      onError: () => setErros({ geral: "Não foi possível salvar. Tente novamente." }),
    }
  );

  function abrir() {
    setNome(dataLink.name ?? "");
    setUrl(valorDoLink(tipo, dataLink.link));
    setErros({});
    onOpen();
  }

  function salvar(e: FormEvent) {
    e.preventDefault();

    const novos: typeof erros = {};
    if (!nome.trim()) novos.nome = "Informe um título";
    let link = "";
    if (!semUrl) {
      const r = montarLink(tipo ?? { campo: "url" } as any, url);
      if (r.erro) novos.url = r.erro;
      link = r.link;
    }
    setErros(novos);
    if (Object.keys(novos).length) return;

    mutate(link);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Editar link"
        onClick={abrir}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/20 transition-colors"
      >
        <PencilSimpleLine size={18} />
      </button>

      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={salvar} noValidate>
          <ModalHeader>Editar link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!erros.nome} mb={4}>
              <FormLabel fontSize="sm">Título</FormLabel>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={100} autoFocus />
              <FormErrorMessage>{erros.nome}</FormErrorMessage>
            </FormControl>

            {!semUrl && (
              <FormControl isInvalid={!!erros.url}>
                <FormLabel fontSize="sm">
                  {tipo?.campo === "email" ? "E-mail" : tipo?.campo === "telefone" || tipo?.campo === "whatsapp" ? "Número" : "Link"}
                </FormLabel>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  maxLength={2000}
                  placeholder={tipo?.placeholder ?? "https://"}
                />
                <FormErrorMessage>{erros.url}</FormErrorMessage>
              </FormControl>
            )}

            {erros.geral && <p className="text-red-600 text-sm mt-3">{erros.geral}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="purple" isLoading={isLoading}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalEditar;
