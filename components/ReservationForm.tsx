"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import type { Translation } from "@/lib/translations";

const PRICE_PER_PERSON = 20;

type ReservationContextType = {
  people: number;
  meatCount: number;
  vegetarianCount: number;
  total: number;
  menusComplete: boolean;

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

  isLoading: boolean;
};

const ReservationContext =
  createContext<ReservationContextType | null>(
    null
  );

function useReservation() {
  const context = useContext(
    ReservationContext
  );

  if (!context) {
    throw new Error(
      "Reservation components must be used inside ReservationProvider"
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

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const total = useMemo(
    () => people * PRICE_PER_PERSON,
    [people]
  );

  const selectedMenus =
    meatCount + vegetarianCount;

  const menusComplete =
    selectedMenus === people;

  const decreasePeople = () => {
    if (people <= 1) return;

    const newPeople = people - 1;

    setPeople(newPeople);

    if (selectedMenus > newPeople) {
      if (vegetarianCount > 0) {
        setVegetarianCount(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        );
      } else if (meatCount > 0) {
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
      (current) => current + 1
    );
  };

  const increaseMeat = () => {
    if (
      selectedMenus >= people
    ) {
      return;
    }

    setMeatCount(
      (current) => current + 1
    );
  };

  const decreaseMeat = () => {
    setMeatCount(
      (current) =>
        Math.max(0, current - 1)
    );
  };

  const increaseVegetarian =
    () => {
      if (
        selectedMenus >= people
      ) {
        return;
      }

      setVegetarianCount(
        (current) => current + 1
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
      people - selectedMenus;

    return `${t.missingMenu} ${missing} ${
      missing === 1
        ? t.menu
        : t.menus
    }`;
  };

  const handleReservation =
    async (t: Translation) => {
      if (
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !menusComplete ||
        isLoading
      ) {
        return;
      }

      setIsLoading(true);

      try {
        const { error } =
          await supabase
            .from("reservations")
            .insert({
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),

              people,

              meat_count:
                meatCount,

              vegetarian_count:
                vegetarianCount,

              total,

              payment_status:
                "pending",
            });

        if (error) {
          throw error;
        }

        alert(
          t.reservationSuccess
        );

        setName("");
        setEmail("");
        setPhone("");
      } catch (error) {
        console.error(
          "Error creando reserva:",
          error
        );

        alert(
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

        isLoading,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

/* ==================================
   SELECTOR DEL HERO
================================== */

export function ReservationSelector({
  t,
}: {
  t: Translation;
}) {
  const {
    people,
    meatCount,
    vegetarianCount,
    total,
    menusComplete,

    decreasePeople,
    increasePeople,

    decreaseMeat,
    increaseMeat,

    decreaseVegetarian,
    increaseVegetarian,

    getMenuMessage,
  } = useReservation();

  return (
    <div className="rounded-2xl border border-white/15 bg-black/55 p-7 shadow-2xl backdrop-blur-md">
      <h2 className="text-center font-serif text-3xl font-bold uppercase">
        {t.bookingTitle}
      </h2>

      <p className="mt-3 text-center text-xl text-[#f2cf88]">
        {t.pricePerPerson}
      </p>

      <div className="mt-8">
        <p className="mb-3 text-white/70">
          {t.people}
        </p>

        <Counter
          value={people}
          onDecrease={
            decreasePeople
          }
          onIncrease={
            increasePeople
          }
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-white/70">
          {t.foodOption}
        </p>

        <div className="space-y-3">
          <MenuCounter
            label={`🥩 ${t.meat}`}
            value={meatCount}
            onDecrease={
              decreaseMeat
            }
            onIncrease={
              increaseMeat
            }
          />

          <MenuCounter
            label={`🌿 ${t.vegetarian}`}
            value={
              vegetarianCount
            }
            onDecrease={
              decreaseVegetarian
            }
            onIncrease={
              increaseVegetarian
            }
          />

          <p
            className={`text-sm ${
              menusComplete
                ? "text-green-400"
                : "text-[#f2cf88]"
            }`}
          >
            {getMenuMessage(t)}
          </p>
        </div>
      </div>

      <div className="my-7 flex items-center justify-between border-t border-white/15 pt-6">
        <div>
          <p className="text-sm text-white/50">
            {people} × €
            {PRICE_PER_PERSON}
          </p>

          <span className="text-xl">
            {t.total}
          </span>
        </div>

        <span className="text-3xl font-bold">
          €{total},00
        </span>
      </div>

      <button
        type="button"
        onClick={() =>
          document
            .getElementById(
              "booking"
            )
            ?.scrollIntoView({
              behavior: "smooth",
            })
        }
        disabled={!menusComplete}
        className="w-full rounded-xl bg-[#ddb566] py-4 text-lg font-bold text-black transition hover:bg-[#eccb8c] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.reserve}
      </button>
    </div>
  );
}

/* ==================================
   FORMULARIO INFERIOR
================================== */

export default function ReservationForm({
  t,
}: {
  t: Translation;
}) {
  const {
    people,
    meatCount,
    vegetarianCount,
    total,
    menusComplete,

    name,
    email,
    phone,

    setName,
    setEmail,
    setPhone,

    getMenuMessage,
    handleReservation,

    isLoading,
  } = useReservation();

  return (
    <section
      id="booking"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid overflow-hidden rounded-3xl border border-neutral-200 shadow-xl lg:grid-cols-2">

          <div className="p-8 md:p-12">
            <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-[#284c73]">
              1. {t.yourData}
            </p>

            <div className="space-y-5">
              <Field
                label={t.fullName}
                value={name}
                onChange={setName}
                placeholder="Ana García"
              />

              <Field
                label={t.email}
                value={email}
                onChange={setEmail}
                placeholder="ana@email.com"
                type="email"
              />

              <Field
                label={t.phone}
                value={phone}
                onChange={setPhone}
                placeholder="06 12345678"
                type="tel"
              />
            </div>
          </div>

          <div className="bg-[#171717] p-8 text-white md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ddb566]">
              2. {t.reserve}
            </p>

            <div className="mt-8 space-y-5">
              <SummaryRow
                label={t.people}
                value={String(
                  people
                )}
              />

              <SummaryRow
                label={`🥩 ${t.meat}`}
                value={String(
                  meatCount
                )}
              />

              <SummaryRow
                label={`🌿 ${t.vegetarian}`}
                value={String(
                  vegetarianCount
                )}
              />

              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-between">
                  <span className="text-xl">
                    {t.total}
                  </span>

                  <span className="text-3xl font-bold">
                    €{total},00
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/50">
                  {people} × €
                  {PRICE_PER_PERSON}
                </p>
              </div>

              {!menusComplete && (
                <p className="rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-300">
                  ⚠️{" "}
                  {getMenuMessage(
                    t
                  )}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  handleReservation(
                    t
                  )
                }
                disabled={
                  !name.trim() ||
                  !email.trim() ||
                  !phone.trim() ||
                  !menusComplete ||
                  isLoading
                }
                className="mt-4 w-full rounded-xl bg-[#ddb566] py-4 font-bold text-black transition hover:bg-[#eccb8c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading
                  ? t.processing
                  : t.continueReservation}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================
   COMPONENTES INTERNOS
================================== */

function Counter({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/15 p-4">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-2xl transition hover:bg-white/20"
      >
        −
      </button>

      <span className="text-2xl font-semibold">
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-2xl transition hover:bg-white/20"
      >
        +
      </button>
    </div>
  );
}

function MenuCounter({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/15 p-4">
      <span className="text-lg">
        {label}
      </span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xl transition hover:bg-white/20"
        >
          −
        </button>

        <span className="min-w-6 text-center text-xl font-semibold">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xl transition hover:bg-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-[#284c73]"
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-6">
      <span className="text-white/60">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}