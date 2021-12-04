import {
  Box,
  Text,
  Heading,
  Grid,
  GridItem,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import SUBJECT_STATES from 'constants/subject-states';
import TAGS from 'constants/tags';
import NUMBER_OF_WEEKS_PER_ACADEMIC_YEAR from 'constants/number-of-weeks';

const { CURSANDO, APROBADA } = SUBJECT_STATES;

export default function Stats({ subjects }) {
  // TODO: Improve empty message.
  if (!subjects.length) return <Box>No hay materias.</Box>;

  const totalSubjectsCount = subjects.length;

  const passedSubjectsCount = subjects.filter(
    ({ state }) => state == APROBADA.value
  ).length;

  const progress = Math.floor((passedSubjectsCount / totalSubjectsCount) * 100);

  const currentYearlyClassload = subjects
    .filter(({ state }) => state == CURSANDO.value)
    .reduce((totalHours, { classload }) => totalHours + parseInt(classload), 0);

  const currentWeeklyClassload =
    currentYearlyClassload / NUMBER_OF_WEEKS_PER_ACADEMIC_YEAR;

  const passedElectiveYearlyClassload = subjects
    .filter(
      ({ state, tags }) =>
        tags && tags.includes(TAGS.ELECTIVA.value) && state == APROBADA.value
    )
    .reduce((totalHours, { classload }) => totalHours + parseInt(classload), 0);

  const passedElectiveWeeklyClassload =
    passedElectiveYearlyClassload / NUMBER_OF_WEEKS_PER_ACADEMIC_YEAR;

  const degreeTotalHours = subjects.reduce(
    (total, { classload }) => total + parseInt(classload),
    0
  );

  return (
    <Box mt="10">
      <Heading as="h2" size="md" mb="4">
        Estadísticas
      </Heading>
      <Grid
        gap="4"
        templateColumns={['repeat(2, 1fr)', null, 'repeat(4, 1fr)']}
      >
        <GridItem>
          <StatItem label="Carrera completada" value={`${progress}%`} />
        </GridItem>
        <GridItem>
          <StatItem
            label="Materias aprobadas"
            value={`${passedSubjectsCount} de ${totalSubjectsCount}`}
          />
        </GridItem>
        <GridItem>
          <StatItem
            label="Horas cursando semanalmente"
            value={`${currentWeeklyClassload} horas`}
          />
        </GridItem>
        <GridItem>
          <StatItem
            label="Horas electivas aprobadas"
            value={`${passedElectiveWeeklyClassload} horas`}
          />
        </GridItem>
        <GridItem>
          <StatItem
            label="Total de horas de la carrera"
            value={`${degreeTotalHours} horas`}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}

function StatItem({ label, value }) {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Center
      bg={bgColor}
      p="6"
      borderRadius="lg"
      h="full"
      flexDirection="column"
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        color={textColor}
        textAlign="center"
      >
        {label}
      </Text>
      <Text fontSize="xl" textAlign="center">
        {value}
      </Text>
    </Center>
  );
}
