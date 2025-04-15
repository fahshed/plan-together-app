import Head from "next/head";
import Login from "@/components/login";
import { Box } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>PlanTogether</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        mt="16"
        minHeight="100vh"
      >
        <Login />
      </Box>
    </>
  );
}
