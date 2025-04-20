import { Box, Text, Timeline } from "@chakra-ui/react";
import { LuCalendarDays } from "react-icons/lu";
import Link from "next/link";

export default function EventTimeline({ events, tripId, tripTitle }) {
  return (
    <Box>
      {events.length > 0 ? (
        <Timeline.Root size="xl">
          {events.map((event) => (
            <Timeline.Item key={event.id}>
              <Timeline.Connector>
                <Timeline.Separator borderColor="blue.800" />
                <Timeline.Indicator bg="blue.800">
                  <LuCalendarDays />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Link
                  href={{
                    pathname: `/trips/${tripId}/events/${event.id}`,
                    query: {
                      tripTitle,
                    },
                  }}
                >
                  <Timeline.Title
                    _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    fontSize="md"
                  >
                    {event.name}
                  </Timeline.Title>
                </Link>
                <Timeline.Description>
                  {new Date(event.date).toLocaleDateString()}
                </Timeline.Description>
                <Text textStyle="sm">
                  {event.description || "No description provided"}
                </Text>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
      ) : (
        <Text mt={4}>No events yet</Text>
      )}
    </Box>
  );
}
