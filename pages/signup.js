import Head from "next/head";
import SignUp from "@/components/sign-up";
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
        pt="16"
        minHeight="100vh"
        backgroundImage="url('https://doodleipsum.com/1600x900/flat?bg=2563eb')"
      >
        <SignUp />
      </Box>
    </>
  );
}
