"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  adminTranslations,
  type AdminLanguage,
} from "@/lib/adminTranslations";

type Reservation = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  meat_count: number;
  vegetarian_count: number;
  total: number;
  payment_status: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<AdminLanguage>("es");

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const t = adminTranslations[language];

  useEffect(() => {
    checkUserAndLoadReservations();
  }, []);

  const checkUserAndLoadReservations =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      const { data, error } =
        await supabase
          .from("reservations")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(
          "Error cargando reservas:",
          error
        );

        setLoading(false);

        return;
      }

      setReservations(data ?? []);
      setLoading(false);
    };

  const totalPeople = useMemo(
    () =>
      reservations.reduce(
        (total, reservation) =>
          total +
          reservation.people,
        0
      ),
    [reservations]
  );

  const totalMeat = useMemo(
    () =>
      reservations.reduce(
        (total, reservation) =>
          total +
          reservation.meat_count,
        0
      ),
    [reservations]
  );

  const totalVegetarian =
    useMemo(
      () =>
        reservations.reduce(
          (
            total,
            reservation
          ) =>
            total +
            reservation.vegetarian_count,
          0
        ),
      [reservations]
    );

  const totalPending = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.payment_status ===
            "pending"
        )
        .reduce(
          (
            total,
            reservation
          ) =>
            total +
            reservation.total,
          0
        ),
    [reservations]
  );

  const totalPaid = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.payment_status ===
            "paid"
        )
        .reduce(
          (
            total,
            reservation
          ) =>
            total +
            reservation.total,
          0
        ),
    [reservations]
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.replace(
      "/admin/login"
    );
  };

  const markAsPaid = async (id: string) => {
  const { error } = await supabase
    .from("reservations")
    .update({
      payment_status: "paid",
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando pago:", error);
    return;
  }

  setReservations((current) =>
    current.map((reservation) =>
      reservation.id === id
        ? {
            ...reservation,
            payment_status: "paid",
          }
        : reservation
    )
  );
};

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f0e8]">
        <p className="text-lg">
          {t.loading}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0e8] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#284c73]">
              Noche Argentina
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold">
              {t.title}
            </h1>

            <p className="mt-2 text-neutral-500">
              {t.date}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target
                    .value as AdminLanguage
                )
              }
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3"
            >
              <option value="es">
                🇪🇸 ES
              </option>

              <option value="en">
                🇬🇧 EN
              </option>
            </select>

            <button
              onClick={
                handleLogout
              }
              className="rounded-xl border border-neutral-300 bg-white px-5 py-3 font-medium transition hover:bg-neutral-100"
            >
              {t.logout}
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title={
              t.reservations
            }
            value={
              reservations.length
            }
          />

          <StatCard
            title={t.people}
            value={totalPeople}
          />

          <StatCard
            title={`🥩 ${t.meat}`}
            value={totalMeat}
          />

          <StatCard
            title={`🌿 ${t.vegetarian}`}
            value={
              totalVegetarian
            }
          />

          <StatCard
            title={`💰 ${t.paid}`}
            value={`€${totalPaid}`}
          />

          <StatCard
            title={`⏳ ${t.pending}`}
            value={`€${totalPending}`}
          />
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 p-6">
            <h2 className="font-serif text-2xl font-bold">
              {t.reservations}
            </h2>
          </div>

          {reservations.length ===
          0 ? (
            <div className="p-10 text-center text-neutral-500">
              {
                t.noReservations
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-neutral-50 text-sm text-neutral-500">
                  <tr>
                    <th className="px-5 py-4">
                      {t.name}
                    </th>

                    <th className="px-5 py-4">
                      {t.contact}
                    </th>

                    <th className="px-5 py-4">
                      {t.people}
                    </th>

                    <th className="px-5 py-4">
                      {t.meat}
                    </th>

                    <th className="px-5 py-4">
                      {
                        t.vegetarian
                      }
                    </th>

                    <th className="px-5 py-4">
                      {t.total}
                    </th>

                    <th className="px-5 py-4">
                      {t.payment}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map(
                    (
                      reservation
                    ) => (
                      <tr
                        key={
                          reservation.id
                        }
                        className="border-t border-neutral-100"
                      >
                        <td className="px-5 py-4 font-medium">
                          {
                            reservation.name
                          }
                        </td>

                        <td className="px-5 py-4">
                          <p>
                            {
                              reservation.email
                            }
                          </p>

                          <p className="mt-1 text-sm text-neutral-500">
                            {
                              reservation.phone
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {
                            reservation.people
                          }
                        </td>

                        <td className="px-5 py-4">
                          {
                            reservation.meat_count
                          }
                        </td>

                        <td className="px-5 py-4">
                          {
                            reservation.vegetarian_count
                          }
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          €
                          {
                            reservation.total
                          }
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <PaymentBadge
                                status={reservation.payment_status}
                                paidText={t.paidStatus}
                                pendingText={t.pendingStatus}
                            />

                            {reservation.payment_status === "pending" && (
                                <button
                                type="button"
                                onClick={() => markAsPaid(reservation.id)}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                                >
                                {language === "es"
                                    ? "Marcar como pagada"
                                    : "Mark as paid"}
                                </button>
                            )}
                            </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function PaymentBadge({
  status,
  paidText,
  pendingText,
}: {
  status: string;
  paidText: string;
  pendingText: string;
}) {
  const paid =
    status === "paid";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        paid
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {paid
        ? paidText
        : pendingText}
    </span>
  );
}