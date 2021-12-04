import Head from 'next/head';
import { Heading, Link, Text } from '@chakra-ui/react';
import { getDegrees } from '@/lib/db-admin';

export default function Home({ degrees }) {
  return (
    <div>
      <Head>
        <title>Plande · Descubrí tu progreso en tu carrera universitaria</title>
        <meta
          name="description"
          content="Descubrí tu progreso en tu carrera universitaria"
        />
      </Head>

      <main>
        <Heading as="h1" textAlign="center" size="2xl">
          Plande
        </Heading>
        <Text textAlign="center" fontSize="xl">
          Descubrí tu progreso en tu carrera universitaria
        </Text>
        <Heading as="h2" size="lg" mt="8">
          Carreras
        </Heading>
        {degrees &&
          degrees.map(({ id, name, slug, universityAlias, collegeAlias }) => (
            <div key={id}>
              <Link href={`/${slug}`}>
                {universityAlias} {collegeAlias}: {name}
              </Link>
            </div>
          ))}
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const degrees = await getDegrees();

  return {
    props: { degrees },
  };
}
