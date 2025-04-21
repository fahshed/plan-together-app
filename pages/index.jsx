import { Box, Heading, Text, Highlight, Flex, VStack } from "@chakra-ui/react";

const colorPalette = [
  "red.solid",
  "blue.solid",
  "green.solid",
  "yellow.solid",
  "purple.solid",
  "orange.solid",
  "teal.solid",
  "cyan.solid",
  "pink.solid",
  "gray.solid",
];

export default function HomePage() {
  return (
    <VStack>
      <Heading size="5xl" mb="4" color="blue.800">
        PlanTogether
      </Heading>
      <Text fontSize="2xl" maxW="2xl" mb="4" fontWeight="bold">
        <Highlight
          query="effortless"
          styles={{
            px: "1",
            bg: "teal.subtle",
            color: "teal",
          }}
        >
          Make group trips effortless.
        </Highlight>
      </Text>

      <Text fontSize="lg" maxW="3xl" mb="6" textAlign="center">
        Plan events, split expenses, assign tasks, and keep your crew in
        sync—whether it’s a weekend getaway or a cross-country adventure.
      </Text>

      <VStack spacing="12" mb="16">
        <Feature
          heading="🧭 Smart Trip Planning"
          description="Create trips, invite friends, and organize everything from one dashboard."
          color="purple"
        />
        <Feature
          heading="💸 Shared Expenses, Simplified"
          description="Track who paid what. Automatically calculate who owes whom—like Splitwise, built in."
          color="green"
        />
        <Feature
          heading="✅ Collaborative To-Do Lists"
          description="Assign tasks, monitor progress, and get things done together."
          color="orange"
        />
        <Feature
          heading="📆 Event-Centric Travel"
          description="Break trips into events, attach transactions, tasks, and receipts to each one."
          color="blue"
        />
      </VStack>

      {/* Color Palette Showcase */}

      <Heading size="lg" mb="4">
        Theme Palette
      </Heading>
      <Flex wrap="wrap" gap="3" justify="center">
        {colorPalette.map((color) => (
          <Box
            key={color}
            px="4"
            py="2"
            bg={color}
            color="white"
            rounded="md"
            fontWeight="medium"
          >
            {color}
          </Box>
        ))}
      </Flex>

      {/* Feedback / Textarea */}
      <Box maxW="lg" mt="8">
        <Heading size="md" colorPalette="pink" mb="3">
          We'd love your feedback
        </Heading>
      </Box>
    </VStack>
  );
}

function Feature({ heading, description, color }) {
  return (
    <VStack
      bg="teal"
      color="white"
      p="6"
      rounded="lg"
      border="1px solid"
      borderColor="gray.200"
      w="lg"
      _hover={{ shadow: "md", bg: "#14b8a6" }}
    >
      <Heading size="md" mb="2" colorPalette={color}>
        {heading}
      </Heading>
      <Text fontSize="md" textAlign="center">
        {description}
      </Text>
    </VStack>
  );
}
