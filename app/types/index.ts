// types/index.ts
export interface Form1 {
    id: string;
    senderEmail: string;
    receiverEmail: string;
    consent: boolean;
    images: boolean;
    createdAt?: string;
    password?: string;
    message?: string;
    response?: any;
  }
  
  export interface HippaContract {
    userId: string;
    name: string;
    facilityEmail: string;
    city: string;
    country: string;
    facilityName: string;
    acceptHippa: boolean;
  }
  