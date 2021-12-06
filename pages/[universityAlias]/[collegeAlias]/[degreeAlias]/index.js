import { Heading, Text, useToast } from '@chakra-ui/react';
import { saveUserSubjectsState } from '@/lib/db';
import { useEffect, useState } from 'react';
import SUBJECT_STATES from 'constants/subject-states';
import { useAuth } from '@/lib/auth';
import { getDegrees, getDegreeBySlug, getSubjects } from '@/lib/db-admin';
import useSWRImmutable from 'swr/immutable';
import fetcher from '@/utils/fetcher';
import Curriculum from '@/components/Curriculum';
import { CurriculumContext } from 'contexts/CurriculumContext';
import Stats from '@/components/Stats';
import StatusBar from '@/components/StatusBar';
import Head from 'next/head';

const { DESAPROBADA, APROBADA } = SUBJECT_STATES;

// TODO: Should I move these functions to another file?
function isInRequiredState(requirement, subjects) {
  const subject = subjects.find(({ id }) => requirement.id == id);

  return (
    !subject ||
    subject.state == APROBADA.value ||
    subject.state == requirement.requiredState
  );
}

function checkRequirements(subject, _, subjects) {
  subject.canAttend = subject.requirementsForAttending.every((requirement) =>
    isInRequiredState(requirement, subjects)
  );

  subject.canPass = subject.requirementsForPassing.every((requirement) =>
    isInRequiredState(requirement, subjects)
  );

  if (!subject.canAttend) {
    subject.state = DESAPROBADA.value;
  }
}

function updateRequirementsState(subject, _, subjects) {
  const updateRequirementState = (requirement) => {
    const actualSubject = subjects.find(({ id }) => id == requirement.id);

    requirement.currentState = actualSubject?.state;
  };

  subject.requirementsForAttending.forEach(updateRequirementState);
  subject.requirementsForPassing.forEach(updateRequirementState);
}

function addInitialStateToSubject(subject) {
  const addInitialStateToRequirements = (requirement) => ({
    ...requirement,
    currentState: DESAPROBADA.value,
  });

  return {
    ...subject,
    state: DESAPROBADA.value,
    canAttend: subject.requirementsForAttending?.length == 0,
    canPass: subject.requirementsForPassing?.length == 0,
    requirementsForAttending: subject.requirementsForAttending.map(
      addInitialStateToRequirements
    ),
    requirementsForPassing: subject.requirementsForPassing.map(
      addInitialStateToRequirements
    ),
  };
}

export default function Degree({ degree, subjects: subjectsWithoutState }) {
  const initialSubjects = subjectsWithoutState.map(addInitialStateToSubject);
  const [isSaving, setIsSaving] = useState(false);
  const { user, error: authError, isLoggedIn } = useAuth();
  const toast = useToast();

  const [subjects, setSubjects] = useState(initialSubjects);

  const { data: userSubjectsState, error } = useSWRImmutable(
    isLoggedIn
      ? [`/api/user-subjects-state/?degreeId=${degree.id}`, user.token]
      : null,
    fetcher
  );

  const isLoading = isLoggedIn && !userSubjectsState && !error;

  // TODO: Debounce this.
  const saveSubjectsState = async (subjects) => {
    setIsSaving(true);
    const subjectsState = {
      [degree.id]: {},
    };

    subjects.forEach(({ id, state }) => {
      subjectsState[degree.id][id] = state;
    });

    await saveUserSubjectsState(user.id, subjectsState);
    setIsSaving(false);
  };

  const updateSubjectsState = (mapCallback, mustSave) => {
    const updatedSubjects = subjects.map(mapCallback);

    updatedSubjects.forEach(checkRequirements);
    updatedSubjects.forEach(updateRequirementsState);

    if (mustSave && isLoggedIn) {
      saveSubjectsState(updatedSubjects);
    }

    setSubjects(updatedSubjects);
  };

  // TODO: Check if this is a right use of useEffect.
  useEffect(() => {
    if (userSubjectsState) {
      updateSubjectsState((subject) => {
        if (!userSubjectsState[subject.id]) return subject;

        return {
          ...subject,
          state: userSubjectsState[subject.id],
        };
      }, false);
    } else {
      updateSubjectsState((subject) => {
        return {
          ...subject,
          state: DESAPROBADA.value,
        };
      }, false);
    }
  }, [user, userSubjectsState]);

  // TODO: Is this the best way to handle auth errors?
  useEffect(() => {
    if (!authError) return;
    toast({
      title: 'Algo salió mal',
      description: authError.message,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }, [authError]);

  const handleSubjectStateChange = (subjectId, state) => {
    updateSubjectsState((subject) => {
      if (subject.id != subjectId) return subject;

      return {
        ...subject,
        state,
      };
    }, true);
  };

  const handleYearStateChange = (year, state) => {
    updateSubjectsState((subject) => {
      if (subject.year != year) return subject;

      return {
        ...subject,
        state,
      };
    }, true);
  };

  // TODO: Is it worth it to memoize `years` with useMemo?
  const years = Array.from(Array(parseInt(degree.years)), (_, i) => i + 1);

  const totalSubjectsCount = subjects.length;

  const passedSubjectsCount = subjects.filter(
    ({ state }) => state == APROBADA.value
  ).length;

  const progress = Math.floor((passedSubjectsCount / totalSubjectsCount) * 100);

  return (
    <>
      <Head>
        <title>
          Plan de estudios de {degree.name} · {degree.universityAlias}{' '}
          {degree.collegeAlias} · Plande
        </title>
      </Head>
      <Text>
        {degree.universityAlias} {degree.collegeAlias}
      </Text>
      <Heading as="h1" size="xl" mb="2">
        {degree.name}
      </Heading>
      <CurriculumContext.Provider
        value={{
          handleSubjectStateChange,
          handleYearStateChange,
          isLoading,
        }}
      >
        <Curriculum years={years} subjects={subjects} />
      </CurriculumContext.Provider>
      <Stats subjects={subjects} />
      <StatusBar
        progress={progress}
        isLoading={isLoading}
        isSaving={isSaving}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

export async function getStaticProps(context) {
  const { universityAlias, collegeAlias, degreeAlias } = context.params;
  const slug = `${universityAlias}/${collegeAlias}/${degreeAlias}`;
  const degree = await getDegreeBySlug(slug);

  // TODO: Check this redirection.
  if (!degree) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const subjects = await getSubjects(degree.id);

  // TODO: Figure out a way to avoid converting timestamps.
  subjects.forEach((subject) => {
    subject.createdAt = subject.createdAt.toDate().toJSON();
  });

  return {
    props: { degree, subjects },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const degrees = await getDegrees();

  const paths = degrees.map(({ slug }) => {
    const [universityAlias, collegeAlias, degreeAlias] = slug.split('/');
    return {
      params: {
        universityAlias,
        collegeAlias,
        degreeAlias,
      },
    };
  });

  return { paths, fallback: false };
}
