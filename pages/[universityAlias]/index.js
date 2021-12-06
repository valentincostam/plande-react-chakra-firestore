import { Box, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  getUniversities,
  getUniversityBySlug,
  getColleges,
} from '@/lib/db-admin';

export default function University({ university, colleges }) {
  return (
    <Box>
      <Head>
        <title>Facultades de la {university.name} · Plande</title>
      </Head>
      <Heading as="h1">{university.name}</Heading>
      {colleges &&
        colleges.map(({ id, name, slug, alias }) => (
          <NextLink key={id} href={`/${slug}`}>{`${name} (${alias})`}</NextLink>
        ))}
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
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const universities = await getUniversities();

  const paths = universities.map(({ slug }) => ({
    params: { universityAlias: slug },
  }));

  return { paths, fallback: false };
}
