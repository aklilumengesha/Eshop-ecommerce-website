import "@/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreProvider, Store } from "@/utils/Store";
import { SocketProvider } from "@/utils/SocketContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useContext, useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <DarkModeHandler />
        <SocketProvider>
          <PayPalScriptProvider deferLoading={true}>
            <ToastContainer position="top-right" limit={1} />
            {Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </PayPalScriptProvider>
        </SocketProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function DarkModeHandler() {
  const { state } = useContext(Store);
  const { darkMode } = state;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null;
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=Login required");
    },
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=Admin access required");
  }

  return children;
}
