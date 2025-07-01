"use client";

import { SetStateAction, createContext, useState } from "react";
import CreditsService from "../services/credits-service";

type Form1ContextType = {
  form1: {
    form1Step: number;
    setForm1Step: React.Dispatch<SetStateAction<number>>;
  };
};

export const AppContext = createContext<Form1ContextType>({
  form1: {
    form1Step: 0,
    setForm1Step: () => { },
  }
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [form1Step, setForm1Step] = useState(0);


  return (
    <AppContext.Provider value={{ form1: { form1Step, setForm1Step } }}>
      {children}
    </AppContext.Provider>
  );
}
