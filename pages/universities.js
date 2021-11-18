import { Center, Spinner, Heading, Box } from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { useAuth } from '@/lib/auth';
import UniversitiesTable from '@/components/UniversitiesTable';
import AddUniversityModal from '@/components/AddUniversityModal';

export default function Universities() {
  const { user } = useAuth();
  const { data: universities } = useSWR(
    user ? '/api/universities' : null,
    fetcher
  );

  // TODO: Prevent unauthorized user.
  // if (!user) {
  //   return <NotFound />;
  // }

  if (!universities) {
    return (
      <Center w="full">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Heading mb="4">Universities</Heading>
      <AddUniversityModal />
      <UniversitiesTable universities={universities} />
    </Box>
  );
}
