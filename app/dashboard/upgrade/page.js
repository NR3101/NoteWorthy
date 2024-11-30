"use client";

import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import PayPalButtons with SSR disabled
const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then(mod => mod.PayPalButtons),
  { ssr: false }
);

const PlanFeature = ({ text }) => (
  <li className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 text-purple-600 dark:text-purple-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
    <span className="text-gray-700 dark:text-gray-300">{text}</span>
  </li>
);

const UpgradePlan = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const updateUserPlanMutation = useMutation(api.user.updateUserPlan);
  const userInfo = useQuery(api.user.getUserInfo, {
    email: user?.primaryEmailAddress?.emailAddress,
  });

  const onPaymentSuccess = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      toast({
        variant: "error",
        title: "Error",
        description:
          "Unable to verify your email. Please try logging in again.",
        className:
          "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
      });
      return;
    }

    try {
      await updateUserPlanMutation({
        userEmail,
      });

      toast({
        variant: "default",
        title: "Payment successful",
        description: "You have successfully upgraded to the pro plan",
        className:
          "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/90 text-green-800 dark:text-green-100",
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to update your plan. Please contact support.",
        className:
          "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
      });
    }
  };

  const isPro = userInfo?.isPro;
  const isLoading = userInfo === undefined;

  return (
    <div className="max-w-3xl mx-auto px-2 py-4">
      <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
        Our Plans
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        Upgrade to our PRO plan to upload more PDFs and take better notes.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10 mt-10">
        {/* Pro Plan */}
        <div className="rounded-xl border border-purple-500 dark:border-purple-600/50 bg-white dark:bg-gray-900 p-6 shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-fuchsia-600 text-white text-xs px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Pro Plan
            </h2>
            <p className="mt-4">
              <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                $10
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                /month
              </span>
            </p>
          </div>

          <ul className="mt-6 space-y-4">
            <PlanFeature text="Unlimited PDF Uploads" />
            <PlanFeature text="Unlimited Note-Taking" />
            <PlanFeature text="Email Support" />
            <PlanFeature text="Gemini AI Access" />
          </ul>

          <div className="mt-8 flex justify-center">
            <div className="w-[100%] sm:w-[90%] md:w-[85%] lg:w-[90%]">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-4 text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              ) : isPro ? (
                <button
                  className="block w-full rounded-full border border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-900 px-6 py-3 text-center text-sm font-medium text-purple-600 dark:text-purple-400
                hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:outline-none focus:ring focus:ring-purple-300 dark:focus:ring-purple-800 transition-colors duration-200
                "
                >
                  Current Plan
                </button>
              ) : (
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    shape: "sharp",
                    height: 55,
                    color: "gold",
                    label: "pay",
                    tagline: false,
                  }}
                  fundingSource="paypal"
                  onApprove={() => onPaymentSuccess()}
                  onCancel={() => {
                    console.log("Payment cancelled");
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        { amount: { value: "10", currency_code: "USD" } },
                      ],
                    });
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Free Plan */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Free Plan
            </h2>
            <p className="mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                $0
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                /month
              </span>
            </p>
          </div>

          <ul className="mt-6 space-y-4">
            <PlanFeature text="5 PDF Uploads" />
            <PlanFeature text="Unlimited Note-Taking" />
            <PlanFeature text="Email Support" />
            <PlanFeature text="Gemini AI Access" />
          </ul>

          <div className="mt-8">
            {!isLoading && (
              <button className="block w-full rounded-full border border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-900 px-6 py-3 text-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:outline-none focus:ring focus:ring-purple-300 dark:focus:ring-purple-800 transition-colors duration-200">
                {!isPro ? "Current Plan" : "Basic Plan"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
