import { Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useState } from 'react';

export default function SubjectsTable({ subjects, onDelete }) {
  const [loadingStatuses, setLoadingStatuses] = useState({});
  const onDeleteSubject = async (id) => {
    setLoadingStatuses({
      [id]: true,
      ...loadingStatuses,
    });

    await onDelete(id);

    setLoadingStatuses({
      [id]: false,
      ...loadingStatuses,
    });
  };

  return (
    // TODO: Add empty message.
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Year</Th>
          <Th>Semester</Th>
          <Th>Classload</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {subjects.map(
          ({
            id,
            name,
            year,
            semester,
            classload,
            isOptional,
            isIntegrative,
          }) => (
            <Tr key={id}>
              <Td>
                {name} {isOptional && '(Optional)'}{' '}
                {isIntegrative && '(Integrative)'}
              </Td>
              <Td>{year}</Td>
              <Td>{['Annual', 'First', 'Second'][semester]}</Td>
              <Td>{classload}</Td>
              <Td>
                <Button
                  isLoading={loadingStatuses[id]}
                  onClick={() => onDeleteSubject(id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  );
}
