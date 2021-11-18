import {
  Spinner,
  Text,
  HStack,
  useColorModeValue,
  Progress,
  Box,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function StatusBar({
  progress,
  isLoading,
  isSaving,
  isLoggedIn,
}) {
  const statusBgColor = useColorModeValue(
    'rgba(237, 242, 247, .5)',
    'rgba(26, 32, 44, .5)'
  );

  const statusText = isLoading
    ? 'Cargando tu progreso guardado...'
    : isSaving
    ? 'Guardando tu progreso...'
    : 'Progreso guardado.';

  const statusIcon =
    isLoading || isSaving ? (
      <Spinner size="sm" />
    ) : (
      <CheckCircleIcon boxSize="16px" />
    );

  return (
    <Box position="fixed" bottom="0" left="0" right="0" zIndex="2">
      <Progress colorScheme="green" size="sm" value={progress} />
      <HStack
        bg={statusBgColor}
        px="3"
        py="2"
        spacing="3"
        backdropFilter="blur(8px)"
      >
        {statusIcon}
        <Text fontSize="xs">
          <Text as="strong">Completado: {progress}%</Text>.{' '}
          {isLoggedIn ? statusText : 'Ingresá para guardar tu progreso.'}
        </Text>
      </HStack>
    </Box>
  );
}
