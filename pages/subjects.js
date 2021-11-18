import AddSubjectModal from '@/components/AddSubjectModal';
import SubjectsTable from '@/components/SubjectsTable';
import { useAuth } from '@/lib/auth';
import fetcher from '@/utils/fetcher';
import {
  Box,
  Heading,
  Spinner,
  useToast,
  Center,
  Select,
} from '@chakra-ui/react';
import useSWR, { useSWRConfig } from 'swr';
import { deleteSubject } from '@/lib/db';
import { useState } from 'react';

export default function Subjects() {
  const { user } = useAuth();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const { data: subjects } = useSWR(user ? '/api/subjects' : null, fetcher);
  const { data: degrees } = useSWR(user ? '/api/degrees' : null, fetcher);
  const [selectedDegree, setSelectedDegree] = useState(null);

  const onDegreeChange = (e) => {
    const degreeId = e.target.value;

    const degree = degrees.find(({ id }) => id == degreeId);

    setSelectedDegree(degree);
  };

  const onDelete = async (subjectId) => {
    await deleteSubject(subjectId);
    mutate(user ? '/api/subjects' : null);
    toast({
      title: 'Success!',
      description: 'The subject was deleted.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  // TODO: Prevent unauthorized user.
  // if (!user) {
  //   return <NotFound />;
  // }

  if (!subjects) {
    return (
      <Center w="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  const filteredSubjects = subjects.filter(
    ({ degreeId }) => degreeId == selectedDegree?.id
  );

  return (
    <Box>
      <Heading mb="4">Subjects</Heading>
      <Select placeholder="Select a degree" onChange={onDegreeChange}>
        {degrees &&
          degrees.map(({ id, name, alias, universityAlias, collegeAlias }) => (
            <option key={id} value={id}>
              {universityAlias} {collegeAlias}: {name} ({alias})
            </option>
          ))}
      </Select>
      {selectedDegree && (
        <AddSubjectModal degree={selectedDegree} subjects={filteredSubjects} />
      )}
      <SubjectsTable
        subjects={selectedDegree ? filteredSubjects : subjects}
        onDelete={onDelete}
      />
    </Box>
  );
}
