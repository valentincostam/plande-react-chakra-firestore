import { Box, Heading, Button, useColorModeValue } from '@chakra-ui/react';
import Subject from '@/components/Subject';
import { useContext } from 'react';
import { CurriculumContext } from 'contexts/CurriculumContext';
import SUBJECT_STATES from 'constants/subject-states';
import SEMESTERS from 'constants/semesters';

const { DESAPROBADA, APROBADA } = SUBJECT_STATES;
const ORDINALS = [
  'Primer',
  'Segundo',
  'Tercer',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
];

export default function Curriculum({ years, subjects }) {
  return years.map((year) => {
    const yearSubjects = subjects.filter((subject) => subject.year == year);

    if (!yearSubjects.length) return;

    return <Year key={year} year={year} subjects={yearSubjects}></Year>;
  });
}

function Year({ year, subjects }) {
  const { handleYearStateChange } = useContext(CurriculumContext);
  const isYearPassed = subjects.every(({ state }) => state == APROBADA.value);
  const canPassYear = subjects.every(
    ({ canAttend, canPass }) => canAttend && canPass
  );

  const semesters = Object.values(SEMESTERS).map(({ value: semester }) => {
    const semesterSubjects = subjects.filter(
      (subject) => subject.semester == semester
    );

    if (!semesterSubjects.length) return;

    return (
      <Semester
        key={semester}
        semester={semester}
        subjects={semesterSubjects}
      ></Semester>
    );
  });

  const yearHeadingBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box key={year}>
      <Heading
        as="h2"
        size="md"
        mt="4"
        py="4"
        flexGrow="1"
        display="flex"
        align="center"
        bg={yearHeadingBgColor}
        position="sticky"
        top="0"
        zIndex="1"
      >
        {ORDINALS[year - 1]} año
        {!isYearPassed && canPassYear && (
          <Button
            size="xs"
            ml="2"
            onClick={() => handleYearStateChange(year, APROBADA.value)}
          >
            Aprobar
          </Button>
        )}
        {isYearPassed && (
          <Button
            size="xs"
            ml="2"
            onClick={() => handleYearStateChange(year, DESAPROBADA.value)}
          >
            Desaprobar
          </Button>
        )}
      </Heading>
      {semesters}
    </Box>
  );
}

function Semester({ semester, subjects }) {
  return (
    <Box>
      <Heading
        as="h3"
        fontSize=".8rem"
        color="gray.500"
        textTransform="uppercase"
        fontWeight="normal"
        borderRadius="md"
        py="2"
        mb="1"
      >
        {SEMESTERS[semester.toUpperCase()].text}
      </Heading>
      {subjects.map((subject) => (
        <Subject key={subject.id} subject={subject} />
      ))}
    </Box>
  );
}
