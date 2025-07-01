// types/mailgun.js.d.ts
declare module 'mailgun.js' {
    import FormData from 'form-data';
  
    interface MailgunOptions {
      username: string;
      key: string;
      url?: string;
    }
  
    interface Messages {
      create(domain: string, data: Record<string, any>): Promise<any>;
    }
  
    export default class Mailgun {
      constructor(formData: typeof FormData);
      client(options: MailgunOptions): { messages: Messages };
    }
  }
  