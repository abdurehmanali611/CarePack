/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type SelectionContextType = {
  selectedSpecialities: Record<string, string>;
  setSelectedSpeciality: (rowId: string, speciality: string) => void;
  selectedDoctors: Record<string, string>;
  setSelectedDoctor: (rowId: string, doctor: string) => void;
  availableDoctors: Record<string, any[]>;
  setAvailableDoctors: (rowId: string, doctors: any[]) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedSpecialities, setSelectedSpecialities] = useState<
    Record<string, string>
  >({});
  const [selectedDoctors, setSelectedDoctors] = useState<
    Record<string, string>
  >({});
  const [availableDoctors, setAvailableDoctorsState] = useState<
    Record<string, any[]>
  >({});

  const setSelectedSpeciality = (rowId: string, speciality: string) => {
    setSelectedSpecialities((prev) => ({ ...prev, [rowId]: speciality }));
    setSelectedDoctors((prev) => ({ ...prev, [rowId]: "" }));
  };

  const setSelectedDoctor = (rowId: string, doctor: string) => {
    setSelectedDoctors((prev) => ({ ...prev, [rowId]: doctor }));
  };

  const setAvailableDoctors = (rowId: string, doctors: any[]) => {
    setAvailableDoctorsState((prev) => ({ ...prev, [rowId]: doctors }));
  };

  const contextValue = useMemo(
    () => ({
      selectedSpecialities,
      setSelectedSpeciality,
      selectedDoctors,
      setSelectedDoctor,
      availableDoctors,
      setAvailableDoctors,
    }),
    [selectedSpecialities, selectedDoctors, availableDoctors]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}