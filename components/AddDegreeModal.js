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
import { createDegree } from '@/lib/db';
import { useSWRConfig } from 'swr';
import { useAuth } from '@/lib/auth';

export default function AddDegreeModal({ college }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onSubmit = async (newDegree) => {
    const degree = {
      ...newDegree,
      collegeId: college.id,
      collegeName: college.name,
      collegeAlias: college.alias,
      universityId: college.universityId,
      universityName: college.universityName,
      universityAlias: college.universityAlias,
      slug: `${college.slug}/${newDegree.alias.toLowerCase()}`,
    };

    await mutate(
      user ? '/api/degrees' : null,
      async (degrees) => {
        const newDegree = await createDegree(degree);
        return [newDegree, ...degrees];
      },
      false
    );

    toast({
      title: 'Success!',
      description: `${degree.name} was added.`,
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
        Add degree
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add degree</ModalHeader>
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

            <FormControl id="years">
              <FormLabel>Years</FormLabel>
              <Select {...register('years')} placeholder="Select a year">
                {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
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
