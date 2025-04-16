import { Box, Heading, Stack, Spinner, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TripCard from "@/components/trip-card";
import CreateTripDialog from "@/components/trip-dialog";
import tripApi from "@/api/trip";
import { toaster } from "@/components/ui/toaster";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripApi.get("/user");
        setTrips(response.data);
      } catch (error) {
        toaster.create({
          title: `Error fetching trips: ${error}`,
          type: "error",
        });
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleCreate = async (trip) => {
    try {
      const response = await tripApi.post("/", {
        title: trip.title,
        summary: trip.summary,
        tags: trip.tags || ["New"],
        createdAt: new Date().toISOString(),
      });

      const newTrip = response.data;
      setTrips([newTrip, ...trips]);
      toaster.create({
        title: "Trip created successfully!",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: `Error creating trip: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
      console.error("Error creating trip:", error);
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
    <Center pt="6" flexDirection="column">
      <Heading mb="6" size="2xl" textAlign="center">
        All Your Trips are Here!
      </Heading>
      <Box mb="6">
        <CreateTripDialog onCreate={handleCreate} />
      </Box>
      <Stack gap="6" align="center">
        {trips.map((indtrip, index) => (
          <TripCard
            key={indtrip.id}
            id={indtrip.id}
            title={indtrip.title}
            image={`https://doodleipsum.com/400x400/flat?bg=2563eb&n=${index}`}
            summary={indtrip.summary}
            tags={indtrip.tags}
          />
        ))}
      </Stack>
    </Center>
  );
}
