import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../server/api";
import { ME_KEY } from "../hooks/useMe";
import { Trash } from "phosphor-react";

interface ModalDeletProp {
  idLink: string;
}

function ModalDelet({ idLink }: ModalDeletProp) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const { DeleteLink } = useApi();

  const client = useQueryClient();

  const { mutate: mutatedeletlink } = useMutation(
    (linkid: string) => DeleteLink(linkid),
    {
      onSuccess: () => {
        client.invalidateQueries(ME_KEY);
        onClose();
      },
    }
  );

  function deletLink() {
    mutatedeletlink(idLink as string);
  }
  return (
    <>
      <button
        type="button"
        aria-label="Excluir link"
        onClick={onOpen}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
      >
        <Trash size={18} />
      </button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Link
            </AlertDialogHeader>

            <AlertDialogBody>
              Realmente deseja apagar esse link? Não terá como restaurar o
              mesmo!!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={deletLink} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default ModalDelet;
