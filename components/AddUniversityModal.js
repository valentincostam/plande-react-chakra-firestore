import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { useForm } from 'react-hook-form';
import { createUniversity } from '@/lib/db';
import { useSWRConfig } from 'swr';
import { useAuth } from '@/lib/auth';

export default function AddUniversityModal() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onSubmit = async (newUniversity) => {
    const university = {
      ...newUniversity,
      slug: newUniversity.alias.toLowerCase(),
    };

    await mutate(
      user ? '/api/universities' : null,
      async (universities) => {
        const newUniversity = await createUniversity(university);
        return [newUniversity, ...universities];
      },
      false
    );

    toast({
      title: 'Success!',
      description: `${university.name} was added.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });

    reset();

    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} mb="4">
        Add university
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add university</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input {...register('name')} />
            </FormControl>
            <FormControl id="alias">
              <FormLabel>Alias</FormLabel>
              <Input {...register('alias')} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr="2">
              Close
            </Button>
            <Button colorScheme="gray" type="submit">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
