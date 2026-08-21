"use client";

import { useState } from "react";

import LanguageSelector from "@/components/LanguageSelector";

import ReservationForm from "@/components/reservation/ReservationForm";
import ReservationSelector from "@/components/reservation/ReservationSelector";
import { ReservationProvider } from "@/components/reservation/ReservationProvider";
import {
  translations,
  type Language,
} from "@/lib/translations";

export default function Home() {
  const [language, setLanguage] =
    useState<Language>("es");

  const t =
    translations[language];

  return (
    <ReservationProvider>
      <main className="min-h-screen bg-[#f5f0e8] text-[#181818]">

        <section
          id="inicio"
          className="relative min-h-[720px] bg-cover bg-center text-white"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,.94), rgba(0,0,0,.55)), url('/asado.jpg')",
          }}
        >
          <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
            <div>
              <p className="font-serif text-xl tracking-[0.2em]">
                NOCHE
              </p>

              <h2 className="font-serif text-2xl font-bold tracking-wider">
                ARGENTINA
              </h2>
            </div>

            <nav className="hidden items-center gap-8 md:flex">
              <a href="#inicio">
                {t.navHome}
              </a>

              <a href="#menu">
                {t.navMenu}
              </a>

              <a href="#info">
                {t.navInfo}
              </a>

              <a
                href="#booking"
                className="rounded-md border border-[#d8ae62] px-5 py-2 text-[#f5d79b]"
              >
                {t.reserve}
              </a>
            </nav>

            <LanguageSelector
              language={language}
              onChange={
                setLanguage
              }
            />
          </header>

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.25fr_.75fr]">

            <div>
              <h1 className="max-w-2xl font-serif text-6xl font-black leading-[0.95] md:text-8xl">
                {t.title}
              </h1>

              <p className="mt-5 inline-block bg-[#284c73] px-4 py-2 font-serif text-lg uppercase tracking-[0.12em]">
                {t.subtitle}
              </p>

              <p className="mt-7 max-w-lg text-lg leading-8 text-white/80">
                {t.description}
              </p>

              <div className="mt-8 space-y-3 text-lg">
                <p>
                  📅 {t.date}
                </p>

                <p>
                  🕐 {t.time}
                </p>

                <p>
                  📍 {t.location}
                </p>
              </div>
            </div>

            <ReservationSelector
              t={t}
            />
          </div>
        </section>

        <section
          id="menu"
          className="mx-auto max-w-7xl px-6 py-16"
        >
          <h2 className="text-center font-serif text-4xl font-bold">
            {t.includes}
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-8 text-center sm:grid-cols-4 lg:grid-cols-8">
            <MenuItem
              icon="🥟"
              label={
                t.empanadas
              }
            />

            <MenuItem
              icon="🔥"
              label={t.asado}
            />

            <MenuItem
              icon="🌭"
              label={t.chori}
            />

            <MenuItem
              icon="🍔"
              label={t.burger}
            />

            <MenuItem
              icon="🥗"
              label={t.salad}
            />

            <MenuItem
              icon="🧉"
              label={t.mate}
            />

            <MenuItem
              icon="🥃"
              label={`${t.fernet} (${t.fernetExtra})`}
            />

            <MenuItem
              icon="🍰"
              label={
                t.chocotorta
              }
            />
          </div>
        </section>

        <ReservationForm
          t={t}
        />

        <section
          id="info"
          className="bg-[#f5f0e8] py-20"
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#284c73]">
                {
                  t.organizerTitle
                }
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold">
                Noche Argentina
              </h2>

              <div className="mt-7 space-y-4 text-neutral-700">
                <p>
                  <strong>
                    {
                      t.organizedBy
                    }
                    :
                  </strong>{" "}
                  Maira Verhoeven
                </p>

                <p>
                  {t.eventType}
                </p>

                <div className="border-t border-neutral-200 pt-5">
                  <div className="space-y-3">
                    <p>
                      📅 {t.date}
                    </p>

                    <p>
                      🕐 {t.time}
                    </p>

                    <p>
                      📍{" "}
                      {t.location}
                    </p>
                  </div>
                </div>

                <p className="border-t border-neutral-200 pt-5 font-semibold">
                  {t.priceInfo}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#171717] px-6 py-8 text-center text-sm text-white/60">
          <p>
            Noche Argentina ·
            Zeist · 11 September
            2026 · Created by Kyara
            Rojas.
          </p>
        </footer>
      </main>
    </ReservationProvider>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-5xl">
        {icon}
      </div>

      <p className="mt-3 text-sm font-medium">
        {label}
      </p>
    </div>
  );
}