import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { RiDeleteBin5Fill } from "react-icons/ri";
import tripApi from "@/api/trip";
import { useRouter } from "next/router";

export default function DeleteDialog({
  deleteURL,
  deleteText,
  deleteEntity,
  redirectURL,
}) {
  const router = useRouter();
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
      if (data.title !== deleteText) {
        throw new Error("Title/Name does not match.");
      }
      setIsSubmitting(true);
      await tripApi.delete(deleteURL);
      router.push(redirectURL);
      toaster.create({
        title: "Deletion Successful",
        type: "success",
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error deleting entity:", error);
      toaster.create({
        title: `Error in deletion: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} placement="center">
      <Dialog.Trigger asChild>
        <Button variant="outline">
          <RiDeleteBin5Fill /> Delete {deleteEntity}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Confimation</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>Type in the name/title to confirm</Field.Label>
                    <Input
                      placeholder="Enter name/title"
                      {...register("title", {
                        required: "Title/Name is required",
                      })}
                    />
                    <Field.HelperText color="red.500">
                      {errors.title?.message}
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
                <Dialog.Footer p="0" mt="4">
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Delete
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
