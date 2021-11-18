import { useAuth } from '@/lib/auth';
import { Spinner, Heading, Box, Center, Select } from '@chakra-ui/react';
import useSWR from 'swr';
import DegreesTable from '@/components/DegreesTable';
import fetcher from '@/utils/fetcher';
import AddDegreeModal from '@/components/AddDegreeModal';
import { useState } from 'react';

export default function Degrees() {
  const { user } = useAuth();
  const { data: degrees } = useSWR(user ? '/api/degrees' : null, fetcher);
  const { data: colleges } = useSWR(user ? '/api/colleges' : null, fetcher);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const onCollegeChange = (e) => {
    const collegeId = e.target.value;

    const college = colleges.find(({ id }) => id == collegeId);

    setSelectedCollege(college);
  };

  // TODO: Prevent unauthorized user.
  // if (!user) {
  //   return <NotFound />;
  // }

  if (!degrees) {
    return (
      <Center w="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  const filteredDegrees = degrees.filter(
    ({ collegeId }) => collegeId == selectedCollege?.id
  );

  return (
    <Box>
      <Heading mb="4">Degrees</Heading>
      <Select placeholder="Select a college" onChange={onCollegeChange}>
        {colleges &&
          colleges.map(({ id, name, alias, universityAlias }) => (
            <option key={id} value={id}>
              {universityAlias}: {name} ({alias})
            </option>
          ))}
      </Select>
      {selectedCollege && <AddDegreeModal college={selectedCollege} />}
      <DegreesTable degrees={selectedCollege ? filteredDegrees : degrees} />
    </Box>
  );
}
