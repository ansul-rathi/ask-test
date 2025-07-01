// services/HippaContractService.ts

// interface HippaContractData {
//   email: string;
//   name: string;
//   facilityEmail: string;
//   city: string;
//   country: string;
//   facilityName: string;
//   acceptHippa: boolean;
// }

class HippaContractService {
  // Function to get the Hippa Contract
  static async getHippaContract(email: string) {
          const encodedEmail = encodeURIComponent(email);
console.log("encodedEmail:", encodedEmail);
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/hippa-contract/${encodedEmail}`
          : `/api/hippa-contract/${encodedEmail}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        cache: 'default',
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async saveHippaContract(data: any) {
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/hippa-contract`
          : `/api/hippa-contract`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}

export default HippaContractService;
