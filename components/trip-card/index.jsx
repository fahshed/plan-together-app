import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

export default function TripCard({ title, summary, image, tags = [] }) {
  return (
    <Card.Root flexDirection="row" overflow="hidden" w="2xl">
      <Image objectFit="cover" width="200px" src={image} alt={title} />
      <Box>
        <Card.Body>
          <Card.Title mb="2">{title}</Card.Title>
          <Card.Description>
            <Text>{summary}</Text>
          </Card.Description>
          <HStack mt="4">
            {tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </HStack>
        </Card.Body>
        <Card.Footer>
          <Button>View Trip</Button>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
