"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Dynamically import PayPalScriptProvider with SSR disabled
const PayPalProvider = dynamic(
  () =>
    Promise.resolve(({ children }) => (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture",
        }}
      >
        {children}
      </PayPalScriptProvider>
    )),
  { ssr: false }
);

const Providers = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ConvexProvider client={convex}>
        <PayPalProvider>{children}</PayPalProvider>
      </ConvexProvider>
    </ThemeProvider>
  );
};

export default Providers;
