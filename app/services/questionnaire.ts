import CreditsService from "./credits-service";

class QuestionnaireService {
  static async sendQuestionnaire(data: any, userId: string) {
    try {
      try {
        const userCredits = await CreditsService.getUserCredits(userId);
        if (userCredits.credits <= 0) {
          throw new Error(
            "Insufficient credits"
          );
        }
      } catch (error: any) {
        if (error.message.includes("HTTP error! status: 400")) {
          throw new Error("Insufficient credits");
        }
        throw error;
      }
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/questionnaire/send`
          : `/api/questionnaire/send`;
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

  static async getQuestionnaire(formId: string) {
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/questionnaire/?id=${formId}`
          : `/api/questionnaire/?id=${formId}`;
      console.log({ apiUrl });
      const response = await fetch(apiUrl, { cache: "force-cache" }).then(
        (res) => res.json()
      );
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async generateReport(data: any, formId: string) {
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/questionnaire/generate-report/?id=${formId}`
          : `/api/questionnaire/generate-report?id=${formId}`;
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

  static async markAsSubmitted(formId: string) {
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/questionnaire/?id=${formId}`
          : `/api/questionnaire/?id=${formId}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submitted: true }),
      }).then((res) => res.json());
      return response;
    } catch (err: any) {
      throw err;
    }
  }

  static async deleteQuestionnaire(formId: string) {
    try {
      const apiUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/questionnaire/?id=${formId}`
          : `/api/questionnaire/?id=${formId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
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

export default QuestionnaireService;
