import { Store } from "@/utils/Store";
import { Menu } from "@headlessui/react";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import DropdownLink from "./DropdownLink";
import WelcomeBanner from "./WelcomeBanner";
import ConnectionStatus from "./ConnectionStatus";
import SearchAutocomplete from "./SearchAutocomplete";
import { currencyMetadata, setDefaultCurrency, fetchExchangeRates } from "@/utils/currency";

function Layout({ title, children }) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart, currency, wishlist, compare } = state;

  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);
  const [compareItemsCount, setCompareItemsCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  useEffect(() => {
    setWishlistItemsCount(wishlist.wishlistItems.length);
  }, [wishlist.wishlistItems]);

  useEffect(() => {
    setCompareItemsCount(compare.compareItems.length);
  }, [compare.compareItems]);

  // Fetch exchange rates on mount
  useEffect(() => {
    const loadRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        setRatesLoading(false);
      }
    };
    loadRates();
  }, []);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const changeCurrency = (currencyCode) => {
    setDefaultCurrency(currencyCode);
    dispatch({ type: "SET_CURRENCY", payload: currencyCode });
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - eShop` : "eShop"}</title>
        <meta name="description" content="eShop - Modern E-commerce Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        {/* Welcome Banner - Above Header */}
        <WelcomeBanner />
        
        <header>
          <nav className="flex h-14 justify-between shadow-md items-center px-16">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <Link href="/">
                <span className="text-2xl font-bold">eShop</span>
              </Link>
            </div>

            <div className="mx-auto hidden w-full justify-center md:flex">
              <SearchAutocomplete />
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Currency Selector */}
              <Menu as="div" className="relative inline-block z-10">
                <Menu.Button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                  <span className="font-medium">{currency}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </Menu.Button>
                <Menu.Items className="absolute right-0 w-48 origin-top-right p-2 bg-white shadow-lg rounded-lg mt-2 max-h-96 overflow-y-auto">
                  {ratesLoading && (
                    <div className="px-4 py-2 text-sm text-gray-500 text-center">
                      Loading rates...
                    </div>
                  )}
                  {Object.keys(currencyMetadata).map((code) => (
                    <Menu.Item key={code}>
                      {({ active }) => (
                        <button
                          onClick={() => changeCurrency(code)}
                          className={`${
                            active ? "bg-blue-50" : ""
                          } ${
                            currency === code ? "bg-blue-100 font-semibold" : ""
                          } w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors flex items-center justify-between`}
                        >
                          <span>
                            {currencyMetadata[code].symbol} {code}
                          </span>
                          <span className="text-xs text-gray-500">
                            {currencyMetadata[code].name}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                  {exchangeRates && !ratesLoading && (
                    <div className="px-4 py-2 text-xs text-gray-400 text-center border-t mt-2">
                      Live rates • Updated hourly
                    </div>
                  )}
                </Menu.Items>
              </Menu>

              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="flex items-center gap-2 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right p-2 bg-white shadow-lg rounded-t-lg rounded-b-lg">
                    <Menu.Item>
                      <DropdownLink href="/profile">Profile</DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/wishlist">
                        Wishlist ({wishlistItemsCount})
                      </DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      <DropdownLink href="#" logout={logoutClickHandler}>
                        Logout
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <span className="p-2">Login</span>
                </Link>
              )}

              {/* Compare */}
              <Link href="/compare">
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                      />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-semibold text-white min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                      {compareItemsCount}
                    </span>
                  </div>
                  <span className="text-base font-medium">Compare</span>
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                      {cartItemsCount}
                    </span>
                  </div>
                  <span className="text-base font-medium">Cart</span>
                </div>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setToggle(!toggle)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                  />
                </svg>
              </button>
            </div>
          </nav>

          <div
            id="mobile-menu"
            className={`${
              toggle === false ? "hidden" : ""
            } md:hidden flex flex-col my-3 mx-3 p-2 bg-gray-50 rounded-md shadow-md`}
          >
            <div className="py-4 px-4 text-sm mx-auto w-full">
              <SearchAutocomplete />
            </div>

            <div className="flex flex-col space-y-3 mx-auto">
              <div>
                <Link href="/compare">
                  <div className="flex items-center gap-2 relative">
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-semibold text-white min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                        {compareItemsCount}
                      </span>
                    </div>
                    <span className="text-base font-medium">Compare</span>
                  </div>
                </Link>
              </div>
              <div>
                <Link href="/cart">
                  <div className="flex items-center gap-2 relative">
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                        {cartItemsCount}
                      </span>
                    </div>
                    <span className="text-base font-medium">Cart</span>
                  </div>
                </Link>
              </div>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="flex space-x-4 items-center">
                    {session.user.name}
                    <svg
                      className="h-4 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute w-40 p-2 bg-white shadow-lg rounded-t-lg rounded-b-lg">
                    <Menu.Item>
                      <DropdownLink href="/profile">Profile</DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/wishlist">
                        Wishlist ({wishlistItemsCount})
                      </DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      <DropdownLink href="#" logout={logoutClickHandler}>
                        Logout
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <span className="p-2">Login</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="container m-auto mt-4 xl:px-14 md:px-12 px-8">
          {children}
        </main>

        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2026 eShop. All rights reserved.</p>
        </footer>

        {/* WebSocket Connection Status */}
        <ConnectionStatus />
      </div>
    </>
  );
}

export default Layout;
