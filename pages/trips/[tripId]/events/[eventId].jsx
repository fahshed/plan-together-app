import {
  Box,
  Heading,
  Center,
  Spinner,
  Text,
  HStack,
  Avatar,
  Blockquote,
  Tabs,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import transactionApi from "@/api/transaction";
import tripApi from "@/api/trip";
import { toaster } from "@/components/ui/toaster";
import TransactionTable from "@/components/transaction-table";
import CreateTransactionDialog from "@/components/transaction-dialog";
import CreateTaskDialog from "@/components/task-dialog";
import TaskCardGroup from "@/components/task-card-group";
import { LuReceipt, LuSquareCheck } from "react-icons/lu";

export default function EventDetailsPage() {
  const router = useRouter();
  const { tripId, eventId, tripTitle } = router.query;

  const [eventDetails, setEventDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId || !eventId) return;

    const fetchEventAndTransactions = async () => {
      setLoading(true);
      try {
        const eventResponse = await tripApi.get(`/${tripId}/events/${eventId}`);
        setEventDetails(eventResponse.data);

        const tasksResponse = await tripApi.get(
          `/${tripId}/events/${eventId}/tasks/grouped`
        );
        setGroupedTasks(tasksResponse.data);

        const transactionResponse = await transactionApi.get(
          `/trips/${tripId}/events/${eventId}`
        );
        setTransactions(transactionResponse.data);
      } catch (error) {
        toaster.create({
          title: `Error fetching data: ${error.message}`,
          type: "error",
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndTransactions();
  }, [tripId, eventId]);

  const handleTaskStatusUpdate = async (memberId, taskIndex, taskId) => {
    const oldTaskStatus = groupedTasks[memberId][taskIndex].status;
    const newTaskStatus =
      oldTaskStatus === "completed" ? "pending" : "completed";
    try {
      const response = await tripApi.patch(
        `/${tripId}/events/${eventId}/tasks/${taskId}/status`,
        {
          taskStatus: newTaskStatus,
        }
      );
      groupedTasks[memberId][taskIndex].status = newTaskStatus;
    } catch (error) {
      toaster.create({
        title: `Error updating task status: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="red" />
      </Center>
    );
  }

  if (!eventDetails) {
    return (
      <Center minHeight="100vh">
        <Heading size="lg" color="gray.500">
          Event not found
        </Heading>
      </Center>
    );
  }

  return (
    <Box>
      <Box mb={6}>
        <Heading size="4xl" mb={2}>
          {tripTitle} &gt; {eventDetails.name}
        </Heading>

        <Text mb={2}>{new Date(eventDetails.date).toLocaleDateString()}</Text>

        <Blockquote.Root colorPalette="blue" mb={2} maxW="600px">
          <Blockquote.Content>
            {eventDetails.description || "No description provided"}
          </Blockquote.Content>
        </Blockquote.Root>

        <HStack gap="2" mb={2}>
          <Text>Created by</Text>
          <Avatar.Root size="xs">
            <Avatar.Fallback
              name={`${eventDetails.createdBy.firstName} ${eventDetails.createdBy.lastName}`}
            />
            <Avatar.Image
              src={`https://avatar.iran.liara.run/public?username=${eventDetails.createdBy.userId}`}
            />
          </Avatar.Root>
          <Text>
            {`${eventDetails.createdBy.firstName} ${eventDetails.createdBy.lastName}`}
          </Text>
        </HStack>
      </Box>

      <Tabs.Root defaultValue="transactions" mb={6}>
        <Tabs.List>
          <Tabs.Trigger value="transactions">
            <LuReceipt />
            <Link unstyled href="#transactions">
              Transactions
            </Link>
          </Tabs.Trigger>

          <Tabs.Trigger value="tasks">
            <LuSquareCheck />
            <Link unstyled href="#tasks">
              Tasks
            </Link>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="transactions">
          <Box>
            <Box mb={2}>
              <CreateTransactionDialog
                tripId={tripId}
                eventId={eventId}
                onCreate={(newTransaction) =>
                  setTransactions([newTransaction, ...transactions])
                }
              />
            </Box>

            <TransactionTable transactions={transactions} />
          </Box>
        </Tabs.Content>
        <Tabs.Content value="tasks">
          <Box mb={6}>
            <Box mb={4}>
              <CreateTaskDialog
                tripId={tripId}
                eventId={eventId}
                onCreate={setGroupedTasks}
              />
            </Box>

            <HStack mb={2} gap="2" alignItems="start" overflow="auto">
              {Object.entries(groupedTasks).map(([memberId, taskList]) => (
                <TaskCardGroup
                  key={memberId}
                  member={taskList[0]?.assignedTo}
                  taskList={taskList}
                  tripId={tripId}
                  eventId={eventId}
                  onTaskStatusUpdate={handleTaskStatusUpdate}
                />
              ))}
            </HStack>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
