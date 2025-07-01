// services/HippaContractService.ts

import CREDITS_ACTIONS from "../constants/credit-actions";

interface CreditsService {
  getUserCredits: (userId: string) => Promise<any>;
  deductCredits: (userId: string, data: { amount: number }) => Promise<any>;
  refreshCredits: (userId: string) => Promise<any>;
  cancelSubscription: (userId: string) => Promise<any>;
  handlePaymentFailed: (userId: string) => Promise<any>;
  addFreeTrial: (userId: string) => Promise<any>;
}

class CreditsService {
  
  static async getUserCredits(userId: string) {
    const encodedUserId = encodeURIComponent(userId);

    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        cache: "default",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async deductCredits(userId: string, data: { amount: number }) {
    const encodedUserId = encodeURIComponent(userId);

    try {
      const payload = {
        amount: data.amount,
        action: CREDITS_ACTIONS.DEDUCT_CREDITS,
      };
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error('Error in deductCredits:', err);
      throw err;
    }
  }

  static async refreshCredits(userId: string) {
    console.log('Attempting to refresh credits for user:', userId);
    const encodedUserId = encodeURIComponent(userId);
    try {
      const payload = {
        action: CREDITS_ACTIONS.REFRESH_CREDITS,
      };
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      
      console.log('Making request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Refresh credits result:', result);
      return result;
    } catch (err: any) {
      console.error('Error in refreshCredits:', err);
      throw err;
    }
  }

  static async cancelSubscription(userId: string) {
    const encodedUserId = encodeURIComponent(userId);
    try {
      const payload = {
        action: CREDITS_ACTIONS.CANCEL_SUBSCRIPTION,
      };
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async handlePaymentFailed(userId: string) {
    const encodedUserId = encodeURIComponent(userId);
    try {
      const payload = {
        action: CREDITS_ACTIONS.HANDLE_PAYMENT_FAILED,
      };
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async addFreeTrial(userId: string) {
    const encodedUserId = encodeURIComponent(userId);
    try {
      const payload = {
        action: CREDITS_ACTIONS.ADD_FREE_TRIAL,
      };
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/credits/${encodedUserId}`
          : `/api/credits/${encodedUserId}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      console.error('Error in addFreeTrial:', err);
      throw err;
    }
  }
}

export default CreditsService;
