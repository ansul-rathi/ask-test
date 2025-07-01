import React, { useEffect } from "react";

function useLocalStorage(
  key: string,
  initialValue?: string,
) {
  if (!key) {
    throw new Error("key is required");
  }

  const setState = (newValue: any) => {
    window.localStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  };

  const getSnapshot = () => {
    const value = localStorage.getItem(key) as any;
    if (value === "NaN" || value === undefined) {
        setState(initialValue)
        return initialValue
    }
    return value;
  };

  const subscribe = (listener: () => void) => {
    window.addEventListener("storage", listener);
    return () => void window.removeEventListener("storage", listener);
  };

  const store = React.useSyncExternalStore(subscribe, getSnapshot);
// Initialize localStorage with initialValue if not already set
useEffect(() => {
    if (!localStorage.getItem(key) && initialValue !== undefined) {
      setState(initialValue);
    }
  }, [key, initialValue]);
  return [store, setState] as const;
}

export default useLocalStorage;
