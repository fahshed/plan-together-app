import {
  Box,
  Heading,
  HStack,
  Spinner,
  Center,
  Select,
  Portal,
  createListCollection,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { toaster } from "@/components/ui/toaster";
import transactionApi from "@/api/transaction";
import LedgerTable from "@/components/ledger-table";
import ExpenseBarChart from "@/components/bar-chart";
import tripApi from "@/api/trip";

export default function TripsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [trips, setTrips] = useState([]);
  const tripDict = useMemo(
    () =>
      trips.reduce((acc, trip) => {
        acc[trip.id] = trip;
        return acc;
      }, {}),
    [trips]
  );
  const allowedTrips = createListCollection({
    items: trips.map((trip) => ({
      label: trip.title,
      value: trip.id,
    })),
  });
  const [categoryTransactions, setCategoryTransactions] = useState([]);
  const [eventTransactions, setEventTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripResponse = await tripApi.get("/user");
        setTrips(tripResponse.data || []);

        if (tripResponse.data.length > 0) {
          setSelectedTripId(tripResponse.data[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        toaster.create({
          title: `Error fetching trips: ${error}`,
          type: "error",
        });
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (!selectedTripId) return;

    const fetchTripData = async () => {
      try {
        setLoading(true);

        const [categoryRes, eventRes, userRes] = await Promise.all([
          transactionApi.get(`/trips/${selectedTripId}/expenses/by-category`),
          transactionApi.get(`/trips/${selectedTripId}/expenses/by-event`),
          transactionApi.get(`/trips/${selectedTripId}/expenses/by-user`),
        ]);

        setCategoryTransactions(categoryRes.data || []);
        setEventTransactions(eventRes.data || []);
        setUserTransactions(userRes.data || []);
      } catch (error) {
        toaster.create({
          title: `Error fetching trip data: ${error}`,
          type: "error",
        });
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [selectedTripId]);

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="red" />
      </Center>
    );
  }

  if (trips.length === 0) {
    return (
      <Center minHeight="80vh">
        <Heading size="xl">
          No trips available. Please create a trip first.
        </Heading>
      </Center>
    );
  }

  return (
    <Box>
      <Heading mb="2" size="xl">
        Choose one of your Trip
      </Heading>

      <Select.Root
        value={selectedTripId}
        onValueChange={(e) => setSelectedTripId(e.value)}
        collection={allowedTrips}
        mb="6"
        width="sm"
        bg="white"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a Trip" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {allowedTrips.items.map((trip) => (
                <Select.Item item={trip} key={trip.value}>
                  {trip.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <Text mb="4" size="md">
        Now showing data for trip <b>"{tripDict[selectedTripId]?.title}"</b>
      </Text>

      <Heading mb="4" size="xl">
        Some Analytics
      </Heading>
      <HStack mb="8" gap="4">
        {categoryTransactions.length > 0 && (
          <ExpenseBarChart
            data={categoryTransactions}
            dataKey="category"
            caption="Expenses by Categories"
          />
        )}
        {eventTransactions.length > 0 && (
          <ExpenseBarChart
            data={eventTransactions}
            dataKey="eventId"
            caption="Expenses by Events"
          />
        )}
        {userTransactions.length > 0 && (
          <ExpenseBarChart
            data={userTransactions}
            dataKey="userId"
            caption="Expenses by Members"
          />
        )}
      </HStack>
      <Heading mb="4" size="xl">
        Who owes what to whom?
      </Heading>
      <LedgerTable tripId={selectedTripId} />
    </Box>
  );
}
