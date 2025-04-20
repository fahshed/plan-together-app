import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import tripApi from "@/api/trip";
import { RiAddLine } from "react-icons/ri";

export default function EventDialog({ tripId, onEventCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await tripApi.post(`/${tripId}/events`, {
        name: data.name,
        description: data.description,
        date: data.date,
        createdAt: new Date().toISOString(),
      });

      const newEvent = response.data;
      onEventCreated(newEvent);

      toaster.create({
        title: "Event created successfully!",
        type: "success",
      });

      setIsOpen(false);
      reset();
    } catch (error) {
      toaster.create({
        title: `Error creating event: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} placement="center">
      <Dialog.Trigger asChild>
        <Button variant="solid" size="md" colorScheme="blue">
          Create Event <RiAddLine />
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create a New Event</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>Event Name</Field.Label>
                    <Input
                      placeholder="Enter event name"
                      {...register("name", {
                        required: "Event name is required",
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.name?.message}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.description}>
                    <Field.Label>Event Description</Field.Label>
                    <Input
                      placeholder="Enter event description"
                      {...register("description")}
                    />
                    <Field.HelperText color="red.500">
                      {errors.description?.message}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.date}>
                    <Field.Label>Event Date</Field.Label>
                    <Input
                      type="date"
                      {...register("date", {
                        required: "Event date is required",
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.date?.message}
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
                <Dialog.Footer mt="4" p="0">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    colorScheme="gray"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" bg="blue.800" loading={isSubmitting}>
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
