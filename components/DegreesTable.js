import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function DegreesTable({ degrees }) {
  return (
    // TODO: Add empty message.
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Alias</Th>
          <Th>Years</Th>
        </Tr>
      </Thead>
      <Tbody>
        {degrees.map(({ id, name, alias, years, universityId, collegeId }) => (
          <Tr key={name}>
            <Td>{name}</Td>
            <Td>{alias}</Td>
            <Td>{years}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
