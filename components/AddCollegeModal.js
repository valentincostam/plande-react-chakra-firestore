import {
  Button,
  Input,
  FormControl,
  Select,
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
import { createCollege } from '@/lib/db';
import { useSWRConfig } from 'swr';
import { useAuth } from '@/lib/auth';

export default function AddCollegeModal({ university }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onSubmit = async (newCollege) => {
    const college = {
      ...newCollege,
      universityId: university.id,
      universityName: university.name,
      universityAlias: university.alias,
      slug: `${university.slug}/${newCollege.alias.toLowerCase()}`,
    };

    await mutate(
      user ? '/api/colleges' : null,
      async (colleges) => {
        const newCollege = await createCollege(college);
        return [newCollege, ...colleges];
      },
      false
    );

    toast({
      title: 'Success!',
      description: `${college.name} was added.`,
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
        Add college
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add college</ModalHeader>
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
