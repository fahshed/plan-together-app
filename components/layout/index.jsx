"use client";

import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  Spacer,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";

import NextLink from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>PlanTogether</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box minH="100vh">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1.5rem"
          bg="blue.800"
          color="white"
        >
          <Text fontSize="xl" fontWeight="bold">
            PlanTogether
          </Text>

          <Spacer />

          <HStack gap="8">
            <Link as={NextLink} href="/" color="white">
              Home
            </Link>
            <Link as={NextLink} href="/trips" color="white">
              Trips
            </Link>
            <Link as={NextLink} href="/signup" color="white">
              Sign Up
            </Link>
            <Link as={NextLink} href="/login" color="white">
              Login
            </Link>
            <Button
              // variant="outline"
              // bg="pink.600"
              size="sm"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

        <Box p={6}>{children}</Box>
      </Box>
    </>
  );
}
