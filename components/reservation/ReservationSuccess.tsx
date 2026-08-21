"use client";

import type { Translation } from "@/lib/translations";
import { getTikkieLink } from "@/lib/tikkie";

import { useReservation } from "@/components/reservation/ReservationProvider";

export default function ReservationSuccess({
  t,
}: {
  t: Translation;
}) {
  const {
  people,
  meatCount,
  vegetarianCount,
  total,
  createdReservation,
  editReservation,
} = useReservation();

  const confirmedPeople =
    createdReservation?.people ?? people;

  const confirmedMeat =
    createdReservation?.meatCount ?? meatCount;

  const confirmedVegetarian =
    createdReservation?.vegetarianCount ??
    vegetarianCount;

  const confirmedTotal =
    createdReservation?.total ?? total;

  const selectedMenus =
    confirmedMeat + confirmedVegetarian;

  const menusComplete =
    selectedMenus === confirmedPeople;

  const missingMenus =
    confirmedPeople - selectedMenus;

  const tikkieLink =
    getTikkieLink(confirmedPeople);

  return (
    <section
      id="booking"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-neutral-200 bg-[#171717] p-8 text-white shadow-xl md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ddb566]">
            {t.reservationCreatedTitle}
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold">
            {t.reservationAlmostReady}
          </h2>

          <div className="mt-8 space-y-4">
            <SummaryRow
              label={t.people}
              value={String(
                confirmedPeople
              )}
            />

            <SummaryRow
              label={`🥩 ${t.meat}`}
              value={String(
                confirmedMeat
              )}
            />

            <SummaryRow
              label={`🌿 ${t.vegetarian}`}
              value={String(
                confirmedVegetarian
              )}
            />

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-xl">
                  {t.total}
                </span>

                <span className="text-3xl font-bold">
                  €{confirmedTotal},00
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm leading-6 text-white/70">
            {t.reservationRegistered}
          </p>

          {!menusComplete && (
            <p className="mt-6 rounded-xl bg-yellow-500/10 p-4 text-sm text-yellow-300">
              ⚠️ {t.selectDishesTotal}{" "}
              {confirmedPeople}{" "}
              {t.dishesInTotal}{" "}
              {t.currentlySelected}{" "}
              {selectedMenus}.{" "}
              {t.stillMissing}{" "}
              {missingMenus}.
            </p>
          )}

          <button
            type="button"
            disabled={
              !menusComplete ||
              !tikkieLink
            }
            onClick={() => {
              if (!tikkieLink) {
                return;
              }

              window.open(
                tikkieLink,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="mt-6 block w-full rounded-xl bg-[#ddb566] py-4 text-center text-lg font-bold text-black transition hover:bg-[#eccb8c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.payWithTikkie} €
            {confirmedTotal}{" "}
            {t.withTikkie}
          </button>

          <button
          type="button"
          onClick={editReservation}
          className="mt-3 block w-full rounded-xl border border-white/20 py-3 text-center font-medium text-white transition hover:bg-white/10"
          >
          {t.editReservation}
          </button>

          <p className="mt-4 text-center text-xs text-white/50">
            {t.paymentPending}
          </p>
        </div>
      </div>
    </section>
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