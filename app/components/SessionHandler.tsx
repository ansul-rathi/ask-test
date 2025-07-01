'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HippaContractService from "../services/hippa-contract";
import { useAuth } from "../contexts/AuthContext";

interface Session {
  user?: {
    email: string;
    name: string;
    stripeCustomerId?: string;
  };
}

interface SessionHandlerProps {
  locale: string;
}

export default function SessionHandler({ locale }: SessionHandlerProps) {
  const router = useRouter();
  const {isAuthenticated, user} = useAuth()
  let [hippaContract]: any = [null];

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (isAuthenticated) {
          const hippaContractData = HippaContractService.getHippaContract(user?.email ?? '');
          // console.log("hippaContractData:", hippaContractData);
          [hippaContract] = await Promise.all([hippaContractData]);
          console.log("hippaContractasdasfadefasf:", hippaContract);
          if (!hippaContract || !hippaContract?.hasData) {
            console.log("hippaContract:", hippaContract);
            router.push(`/${locale}/hippa-contract`);
          }
        } else {
          console.log("No session found");
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };

    fetchSession();
  }, [locale, router]);

  return null;
}
