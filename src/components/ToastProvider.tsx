"use client";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  // Shows a message saved just before a full-page navigation (e.g. after sign in)
  useEffect(() => {
    try {
      const message = sessionStorage.getItem("flash");
      if (message) {
        sessionStorage.removeItem("flash");
        toast.success(message);
      }
    } catch {}
  }, []);

  return <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontFamily: "inherit", borderRadius: "12px" } }} />;
}
