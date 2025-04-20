import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Select,
  Spinner,
  Stack,
  Center,
  createListCollection,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import tripApi from "@/api/trip";
import { toaster } from "@/components/ui/toaster";
import { RiAddLine } from "react-icons/ri";

const priorityOptions = createListCollection({
  items: [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ],
});

export default function CreateTaskDialog({ tripId, eventId, onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberDict, setMemberDict] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    register,
  } = useForm();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await tripApi.get(`/${tripId}/members`);
        const formattedMembers = response.data.map((member) => ({
          value: member.userId,
          label: `${member.firstName} ${member.lastName}`,
        }));
        setMembers(createListCollection({ items: formattedMembers }));
        setMemberDict(
          response.data.reduce((acc, member) => {
            acc[member.userId] = member;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching members:", error);
        toaster.create({
          title: "Error fetching members",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchMembers();
  }, [tripId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await tripApi.post(
        `/${tripId}/events/${eventId}/tasks`,
        {
          name: data.name,
          description: data.description,
          createdAt: new Date().toISOString(),
          assignedTo: memberDict[data.assignedTo[0]],
          priority: data.priority[0],
        }
      );

      const newTask = response.data;

      onCreate((prevTasks) => ({
        ...prevTasks,
        [newTask.assignedTo.userId]: [
          newTask,
          ...(prevTasks[newTask.assignedTo.userId] || []),
        ],
      }));

      toaster.create({
        title: "Task created successfully!",
        type: "success",
      });

      setIsOpen(false);
      reset();
    } catch (error) {
      toaster.create({
        title: `Error creating task: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="red" />
      </Center>
    );
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      placement="center"
      size="md"
    
    >
      <Dialog.Trigger asChild>
        <Button>
          Add Task <RiAddLine />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content ref={contentRef}>
            <Dialog.Header>
              <Dialog.Title>Create a New Task</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="2">
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>Task Name</Field.Label>
                    <Input
                      placeholder="Enter task name"
                      {...register("name", {
                        required: "Task name is required",
                      })}
                    />
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.description}>
                    <Field.Label>Description</Field.Label>
                    <Input
                      placeholder="Enter task description"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.assignedTo}>
                    <Field.Label>Assign To</Field.Label>
                    <Controller
                      control={control}
                      name="assignedTo"
                      rules={{ required: "Assigned member is required" }}
                      render={({ field }) => (
                        <Select.Root
                          name={field.name}
                          value={field.value}
                          onValueChange={({ value }) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                          collection={members}
                          colorPalette="red"
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select member" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Portal container={contentRef}>
                            <Select.Positioner>
                              <Select.Content>
                                {members.items.map((member) => (
                                  <Select.Item
                                    item={member}
                                    key={member.value}
                                    value={member.value}
                                  >
                                    {member.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>
                      {errors.assignedTo?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.priority}>
                    <Field.Label>Priority</Field.Label>
                    <Controller
                      control={control}
                      name="priority"
                      rules={{ required: "Priority is required" }}
                      render={({ field }) => (
                        <Select.Root
                          name={field.name}
                          value={field.value}
                          onValueChange={({ value }) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                          collection={priorityOptions}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select priority" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Portal container={contentRef}>
                            <Select.Positioner>
                              <Select.Content>
                                {priorityOptions.items.map((priority) => (
                                  <Select.Item
                                    item={priority}
                                    key={priority.value}
                                    value={priority.value}
                                  >
                                    {priority.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>
                      {errors.priority?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Stack>
                <Dialog.Footer mt="4" p="0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    bg="blue.800"
                    color="white"
                    loading={isSubmitting}
                  >
                    Create
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
