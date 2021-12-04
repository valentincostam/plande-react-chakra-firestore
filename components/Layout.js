import { Avatar } from '@chakra-ui/avatar';
import {
  Link,
  Button,
  Container,
  Text,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Portal,
  Box,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Layout({ children }) {
  const auth = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <HStack justify="space-between" align="center" p="4" spacing="4" h="16">
        {/* TODO: Is this the right way to check permissions? */}
        {auth?.user && auth.user.role == 'admin' && (
          <Menu display={['block', 'none', 'none', 'none']}>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              size="sm"
            />
            <Portal>
              <MenuList>
                <MenuItem>
                  <Link as={NextLink} href="/universities">
                    Universities
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link as={NextLink} href="/colleges">
                    Colleges
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link as={NextLink} href="/degrees">
                    Degrees
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link as={NextLink} href="/subjects">
                    Subjects
                  </Link>
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        )}
        <Text fontWeight="bold" flexGrow="1">
          <Link as={NextLink} href="/">
            Plande
          </Link>
        </Text>
        <HStack spacing="3">
          <IconButton
            onClick={toggleColorMode}
            variant="outline"
            size="sm"
            icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
          />
          {auth?.user ? (
            <>
              <Button
                onClick={(e) => auth.signout()}
                size="sm"
                variant="outline"
              >
                Salir
              </Button>

              <Avatar
                name={auth?.user?.name}
                src={auth?.user?.photoUrl}
                size="sm"
              />
            </>
          ) : (
            <Button
              onClick={(e) => auth.signinWithGoogle()}
              size="sm"
              variant="outline"
            >
              Ingresar
            </Button>
          )}
        </HStack>
      </HStack>
      <Container maxW="container.md" my="6">
        {children}
      </Container>
      <Box as="footer" mb="16" mt="auto">
        <Text textAlign="center" fontSize="sm">
          Plande · Creado por{' '}
          <Link href="https://valentincosta.com" fontWeight="bold">
            Valentín Costa
          </Link>
        </Text>
      </Box>
    </>
  );
}
