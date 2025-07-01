"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { loadStripe } from "@stripe/stripe-js";
import StripeService from "@/app/services/stripe-handle";
import { useLocale } from "next-intl";
import { isEmpty } from "lodash";
import { useUserStore } from "@/app/store/user.store";
import useNavigateLocale from "@/app/hooks/useNavigateLocale";
import { useAuth } from "@/app/contexts/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const plans = [
  {
    name: "Premium Plan",
    price: "$300/month",
    description: "New subscribers get a 30-day free trial",
    features: [
      "Generate up to 300 detailed reports / month",
      "Access to all advanced features",
      "Priority customer support",
      "Exclusive analytics dashboard",
      "30-day free trial for new subscribers",
    ],
    additionalInfo: [
      "One-time setup fee waived",
      "24/7 premium support",
      "Dedicated account manager",
      "Cancel anytime during trial",
      "Trial available only for first-time subscribers",
    ],
    buttonText: "Start Free Trial",
    isPremium: true,
    amount: 300,
  },
];

// interface PricingPlanProps {
//   subscriptions: any; // Replace 'any' with the appropriate type if known
// }

const PricingPlan: React.FC = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const {
    getSubscription,
    subscriptions,
    isPlanLoading,
    getUserDetails,
    userDetails,
    createSubscription,
  } = useUserStore();
  const locale = useLocale();

  const { user, isAuthenticated } = useAuth();
  const hasSubscription = !isEmpty(subscriptions);

  useEffect(() => {
    if (isEmpty(userDetails) && isAuthenticated) {
      getUserDetails(user?.email as string);
    }
  }, [userDetails]);

  useEffect(() => {
    if (isAuthenticated) {
      if (userDetails?.stripeCustomerId) {
        getSubscription(userDetails?.stripeCustomerId);
      } else {
        createSubscription(userDetails?.email, userDetails?.name);
      }
    }
  }, [userDetails?.stripeCustomerId, ]);
  const navigateTo = useNavigateLocale();

  const handleCheckout = async (amount: number, planName: string) => {
    setLoading((prev) => ({ ...prev, [planName]: true }));
    if (!isAuthenticated) {
      return navigateTo("/auth/sign-in");
    }
    try {
      const stripe = await stripePromise;
      const domain = window.location.origin;
      const response = await StripeService.createCheckoutSession(
        userDetails?.stripeCustomerId || "",
        locale,
        domain,
        userDetails?.emailId || "",
        "SUBSCRIBE"
      );

      console.log({ response });
      const { session = {} } = response || {};

      if (amount === 0) {
        alert("You have selected the Free Plan. No payment is required.");
        setLoading((prev) => ({ ...prev, [planName]: false }));
        return;
      }

      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("An error occurred during the checkout process:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [planName]: false }));
    }
  };

  if (isPlanLoading) {
    return <CircularProgress color="primary" size={80} thickness={4} />;
  }

  if (hasSubscription) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: 6,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: 6,
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1976d2",
              fontFamily: "'Roboto', sans-serif",
              marginBottom: 2,
            }}
          >
            {plans[0].name}
          </Typography>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontWeight: 600,
              color: "#2e2e2e",
              marginBottom: 2,
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {plans[0].price}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: "1.1rem",
              marginBottom: 1,
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            {plans[0].description}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Stack spacing={1}>
            {plans[0].features.map((feature, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  color: "#444",
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                • {feature}
              </Typography>
            ))}
          </Stack>
          <Divider sx={{ marginY: 3 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              marginBottom: 1,
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Additional Benefits:
          </Typography>
          <Stack spacing={0.5}>
            {plans[0].additionalInfo.map((info, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  fontSize: "0.95rem",
                  color: "#666",
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                {info}
              </Typography>
            ))}
          </Stack>
          <LoadingButton
            variant="contained"
            disabled={hasSubscription}
            loading={loading[plans[0].name]}
            onClick={() => handleCheckout(plans[0].amount, plans[0].name)}
            sx={{
              marginTop: 4,
              backgroundColor: "#1976d2",
              color: "#fff",
              fontSize: "1.1rem",
              padding: "10px 20px",
              borderRadius: "30px",
              "&:hover": { backgroundColor: "#1565c0" },
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {loading[plans[0].name] ? "Processing..." : plans[0].buttonText}
          </LoadingButton>
        </CardContent>

        <Box
          sx={{
            flex: 1,
            backgroundImage: `url('https://www.apaservices.org/images/title-payment-platform_tcm9-282170_w1024_n.jpg')`, // Example image from Unsplash
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: { xs: "250px", md: "100%" },
          }}
        />
      </Card>
    </Box>
  );
};

export default PricingPlan;
