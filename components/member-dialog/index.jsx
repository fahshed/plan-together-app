import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddMemberDialog({ handleAddMember }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await handleAddMember(data.email);
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} placement="center">
      <Dialog.Trigger asChild>
        <Button variant="solid" size="md">
          Add Member
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Member</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      placeholder="Enter user email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.email?.message}
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
                <Dialog.Footer p="0">
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorPalette="blue.800"
                    loading={isSubmitting}
                  >
                    Add
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
