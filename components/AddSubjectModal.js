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
  Text,
  Checkbox,
  UnorderedList,
  ListItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  HStack,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { useForm } from 'react-hook-form';
import { createSubject } from '@/lib/db';
import { useSWRConfig } from 'swr';
import { useAuth } from '@/lib/auth';
import { Timestamp } from '@firebase/firestore';
import SUBJECT_STATES from 'constants/subject-states';
import SEMESTERS from 'constants/semesters';
import TAGS from 'constants/tags';

const { REGULAR, APROBADA } = SUBJECT_STATES;

export default function AddSubjectModal({ degree, subjects }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onSubmit = async (newSubject) => {
    // TODO: Add loading state for the "Add" button on creation.
    const subject = {
      ...newSubject,
      degreeId: degree.id,
      createdAt: Timestamp.now(),
    };

    const requirementsForAttending = newSubject.requirementsForAttending ?? [];
    const requirementsForPassing = newSubject.requirementsForPassing ?? [];

    // TODO: Deduplicate code.
    subject.requirementsForAttending = requirementsForAttending
      .filter(({ isRequired }) => isRequired)
      .map(({ id, requiredState, name }) => ({ id, requiredState, name }));

    subject.requirementsForPassing = requirementsForPassing
      .filter(({ isRequired }) => isRequired)
      .map(({ id, requiredState, name }) => ({ id, requiredState, name }));

    // TODO: Create variables to make this cleaner.
    await mutate(
      user ? '/api/subjects' : null,
      async (subjects) => {
        const newSubject = await createSubject(subject);

        return [...subjects, newSubject];
      },
      false
    );

    toast({
      title: 'Success!',
      description: `${subject.name} was added.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });

    reset();

    onClose();
  };

  const years = Array.from({ length: degree.years }, (_, i) => i + 1);

  // TODO: Reduce template by creating some new components (maybe for the requirement lists).
  return (
    <>
      <Button onClick={onOpen} mb="4">
        Agregar materia
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Agregar materia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name">
              <FormLabel>Nombre</FormLabel>
              <Input {...register('name')} />
            </FormControl>

            <FormControl id="year">
              <FormLabel>Año</FormLabel>
              <Select
                {...register('year', { value: '1' })}
                placeholder="Select a year"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="semester">
              <FormLabel>Cuatrimestre</FormLabel>
              {/* TODO: Set default value. */}
              <RadioGroup>
                {Object.values(SEMESTERS).map(({ value, text }) => (
                  <Radio key={value} {...register('semester')} value={value}>
                    {text}
                  </Radio>
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl id="classload">
              <FormLabel>Carga horaria anual</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField {...register('classload')} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel mb="0">Etiquetas</FormLabel>
              <HStack>
                {Object.values(TAGS).map(({ value, text }) => (
                  <Checkbox key={value} {...register('tags')} value={value}>
                    {text}
                  </Checkbox>
                ))}
              </HStack>
            </FormControl>

            {subjects.length > 0 && (
              <>
                <Text fontWeight="500">Requisitos para cursar</Text>
                <UnorderedList m="0">
                  {subjects.map(({ id, name }, index) => (
                    <ListItem
                      display="flex"
                      justifyContent="space-between"
                      key={id}
                    >
                      <Input
                        type="hidden"
                        value={id}
                        {...register(`requirementsForAttending.${index}.id`)}
                      />
                      <Input
                        type="hidden"
                        value={name}
                        {...register(`requirementsForAttending.${index}.name`)}
                      />
                      <Checkbox
                        {...register(
                          `requirementsForAttending.${index}.isRequired`
                        )}
                      >
                        {name}
                      </Checkbox>
                      <Select
                        {...register(
                          `requirementsForAttending.${index}.requiredState`
                        )}
                        w="150px"
                      >
                        <option value={REGULAR.value} defaultValue>
                          {REGULAR.text}
                        </option>
                        <option value={APROBADA.value}>{APROBADA.text}</option>
                      </Select>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}

            {subjects.length > 0 && (
              <>
                <Text fontWeight="500">Requisitos para aprobar</Text>
                <UnorderedList m="0">
                  {subjects.map(({ id, name }, index) => (
                    <ListItem
                      display="flex"
                      justifyContent="space-between"
                      key={id}
                    >
                      <Input
                        type="hidden"
                        value={id}
                        {...register(`requirementsForPassing.${index}.id`)}
                      />
                      <Input
                        type="hidden"
                        value={name}
                        {...register(`requirementsForPassing.${index}.name`)}
                      />
                      <Checkbox
                        {...register(
                          `requirementsForPassing.${index}.isRequired`
                        )}
                      >
                        {name}
                      </Checkbox>
                      <Select
                        {...register(
                          `requirementsForPassing.${index}.requiredState`,
                          { value: APROBADA.value }
                        )}
                        w="150px"
                      >
                        <option value={REGULAR.value} defaultValue>
                          {REGULAR.text}
                        </option>
                        <option value={APROBADA.value}>{APROBADA.text}</option>
                      </Select>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr="2">
              Cerrar
            </Button>
            <Button colorScheme="gray" type="submit">
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
