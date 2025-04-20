import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Link as ChakraLink,
} from "@chakra-ui/react";

export default function TripCard({ id, title, summary, image, tags = [] }) {
  return (
    <Card.Root flexDirection="row" overflow="hidden" w="2xl" variant="elevated">
      <Image objectFit="cover" width="200px" src={image} alt={title} />
      <Box>
        <Card.Body>
          <Card.Title mb="2">{title}</Card.Title>
          <Card.Description>{summary}</Card.Description>
          <HStack mt="4">
            {tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </HStack>
        </Card.Body>
        <Card.Footer>
          <ChakraLink as={NextLink} href={`/trips/${id}`} passHref>
            <Button>View Trip</Button>
          </ChakraLink>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
