import "@/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreProvider, Store } from "@/utils/Store";
import { SocketProvider } from "@/utils/SocketContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useContext, useEffect, useState } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <DarkModeHandler />
        <RouteLoadingIndicator />
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

function RouteLoadingIndicator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      // Only show loading for different routes
      if (url !== router.asPath) {
        setLoading(true);
      }
    };
    
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress-bar shadow-lg"></div>
      </div>
      
      {/* Full Page Overlay with Loading Animation */}
      <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-[9998]">
        <div className="text-center">
          {/* Animated Spinner */}
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          
          {/* Loading Text with Animation */}
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
              Loading
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait a moment
            </p>
          </div>

          {/* Optional: Shopping Icon */}
          <div className="mt-4 opacity-50">
            <svg
              className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

function DarkModeHandler() {
  const { state } = useContext(Store);
  const { darkMode, fontSize } = state;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Remove all font size classes
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    
    // Add the appropriate font size class
    if (fontSize === 'small') {
      document.documentElement.classList.add('text-sm');
    } else if (fontSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.add('text-base');
    }
  }, [fontSize]);

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
