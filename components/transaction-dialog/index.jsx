import {
  Avatar,
  Button,
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
  FileUpload,
  Text,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import transactionApi from "@/api/transaction";
import tripApi from "@/api/trip";
import { toaster } from "@/components/ui/toaster";
import { HiUpload } from "react-icons/hi";
import { RiAddLine } from "react-icons/ri";
import { getUserFromLocalStorage } from "@/utils/auth";

const allowedCategories = createListCollection({
  items: [
    { label: "🍔 Food", value: "food" },
    { label: "🚗 Transport", value: "transport" },
    { label: "🏨 Stay", value: "stay" },
    { label: "🎫 Activity", value: "activity" },
    { label: "🛍️ Shopping", value: "shopping" },
  ],
});

export default function CreateTransactionDialog({ tripId, eventId, onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberDict, setMemberDict] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef(null);
  const currentUser = getUserFromLocalStorage();

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
            acc[member.userId] = `${member.firstName} ${member.lastName}`;
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
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("amount", data.amount);
    formData.append("category", data.category[0]);
    formData.append(
      "paidBy",
      JSON.stringify({
        userId: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
      })
    );
    formData.append(
      "splitBetween",
      JSON.stringify(
        data.splitBetween.map((memberId) => ({
          userId: memberId,
          name: memberDict[memberId],
        }))
      )
    );
    formData.append("createdAt", new Date().toISOString());
    if (data.receipt?.[0]) {
      formData.append("receipt", data.receipt[0]);
    }

    try {
      const response = await transactionApi.post(
        `/trips/${tripId}/events/${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onCreate(response.data);
      toaster.create({
        title: "Transaction created successfully!",
        type: "success",
      });

      setIsOpen(false);
      reset();
    } catch (error) {
      toaster.create({
        title: `Error creating transaction: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
      console.error("Error creating transaction:", error);
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
          Add Transaction <RiAddLine />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content ref={contentRef}>
            <Dialog.Header>
              <Dialog.Title>Create a New Transaction</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="2">
                  <Text fontWeight="medium">Paid by</Text>
                  <HStack gap="2" mb={2}>
                    <Avatar.Root size="xs">
                      <Avatar.Fallback
                        name={`${currentUser.firstName} ${currentUser.lastName}`}
                      />
                      <Avatar.Image
                        src={`https://avatar.iran.liara.run/public?username=${currentUser.id}`}
                      />
                    </Avatar.Root>
                    <Text>
                      {`${currentUser.firstName} ${currentUser.lastName}`}
                    </Text>
                  </HStack>

                  {/* Description */}
                  <Field.Root invalid={!!errors.description}>
                    <Field.Label>Description</Field.Label>
                    <Input
                      placeholder="Enter description"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  {/* Amount */}
                  <Field.Root invalid={!!errors.amount}>
                    <Field.Label>Amount</Field.Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...register("amount", {
                        required: "Amount is required",
                        validate: (value) =>
                          value > 0 || "Amount must be greater than zero",
                      })}
                    />
                    <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
                  </Field.Root>

                  {/* Category */}
                  <Field.Root invalid={!!errors.category}>
                    <Field.Label>Category</Field.Label>
                    <Controller
                      control={control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select.Root
                          name={field.name}
                          value={field.value}
                          onValueChange={({ value }) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                          collection={allowedCategories}
                          colorPalette="red"
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select category" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Portal container={contentRef}>
                            <Select.Positioner>
                              <Select.Content>
                                {allowedCategories.items.map((category) => (
                                  <Select.Item
                                    item={category}
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
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
                      {errors.category?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  {/* Split Between */}
                  <Field.Root invalid={!!errors.splitBetween}>
                    <Field.Label>Split Between</Field.Label>
                    <Controller
                      control={control}
                      name="splitBetween"
                      rules={{ required: "Split Between is required" }}
                      render={({ field }) => (
                        <Select.Root
                          multiple
                          name={field.name}
                          value={field.value}
                          onValueChange={({ value }) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                          collection={members}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select members" />
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
                      {errors.splitBetween?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  {/* Receipt */}
                  <Field.Root invalid={!!errors.receipt}>
                    <Field.Label>Receipt</Field.Label>
                    <Center>
                      <FileUpload.Root
                        accept={["image/*"]}
                        {...register("receipt")}
                      >
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger asChild>
                          <Button variant="outline">
                            <HiUpload /> Upload file
                          </Button>
                        </FileUpload.Trigger>
                        <FileUpload.List />
                      </FileUpload.Root>
                    </Center>
                    <Field.ErrorText>{errors.receipt?.message}</Field.ErrorText>
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
