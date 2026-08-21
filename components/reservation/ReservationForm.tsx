"use client";

import type { Translation } from "@/lib/translations";

import {
  PRICE_PER_PERSON,
  useReservation,
} from "@/components/reservation/ReservationProvider";

import ReservationSuccess from "@/components/reservation/ReservationSuccess";

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
    reservationCreated,

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

  if (reservationCreated) {
    return <ReservationSuccess t={t} />;
  }

  return (
    <section
      id="booking"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid overflow-hidden rounded-3xl border border-neutral-200 shadow-xl lg:grid-cols-2">
          {/* DATOS PERSONALES */}
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

          {/* RESUMEN DE LA RESERVA */}
          <div className="bg-[#171717] p-8 text-white md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ddb566]">
              2. {t.reserve}
            </p>

            <div className="mt-8 space-y-5">
              <SummaryRow
                label={t.people}
                value={String(people)}
              />

              <SummaryRow
                label={`🥩 ${t.meat}`}
                value={String(meatCount)}
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
                  {getMenuMessage(t)}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  handleReservation(t)
                }
                disabled={
                  !name.trim() ||
                  !email.trim() ||
                  !phone.trim() ||
                  meatCount +
                    vegetarianCount !==
                    people ||
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
        onChange={(event) =>
          onChange(
            event.target.value
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