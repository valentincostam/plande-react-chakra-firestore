import { Box, Heading, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { getColleges, getCollegeBySlug, getDegrees } from '@/lib/db-admin';
import Head from 'next/head';

export default function College({ college, degrees }) {
  return (
    <Box>
      <Head>
        <title>
          Carreras de la {college.name} · {college.universityAlias} · Plande
        </title>
      </Head>
      <Text>{college.universityName}</Text>
      <Heading as="h1">{college.name}</Heading>
      {degrees &&
        degrees.map(({ id, name, slug }) => (
          <NextLink key={id} href={`/${slug}`}>
            {name}
          </NextLink>
        ))}
    </Box>
  );
}

export async function getStaticProps(context) {
  const { universityAlias, collegeAlias } = context.params;
  const slug = `${universityAlias}/${collegeAlias}`;
  const college = await getCollegeBySlug(slug);

  // TODO: Check this redirection.
  if (!college) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const degrees = await getDegrees(college.id);

  return {
    props: { college, degrees },
  };
}

export async function getStaticPaths() {
  const colleges = await getColleges();

  const paths = colleges.map(({ slug }) => {
    const [universityAlias, collegeAlias] = slug.split('/');
    return {
      params: {
        universityAlias,
        collegeAlias,
      },
    };
  });

  return { paths, fallback: false };
}
