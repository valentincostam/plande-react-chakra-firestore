import { Box, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  getUniversities,
  getUniversityBySlug,
  getColleges,
} from '@/lib/db-admin';

export default function University({ university, colleges }) {
  return (
    <Box>
      <Heading as="h1">
        {university.name} ({university.alias})
      </Heading>
      <ul>
        {colleges &&
          colleges.map(({ id, name, slug, alias }) => (
            <li key={id}>
              <NextLink href={`/${slug}`}>{`${name} (${alias})`}</NextLink>
            </li>
          ))}
      </ul>
    </Box>
  );
}

export async function getStaticProps(context) {
  const { universityAlias } = context.params;
  const university = await getUniversityBySlug(universityAlias);

  if (!university) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const colleges = await getColleges(university.id);

  return {
    props: { university, colleges },
  };
}

export async function getStaticPaths() {
  const universities = await getUniversities();

  const paths = universities.map(({ slug }) => ({
    params: { universityAlias: slug },
  }));

  return { paths, fallback: false };
}
