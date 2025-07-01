/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import HeaderContainerWrapper from "./HeaderContainerWrapper";
import AppLogo from "./AppLogo";
import LanguageSelect from "./LanguageSelect";
import AppHeaderMenu from "./AppHeaderMenu";
import {
  Chip, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography } from "@mui/material";
import { useUserStore } from "@/app/store/user.store";
import { loadStripe } from "@stripe/stripe-js";
import StripeService from "@/app/services/stripe-handle";
import { useAuth } from "@/app/contexts/AuthContext";
import AddCardIcon from '@mui/icons-material/AddCard';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

const REFRESH_LIMIT = 3 * 60 * 1000;

// Initialize Stripe outside component to prevent re-initialization
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function AppHeader({ locale }: { locale: string }) {
  const { user, isAuthenticated} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, getUserDetails, lastFetched } = useUserStore();
  const [openDialog, setOpenDialog] = useState(false);
  const credits = userDetails?.credits || 0;

  // Simplified email extraction
  const userEmail = user?.email || "";
  console.log("email check : ",userEmail)
  const shouldRefetch = (lastFetched: number) => {
    const currentTime = Date.now();
    return currentTime - lastFetched > REFRESH_LIMIT;
  };

  // Fetch user details only when authentication status changes or when email becomes available
  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) return;

      if (!userDetails || shouldRefetch(lastFetched)) {
        setIsLoading(true);
        try {
          await getUserDetails(userEmail);
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated, userEmail, getUserDetails]);

  const handleOpenPurchaseOptions = () => {
    if (credits === 0) {
      setOpenDialog(true);
    }
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // Buy credits handler
  const handleBuyCredits = async (rechargeType: 'SUBSCRIBE' | 'TOPUP') => {
    if (credits > 0) return;
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const domain = window?.location?.origin;

      const response = await StripeService.createCheckoutSession(
        userDetails?.stripeCustomerId || "",
        locale,
        domain,
        userDetails?.email || "",
        rechargeType
      );

      const { session: sess } = response || {};

      if (sess?.id) {
        const result = await stripe?.redirectToCheckout({
          sessionId: sess.id,
        });

        if (result?.error) {
          console.error(result.error.message);
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = () => {
    handleBuyCredits('SUBSCRIBE');
  };

  // Handler for Topup option
  const handleTopup = () => {
    handleBuyCredits('TOPUP');
  };

  return (
    <HeaderContainerWrapper>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          px: 0,
        }}
      >
        <AppLogo />
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            ml: { xs: "0px", md: "auto" },
          }}
        />
      </Box>

      {/* Credits Display */}
      {isAuthenticated && (
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          {isLoading ? (
            <CircularProgress size={20} color="primary" />
          ) : (
            <Chip
              label={
                credits === 0
                  ? "0 Credits - Buy Credits Now"
                  : `${credits} Credits`
              }
              variant="outlined"
              onClick={handleOpenPurchaseOptions}
              clickable={credits === 0}
              sx={{
                borderRadius: "16px",
                height: 32
              }}
            />
          )}
        </Box>
      )}

      <AppHeaderMenu isLoading={isLoading} />

      <Box sx={{ mx: 2 }}>
        <LanguageSelect locale={locale} />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Choose Payment Option
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={handleSubscribe} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', mb: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}>
              <ListItemIcon>
                <SubscriptionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Subscribe" 
                secondary="Monthly plan with recurring payments" 
              />
            </ListItem>
            
            <ListItem button onClick={handleTopup} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }}>
              <ListItemIcon>
                <AddCardIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Top Up" 
                secondary="One-time payment to add credits" 
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </HeaderContainerWrapper>
  );
}

export default AppHeader;