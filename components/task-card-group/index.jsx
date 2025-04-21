import {
  Box,
  HStack,
  Text,
  CheckboxCard,
  Avatar,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";

const colorDict = {
  high: "red",
  medium: "yellow",
  low: "blue",
};

export default function TaskCardGroup({
  member,
  taskList,
  onTaskStatusUpdate,
}) {
  const [disabledTaskId, setDisabledTaskId] = useState(null);

  const handleTaskStatusChange = async (changedTaskId) => {
    setDisabledTaskId(changedTaskId);
    const taskIndex = taskList.findIndex((task) => task.id === changedTaskId);
    await onTaskStatusUpdate(member.userId, taskIndex, changedTaskId);
    setDisabledTaskId(null);
  };

  return (
    <Box mb="4">
      <HStack gap="2" mb={2}>
        <Avatar.Root size="xs">
          <Avatar.Image
            src={`https://avatar.iran.liara.run/public?username=${member.userId}`}
          />
        </Avatar.Root>
        <Text>
          {member.firstName} {member.lastName}
        </Text>
      </HStack>
      <Stack gap="2">
        {taskList.map((task) => (
          <CheckboxCard.Root
            disabled={disabledTaskId === task.id}
            checked={task.status === "completed"}
            key={task.id}
            value={task.id}
            bg={`${colorDict[task.priority]}.200`}
            colorPalette="green"
            onChange={(e) => handleTaskStatusChange(e.target.value)}
            maxW="200px"
            minW="200px"
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Label>{task.name}</CheckboxCard.Label>
                <Badge
                  size="xs"
                  colorPalette={colorDict[task.priority]}
                  variant="solid"
                >
                  {task.priority}
                </Badge>
                <CheckboxCard.Description>
                  {task.description}
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator border="1px solid grey" />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        ))}
      </Stack>
    </Box>
  );
}
