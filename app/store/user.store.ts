import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import StripeService from "../services/stripe-handle";
import CreditsService from "../services/credits-service";

export type State = {
  subscriptions: any[] | null;
  isPlanLoading: boolean;
  isCreditsLoading: boolean;
  error: string | null;
  getSubscription: (stripeCustomerId: string) => Promise<any[]>;
  userDetails: any;
  lastFetched: number;
  reset: () => void;
  getUserDetails: (emailId: string) => Promise<any>;
  createSubscription: (email: string, name: string) => Promise<any>;
  // New credit management functions
  deductCredits: (userId: string, amount: number) => Promise<void>;
  refreshCredits: (userId: string) => Promise<void>;
  resetCredits: (userId: string) => Promise<void>;
  addCredits: (userId: string, amount: number) => Promise<void>;
};

const initialState: Omit<
  State,
  | "getSubscription"
  | "getUserDetails"
  | "createSubscription"
  | "deductCredits"
  | "refreshCredits"
  | "resetCredits"
  | "addCredits"
  | 'reset'
> = {
  subscriptions: null,
  userDetails: {},
  isPlanLoading: false,
  lastFetched: 0,
  isCreditsLoading: false,
  error: null,
};

const middlewares = (cb: StateCreator<State>) =>
  devtools(
    persist(cb, {
      name: "user-store",
    })
  );

export const useUserStore = create<State>()(
  middlewares((set, get) => ({
    ...initialState,

    reset: () => {
      set(initialState);
    },

    getUserDetails: async (emailId: string) => {
      try {
        set({ isCreditsLoading: true, error: null });
        const userDetails = await CreditsService.getUserCredits(emailId);
        const lastFetched = Date.now() 
        set({ userDetails, isCreditsLoading: false, lastFetched });
        return userDetails;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to get user details',
          isCreditsLoading: false 
        });
        throw error;
      }
    },

    getSubscription: async (stripeCustomerId: string) => {
      try {
        set({ isPlanLoading: true, error: null });
        const subscriptions = await StripeService.getCustomerSubscription(
          stripeCustomerId
        );
        console.log({Stripeeee: subscriptions})
        set({ subscriptions, isPlanLoading: false });
        return subscriptions;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to get subscription',
          isPlanLoading: false 
        });
        throw error;
      }
    },

    createSubscription: async (email: string, name: string) => {
      try {
        set({ error: null });
        const response = await StripeService.createStripeCustomer(email, name);
        const user = get().userDetails;
        set({ userDetails: { ...user, stripeCustomerId: response?.customer?.id } });
        return response.customer;
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to create subscription' });
        throw error;
      }
    },

    // New credit management functions
    deductCredits: async (userId: string, amount: number) => {
      try {
        set({ isCreditsLoading: true, error: null });
        await CreditsService.deductCredits(userId, {amount});
        // Refresh user details after deduction
        const userDetails = await CreditsService.getUserCredits(get().userDetails.email);
        set({ userDetails, isCreditsLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to deduct credits',
          isCreditsLoading: false 
        });
        throw error;
      }
    },

    refreshCredits: async (userId: string) => {
      try {
        set({ isCreditsLoading: true, error: null });
        const userDetails = await CreditsService.getUserCredits(get().userDetails.email);
        set({ userDetails, isCreditsLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to refresh credits',
          isCreditsLoading: false 
        });
        throw error;
      }
    },

    resetCredits: async (userId: string) => {
      try {
        set({ isCreditsLoading: true, error: null });
        await CreditsService.refreshCredits(userId);
        // await CreditsService.refreshCredits("asknew1@yopmail.com");
        // Refresh user details after reset
        const userDetails = await CreditsService.getUserCredits(userId);
        // const userDetails = await CreditsService.getUserCredits("asknew1@yopmail.com");
        set({ userDetails, isCreditsLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to reset credits',
          isCreditsLoading: false 
        });
        throw error;
      }
    },

    addCredits: async (userId: string, amount: number) => {
      try {
        set({ isCreditsLoading: true, error: null });
        // await CreditsService.addCredits(userId, amount);
        // Refresh user details after adding credits
        const userDetails = await CreditsService.getUserCredits(get().userDetails.email);
        set({ userDetails, isCreditsLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to add credits',
          isCreditsLoading: false 
        });
        throw error;
      }
    },
    
  }))
);

// import { create, StateCreator } from "zustand";
// import { devtools, persist } from "zustand/middleware";
// import StripeService from "../services/stripe-handle";
// import CreditsService from "../services/credits-service";

// export type State = {
//   subscriptions: any[] | null;
//   isPlanLoading: boolean
//   getSubscription: (stripeCustomerId: string) => Promise<any[]>;
//   userDetails: any;
//   getUserDetails: (emailId: string) => Promise<any>;
//   createSubscription: (email: string, name: string) => Promise<any>;
// };

// const initialState: Omit<State, "getSubscription" | "getUserDetails" | "createSubscription"> = {
//   subscriptions: null,
//   userDetails: {},
//   isPlanLoading: false,
// };

// const middlewares = (cb: StateCreator<State>) =>
//   devtools(
//     persist(cb, {
//       name: "user-store",
//     })
//   );

// export const useUserStore = create<State>()(
//   middlewares((set, get) => ({
//     ...initialState,

//     getUserDetails: async (emailId: string) => {
//       const userDetails = await CreditsService.getUserCredits(emailId);
//       set({ userDetails });
//       return userDetails;
//     },
//     getSubscription: async (stripeCustomerId: string) => {
//         set({ isPlanLoading: true });
//       const subscriptions = await StripeService.getCustomerSubscription(
//         stripeCustomerId
//       );
//       set({ subscriptions, isPlanLoading: false });
//       return subscriptions;
//     },
//     createSubscription: async (email: string, name: string) => {
//       const response = await StripeService.createStripeCustomer(email, name);
//       const user = get().userDetails;
//       set({ userDetails: { ...user, stripeCustomerId: response?.customer?.id } });
//       return response.customer;
//     },
//   }))
// );

