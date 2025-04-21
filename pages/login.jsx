import Head from "next/head";
import Login from "@/components/login";
import { Box, Heading, VStack } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>PlanTogether</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <VStack
        pt="16"
        minHeight="100vh"
        backgroundImage="url('https://doodleipsum.com/3200x1800/outline')"
        backgroundSize="cover"
      >
        <Heading
          size="2xl"
          mb="4"
          bg="blue.800"
          color="white"
          p="4"
          rounded="md"
        >
          Start Planning Your Trips!
        </Heading>
        <Login />
      </VStack>
    </>
  );
}
