import {
  HStack,
  Text,
  Button,
  Circle,
  Tooltip,
  IconButton,
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  List,
  ListItem,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  useColorModeValue,
  Portal,
} from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import SUBJECT_STATES from 'constants/subject-states';
import TAGS from 'constants/tags';
import { useContext } from 'react';
import { CurriculumContext } from 'contexts/CurriculumContext';

const { DESAPROBADA, APROBADA } = SUBJECT_STATES;

export default function Subject({
  subject: {
    id,
    name,
    state,
    classload,
    tags,
    requirementsForAttending,
    requirementsForPassing,
    canAttend,
    canPass,
  },
}) {
  const { handleSubjectStateChange, isLoading } = useContext(CurriculumContext);

  const hasRequirements =
    requirementsForAttending.length > 0 || requirementsForPassing.length > 0;

  const subjectStateColorScheme =
    SUBJECT_STATES[state.toUpperCase()].color.scheme;

  const subjectBgColor = useColorModeValue(
    `linear(to-l, ${subjectStateColorScheme}.100, transparent)`,
    `linear(to-l, ${subjectStateColorScheme}.900, transparent)`
  );

  const classloadColor = useColorModeValue(
    `${subjectStateColorScheme}.400`,
    `${subjectStateColorScheme}.600`
  );

  const circleBgColor = useColorModeValue(
    `${subjectStateColorScheme}.500`,
    `${subjectStateColorScheme}.200`
  );

  return (
    <HStack
      mb="1"
      spacing="3"
      bgGradient={subjectBgColor}
      py="3"
      pr="3"
      borderRadius="md"
    >
      <HStack flexGrow="1" align="start" spacing="3">
        <Circle size="3" mt="2" bg={circleBgColor} />
        <Flex flexWrap="wrap" align="center">
          <Text as="span" fontSize="lg" mr="3">
            {name}
          </Text>
          {tags &&
            tags.map((tag) => (
              <Tag key={tag} size="sm" colorScheme={subjectStateColorScheme}>
                {TAGS[tag.toUpperCase()].text}
              </Tag>
            ))}
        </Flex>
      </HStack>

      {classload && (
        <Tooltip hasArrow label={`Carga horaria semanal: ${classload} horas`}>
          <Text color={classloadColor} whiteSpace="nowrap">
            {classload} hs
          </Text>
        </Tooltip>
      )}

      {hasRequirements && (
        <RequirementsPopover
          id={`requirement-popover-${id}`}
          subjectName={name}
          subjectStateColorScheme={subjectStateColorScheme}
          canAttend={canAttend}
          requirementsForAttending={requirementsForAttending}
          requirementsForPassing={requirementsForPassing}
        />
      )}

      <StateMenu
        subjectId={id}
        currentState={state}
        canPass={canPass}
        isDisabled={!canAttend || isLoading}
        onChange={handleSubjectStateChange}
      />
    </HStack>
  );
}

function StateMenu({ subjectId, currentState, canPass, isDisabled, onChange }) {
  return (
    <Menu id={`${subjectId}-state-menu`} isLazy>
      <MenuButton
        as={Button}
        colorScheme={SUBJECT_STATES[currentState.toUpperCase()].color.scheme}
        disabled={isDisabled}
        w="10"
        p="0"
      >
        {SUBJECT_STATES[currentState.toUpperCase()].text[0]}
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuOptionGroup
            onChange={(value) => onChange(subjectId, value)}
            value={currentState}
            defaultValue={DESAPROBADA.value}
            type="radio"
          >
            {Object.values(SUBJECT_STATES).map(({ value, text }) => (
              <MenuItemOption
                key={value}
                value={value}
                isDisabled={value == APROBADA.value && !canPass}
              >
                {text}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}

function RequirementsPopover({
  id,
  subjectName,
  subjectStateColorScheme,
  canAttend,
  requirementsForAttending,
  requirementsForPassing,
}) {
  const { isLoading } = useContext(CurriculumContext);
  return (
    <Popover id={id} offset={[20, 20]}>
      <PopoverTrigger>
        <IconButton
          aria-label="Ver requisitos"
          icon={canAttend ? <UnlockIcon /> : <LockIcon />}
          isDisabled={isLoading}
          variant="ghost"
          colorScheme={subjectStateColorScheme}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          Requisitos de <Text as="em">{subjectName}</Text>
        </PopoverHeader>
        <PopoverBody>
          {requirementsForAttending.length > 0 && (
            <>
              <Text mb="2">
                Para <Text as="strong">cursar</Text> necesitás al menos:
              </Text>
              <RequirementsList requirements={requirementsForAttending} />
            </>
          )}
          {requirementsForPassing.length > 0 && (
            <>
              <Text mb="2" mt="4">
                Para <Text as="strong">aprobar</Text> necesitás al menos:
              </Text>
              <RequirementsList requirements={requirementsForPassing} />
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function RequirementsList({ requirements }) {
  return (
    <List>
      {requirements.map((requirement) => (
        <RequirementItem
          key={requirement.id}
          requirement={requirement}
        ></RequirementItem>
      ))}
    </List>
  );
}

function RequirementItem({ requirement }) {
  const requiredStateColorScheme =
    SUBJECT_STATES[requirement.requiredState.toUpperCase()].color.scheme;

  const currentStateColorScheme =
    SUBJECT_STATES[requirement.currentState.toUpperCase()].color.scheme;

  const circleBgColor = useColorModeValue(
    `${currentStateColorScheme}.500`,
    `${currentStateColorScheme}.200`
  );

  return (
    <ListItem mb="2">
      <HStack spacing="3" align="start">
        <Circle size="10px" bg={circleBgColor} alignSelf="start" mt="2" />
        <Text flexGrow="1">{requirement.name}</Text>
        <Tag flexShrink="0" colorScheme={requiredStateColorScheme}>
          {SUBJECT_STATES[requirement.requiredState.toUpperCase()].text}
        </Tag>
      </HStack>
    </ListItem>
  );
}
