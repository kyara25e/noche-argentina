"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import type { Translation } from "@/lib/translations";

const PRICE_PER_PERSON = 20;
const MAX_PEOPLE = 8;

type CreatedReservation = {
  id: string;
  editToken: string;

  name: string;
  email: string;
  phone: string;

  people: number;
  meatCount: number;
  vegetarianCount: number;
  total: number;
};

type ReservationContextType = {
  people: number;
  meatCount: number;
  vegetarianCount: number;
  total: number;

  menusComplete: boolean;
  reservationCreated: boolean;
  isEditing: boolean;

  createdReservation: CreatedReservation | null;

  name: string;
  email: string;
  phone: string;

  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;

  decreasePeople: () => void;
  increasePeople: () => void;

  decreaseMeat: () => void;
  increaseMeat: () => void;

  decreaseVegetarian: () => void;
  increaseVegetarian: () => void;

  getMenuMessage: (
    t: Translation
  ) => string;

  handleReservation: (
    t: Translation
  ) => Promise<void>;

  editReservation: () => void;

  isLoading: boolean;
};

const ReservationContext =
  createContext<ReservationContextType | null>(
    null
  );

export function useReservation() {
  const context =
    useContext(ReservationContext);

  if (!context) {
    throw new Error(
      "useReservation must be used inside ReservationProvider"
    );
  }

  return context;
}

export function ReservationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [people, setPeople] =
    useState(1);

  const [meatCount, setMeatCount] =
    useState(1);

  const [
    vegetarianCount,
    setVegetarianCount,
  ] = useState(0);

  const [
    reservationCreated,
    setReservationCreated,
  ] = useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [
    createdReservation,
    setCreatedReservation,
  ] =
    useState<CreatedReservation | null>(
      null
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const total = useMemo(
    () =>
      people *
      PRICE_PER_PERSON,
    [people]
  );

  const selectedMenus =
    meatCount +
    vegetarianCount;

  const menusComplete =
    selectedMenus === people;

  /*
   * Recuperar reserva guardada
   * después de un refresh.
   */
  useEffect(() => {
    const saved =
      localStorage.getItem(
        "nocheArgentinaReservation"
      );

    if (!saved) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          saved
        ) as CreatedReservation;

      setCreatedReservation(
        parsed
      );

      setName(
        parsed.name
      );

      setEmail(
        parsed.email
      );

      setPhone(
        parsed.phone
      );

      setPeople(
        parsed.people
      );

      setMeatCount(
        parsed.meatCount
      );

      setVegetarianCount(
        parsed.vegetarianCount
      );

      setReservationCreated(
        true
      );
    } catch {
      localStorage.removeItem(
        "nocheArgentinaReservation"
      );
    }
  }, []);

  const decreasePeople = () => {
    if (people <= 1) {
      return;
    }

    const newPeople =
      people - 1;

    setPeople(newPeople);

    if (
      selectedMenus >
      newPeople
    ) {
      if (
        vegetarianCount >
        0
      ) {
        setVegetarianCount(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        );
      } else if (
        meatCount > 0
      ) {
        setMeatCount(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        );
      }
    }
  };

  const increasePeople = () => {
    setPeople(
      (current) => {
        if (
          current >=
          MAX_PEOPLE
        ) {
          return current;
        }

        return current + 1;
      }
    );
  };

  const increaseMeat = () => {
    if (
      selectedMenus >=
      people
    ) {
      return;
    }

    setMeatCount(
      (current) =>
        current + 1
    );
  };

  const decreaseMeat = () => {
    setMeatCount(
      (current) =>
        Math.max(
          0,
          current - 1
        )
    );
  };

  const increaseVegetarian =
    () => {
      if (
        selectedMenus >=
        people
      ) {
        return;
      }

      setVegetarianCount(
        (current) =>
          current + 1
      );
    };

  const decreaseVegetarian =
    () => {
      setVegetarianCount(
        (current) =>
          Math.max(
            0,
            current - 1
          )
      );
    };

  const getMenuMessage = (
    t: Translation
  ) => {
    if (menusComplete) {
      return `✓ ${selectedMenus} de ${people} ${t.menus} ${t.selected}`;
    }

    const missing =
      people -
      selectedMenus;

    return `${t.missingMenu} ${missing} ${
      missing === 1
        ? t.menu
        : t.menus
    }`;
  };

  /*
   * Volver al formulario
   * para modificar la misma reserva.
   */
  const editReservation = () => {
    if (
      !createdReservation
    ) {
      return;
    }

    setName(
      createdReservation.name
    );

    setEmail(
      createdReservation.email
    );

    setPhone(
      createdReservation.phone
    );

    setPeople(
      createdReservation.people
    );

    setMeatCount(
      createdReservation.meatCount
    );

    setVegetarianCount(
      createdReservation.vegetarianCount
    );

    setIsEditing(true);

    setReservationCreated(
      false
    );

    setTimeout(() => {
      document
        .getElementById(
          "booking"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",
        });
    }, 50);
  };

  const handleReservation =
    async (
      t: Translation
    ) => {
      const selectedMenus =
        meatCount +
        vegetarianCount;

      if (
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        selectedMenus !==
          people ||
        isLoading
      ) {
        return;
      }

      setIsLoading(true);

      try {
        /*
         * ==========================
         * MODIFICAR RESERVA
         * ==========================
         */
        if (
          isEditing &&
          createdReservation
        ) {
          if (
            !createdReservation.editToken
          ) {
            throw new Error(
              "Esta reserva fue creada antes de habilitar la edición. Creá una nueva reserva para probar esta función."
            );
          }

          const response =
            await fetch(
              "/api/reservations/update",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  id:
                    createdReservation.id,

                  editToken:
                    createdReservation.editToken,

                  name:
                    name.trim(),

                  email:
                    email.trim(),

                  phone:
                    phone.trim(),

                  people,

                  meatCount,

                  vegetarianCount,
                }),
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result?.error ||
                "No se pudo modificar la reserva."
            );
          }

          const updated: CreatedReservation =
            {
              ...createdReservation,

              name:
                name.trim(),

              email:
                email.trim(),

              phone:
                phone.trim(),

              people,

              meatCount,

              vegetarianCount,

              total,
            };

          setCreatedReservation(
            updated
          );

          localStorage.setItem(
            "nocheArgentinaReservation",
            JSON.stringify(
              updated
            )
          );

          setIsEditing(
            false
          );

          setReservationCreated(
            true
          );

          return;
        }

        /*
         * ==========================
         * NUEVA RESERVA
         * ==========================
         */

       const editToken =
  crypto.randomUUID();

const response =
  await fetch(
    "/api/reservations/create",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        name:
          name.trim(),

        email:
          email.trim(),

        phone:
          phone.trim(),

        people,

        meatCount,

        vegetarianCount,

        editToken,
      }),
    }
  );

const result =
  await response.json();

if (!response.ok) {
  throw new Error(
    result?.error ||
      "No se pudo crear la reserva."
  );
}

const data = {
  id: result.id,
};

        const created: CreatedReservation =
          {
            id:
              data.id,

            editToken,

            name:
              name.trim(),

            email:
              email.trim(),

            phone:
              phone.trim(),

            people,

            meatCount,

            vegetarianCount,

            total,
          };

        setCreatedReservation(
          created
        );

        localStorage.setItem(
          "nocheArgentinaReservation",
          JSON.stringify(
            created
          )
        );

        setIsEditing(
          false
        );

        setReservationCreated(
          true
        );
      } catch (error: any) {
        console.error(
          "Error completo:",
          error
        );

        alert(
          error?.message ||
            t.reservationError
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <ReservationContext.Provider
      value={{
        people,
        meatCount,
        vegetarianCount,
        total,

        menusComplete,
        reservationCreated,
        isEditing,

        createdReservation,

        name,
        email,
        phone,

        setName,
        setEmail,
        setPhone,

        decreasePeople,
        increasePeople,

        decreaseMeat,
        increaseMeat,

        decreaseVegetarian,
        increaseVegetarian,

        getMenuMessage,
        handleReservation,

        editReservation,

        isLoading,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export {
  PRICE_PER_PERSON,
  MAX_PEOPLE,
};