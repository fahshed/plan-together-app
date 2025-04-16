import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function CreateTripDialog({ onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()),
    };
    onCreate(processedData);
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      placement="center"
      size="md"
    >
      <Dialog.Trigger asChild>
        <Button size="2xl">
          Create Trip <RiAddLine />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create a New Trip!</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="2">
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>Trip Title</Field.Label>
                    <Input
                      placeholder="Trip title"
                      {...register("title", {
                        required: "Trip title is required",
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.title?.message}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.summary}>
                    <Field.Label>Summary</Field.Label>
                    <Input
                      placeholder="Trip summary"
                      {...register("summary", {
                        required: "Summary is required",
                        maxLength: {
                          value: 200,
                          message: "Summary must be less than 200 characters",
                        },
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.summary?.message}
                    </Field.HelperText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Tags</Field.Label>
                    <Input
                      placeholder="Enter tags separated by commas"
                      {...register("tags")}
                    />
                    <Field.HelperText color="red.500">
                      {errors.tags?.message}
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
                <Dialog.Footer mt="4" p="0">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" bg="blue.800" color="white">
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
