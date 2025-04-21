import {
  Avatar,
  Badge,
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
  Center,
  Blockquote,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import tripApi from "@/api/trip";
import AddMemberDialog from "@/components/member-dialog";
import EventDialog from "@/components/event-dialog";
import { getUserFromLocalStorage } from "@/utils/auth";
import { toaster } from "@/components/ui/toaster";
import EventTimeline from "@/components/event-timeline";
import DeleteDialog from "@/components/delete-dialog";
import EventDiagram from "@/components/event-diagram";

export default function TripDetailsPage() {
  const router = useRouter();
  const { tripId } = router.query;
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [refreshEvents, setRefreshEvents] = useState(false);
  const currentUser = getUserFromLocalStorage();

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      try {
        const response = await tripApi.get(`/${tripId}`);
        setTrip(response.data);
        setMembers(response.data.members || []);
        const eventsResponse = await tripApi.get(`/${tripId}/events`);
        setEvents(eventsResponse.data || []);
      } catch (error) {
        toaster.create({
          title: `Error fetching trip: ${error.message}`,
          type: "error",
        });
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, refreshEvents]);

  const handleAddMember = async (newMemberEmail) => {
    if (!newMemberEmail) return;

    try {
      const response = await tripApi.post(`/${tripId}/invite`, {
        email: newMemberEmail,
      });

      setMembers([...members, response.data.member]);
      toaster.create({
        title: "Member added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error inviting member:", error);
      toaster.create({
        title: `Error inviting member: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
    }
  };

  const handleEventCreated = () => {
    setRefreshEvents((prev) => !prev);
  };

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="red" />
      </Center>
    );
  }

  if (!trip) {
    return (
      <Box p={8}>
        <Text>Trip not found</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Grid templateColumns={["1fr", null, "2fr 1fr"]} gap={10}>
        <GridItem>
          <VStack align="start" gap={6}>
            <Box>
              <Heading size="4xl" mb={2}>
                {trip.title}
              </Heading>
              <Box mb={4}>
                <HStack spacing={3}>
                  {trip.tags.map((tag, i) => (
                    <Badge key={i}>{tag}</Badge>
                  ))}
                </HStack>
              </Box>
              <Blockquote.Root colorPalette="blue">
                <Blockquote.Content>
                  {trip.summary || "No summary provided"}
                </Blockquote.Content>
              </Blockquote.Root>
            </Box>

            <Box width="full">
              <Heading size="lg" mb={2}>
                Events
              </Heading>

              <EventDialog
                tripId={tripId}
                onEventCreated={handleEventCreated}
              />

              {events.length > 0 && <EventDiagram events={events} />}

              <Box mt={4}>
                <EventTimeline
                  events={events}
                  tripId={tripId}
                  tripTitle={trip.title}
                />
              </Box>
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" gap={6}>
            <Box>
              <Heading size="lg" mb={2}>
                Owner
              </Heading>
              <HStack gap="4">
                <Avatar.Root>
                  <Avatar.Fallback
                    name={`${trip.owner.firstName} ${trip.owner.lastName}`}
                  />
                  <Avatar.Image
                    src={`https://avatar.iran.liara.run/public?username=${trip.owner.userId}`}
                  />
                </Avatar.Root>
                <Stack gap="0">
                  <Text fontWeight="medium">
                    {trip.owner.firstName} {trip.owner.lastName}
                  </Text>
                  <Text color="fg.muted" textStyle="sm">
                    {trip.owner.email}
                  </Text>
                </Stack>
              </HStack>
            </Box>

            <Box>
              <Heading size="lg" mb={2}>
                Members
              </Heading>
              <Stack gap="4">
                {members.map((member) => (
                  <HStack key={member.userId} gap="4">
                    <Avatar.Root>
                      <Avatar.Fallback
                        name={`${member.firstName} ${member.lastName}`}
                      />
                      <Avatar.Image
                        src={`https://avatar.iran.liara.run/public?username=${member.userId}`}
                      />
                    </Avatar.Root>
                    <Stack gap="0">
                      <Text fontWeight="medium">{`${member.firstName} ${member.lastName}`}</Text>
                      <Text color="fg.muted" textStyle="sm">
                        {member.email || "No email provided"}
                      </Text>
                    </Stack>
                  </HStack>
                ))}
              </Stack>
            </Box>

            {currentUser && currentUser.id === trip.owner.userId && (
              <AddMemberDialog handleAddMember={handleAddMember} />
            )}

            {currentUser && currentUser.id === trip.owner.userId && (
              <DeleteDialog
                deleteURL={`/${tripId}`}
                deleteText={trip.title}
                deleteEntity="Trip"
                redirectURL="/trips"
              />
            )}
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
