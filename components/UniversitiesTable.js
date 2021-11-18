import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function UniversitiesTable({ universities }) {
  return (
    // TODO: Add empty message.
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Alias</Th>
        </Tr>
      </Thead>
      <Tbody>
        {universities.map(({ id, name, alias }) => (
          <Tr key={id}>
            <Td>{name}</Td>
            <Td>{alias}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
