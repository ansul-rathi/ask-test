class StripeService {
  static async createStripeCustomer(email: string, name: string) {
    try {
      //  const response = await signUp(data.name, data.email, data.password);
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe-customer`
          : `/api/stripe-customer`;
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({ email, name }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async getCustomerSubscription(customerId: string) {
    try {
      //  const response = await signUp(data.name, data.email, data.password);
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe-customer/${customerId}`
          : `/api/stripe-customer/${customerId}`;
          console.log({apiUrl})
      const response = await fetch(apiUrl, {
        method: "GET",
        cache: 'default',
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      return response?.subscriptions || null;
    } catch (err: any) {
      throw err;
    }
  }

  static async createCheckoutSession(customerId: string, locale: string, domain: string, emailId: string, rechargeType: string) {
    console.log("rechargeType : ",rechargeType)

    try {
      //  const response = await signUp(data.name, data.email, data.password);
      const apiSubscribeUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe-checkout`
          : `/api/stripe-checkout`;

        const apiTopupUrl =
          typeof window === "undefined"
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe-checkout-topup`
            : `/api/stripe-checkout-topup`;

      const response = await fetch(rechargeType==="TOPUP" ? apiTopupUrl : apiSubscribeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, locale, domain, emailId }),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async getPlans() {
    try {
      //  const response = await signUp(data.name, data.email, data.password);
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe-plans`
          : `/api/stripe-plans`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}

export default StripeService;
