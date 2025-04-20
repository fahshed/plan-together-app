import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/components/ui/theme";
import Layout from "@/components/layout";
import { isLoggedIn } from "@/utils/auth";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { Toaster } from "@/components/ui/toaster";
import { ColorModeProvider } from "@/components/ui/color-mode";

// import { ThemeProvider } from "next-themes";
// import "@/styles/globals.css";

const noLayoutRoutes = ["/login", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPage = noLayoutRoutes.includes(router.pathname);
    const loggedIn = isLoggedIn();

    if (!publicPage && !loggedIn) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router.pathname]);

  if (!authorized && !noLayoutRoutes.includes(router.pathname)) return null;

  const Page = (
    <>
      <PagesTopLoader color="red" />
      <Toaster />
      <Component {...pageProps} />
    </>
  );
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {noLayoutRoutes.includes(router.pathname) ? (
          Page
        ) : (
          <Layout>{Page}</Layout>
        )}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
