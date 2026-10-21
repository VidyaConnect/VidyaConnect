"use client";

import { useContext } from "react";
import { RegistrationContext } from "../context/registrationContext";

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used inside a RegistrationProvider");
  }
  return context;
}