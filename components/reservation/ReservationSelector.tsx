"use client";

import type { Translation } from "@/lib/translations";

import {
  PRICE_PER_PERSON,
  useReservation,
} from "@/components/reservation/ReservationProvider";

export default function ReservationSelector({
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
          onDecrease={decreasePeople}
          onIncrease={increasePeople}
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
            onDecrease={decreaseMeat}
            onIncrease={increaseMeat}
          />

          <MenuCounter
            label={`🌿 ${t.vegetarian}`}
            value={vegetarianCount}
            onDecrease={decreaseVegetarian}
            onIncrease={increaseVegetarian}
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
            {people} × €{PRICE_PER_PERSON}
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
            .getElementById("booking")
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