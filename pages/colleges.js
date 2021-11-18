import { useAuth } from '@/lib/auth';
import { Spinner, Heading, Box, Center, Select } from '@chakra-ui/react';
import useSWR, { useSWRConfig } from 'swr';
import CollegesTable from '@/components/CollegesTable';
import fetcher from '@/utils/fetcher';
import AddCollegeModal from '@/components/AddCollegeModal';
import { useState } from 'react';

export default function Colleges() {
  const { user } = useAuth();
  const { data: colleges } = useSWR(user ? '/api/colleges' : null, fetcher);
  const { data: universities } = useSWR(
    user ? '/api/universities' : null,
    fetcher
  );
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const onUniversityChange = (e) => {
    const universityId = e.target.value;

    const university = universities.find(({ id }) => id == universityId);

    setSelectedUniversity(university);
  };

  // TODO: Prevent unauthorized user.
  // if (!user) {
  //   return <NotFound />;
  // }

  if (!colleges) {
    return (
      <Center w="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  const filteredColleges = colleges.filter(
    ({ universityId }) => universityId == selectedUniversity?.id
  );

  return (
    <Box>
      <Heading mb="4">Colleges</Heading>
      <Select placeholder="Select an university" onChange={onUniversityChange}>
        {universities &&
          universities.map(({ id, name, alias }) => (
            <option key={id} value={id}>
              {name} ({alias})
            </option>
          ))}
      </Select>
      {selectedUniversity && (
        <AddCollegeModal university={selectedUniversity} />
      )}
      <CollegesTable
        colleges={selectedUniversity ? filteredColleges : colleges}
      />
    </Box>
  );
}
