import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

function CollegesTable({ colleges }) {
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
        {colleges.map(({ id, name, alias, universityId }) => (
          <Tr key={alias}>
            <Td>{name}</Td>
            <Td>{alias}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default CollegesTable;
