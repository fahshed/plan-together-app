import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  Spacer,
  Avatar,
  Menu,
  Portal,
  Spinner,
  useBreakpointValue,
  IconButton,
  Collapsible,
  VStack,
  Stack,
  Separator,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { getUserFromLocalStorage } from "@/utils/auth";
import { RiCloseLargeLine, RiCloseLine } from "react-icons/ri";
import { FaHamburger } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // eslint-disable-next-line no-undef
    localStorage.removeItem("token");
    // eslint-disable-next-line no-undef
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        color="red"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

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
          padding="6"
          bg="blue.800"
          color="white"
        >
          <Text fontSize="2xl" fontWeight="bold">
            PlanTogether
          </Text>

          <Spacer />

          {isMobile ? (
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              color="white"
            >
              {isMenuOpen ? <RiCloseLargeLine /> : <GiHamburgerMenu />}
            </IconButton>
          ) : (
            <HStack gap="8">
              <Link as={NextLink} href="/" color="white">
                Home
              </Link>
              <Link as={NextLink} href="/trips" color="white">
                Trips
              </Link>
              <Link as={NextLink} href="/transactions" color="white">
                Expenses
              </Link>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <div>
                    <Avatar.Root bg="white">
                      <Avatar.Image
                        src={`https://avatar.iran.liara.run/public?username=${user.id}`}
                      />
                    </Avatar.Root>
                  </div>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content bg="red.500">
                      <Menu.Item color="white">{`${user?.firstName} ${user?.lastName}`}</Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        value="logout"
                        onClick={handleLogout}
                        color="white"
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          )}
        </Flex>

        <Collapsible.Root open={isMenuOpen} bg="blue.800" color="white">
          <Collapsible.Content>
            <VStack gap="3" p="6" align="start">
              <HStack gap="2">
                <Avatar.Root bg="white" size="2xs">
                  <Avatar.Image
                    src={`https://avatar.iran.liara.run/public?username=${user.id}`}
                  />
                </Avatar.Root>
                <Box color="white">{`${user?.firstName} ${user?.lastName}`}</Box>
              </HStack>
              <Link as={NextLink} href="/" color="white">
                Home
              </Link>
              <Link as={NextLink} href="/trips" color="white">
                Trips
              </Link>
              <Link as={NextLink} href="/transactions" color="white">
                Expenses
              </Link>
              <Box value="logout" onClick={handleLogout} color="white">
                Logout
              </Box>
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>

        <Box p={isMobile ? "6" : "12"}>{children}</Box>
      </Box>
    </>
  );
}
