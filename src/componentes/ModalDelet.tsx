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
        client.invalidateQueries("user");

        window.location.reload();
      },
      onError: (err) => console.log(err),
    }
  );

  function deletLink() {
    mutatedeletlink(idLink as string);
  }
  return (
    <>
      <Button
        colorScheme="white"
        onClick={onOpen}
        // className=" w-[40px] "
      >
        <Trash
          size={26}
          className=" hover:cursor-pointer"
          color={"red"}
          weight="fill"
        ></Trash>
      </Button>

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
