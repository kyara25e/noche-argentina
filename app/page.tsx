"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "es" | "en" | "nl";

const PRICE_PER_PERSON = 20;

const translations = {
  es: {
    navHome: "Inicio",
    navMenu: "Menú",
    navInfo: "Información",
    reserve: "Reservar",

    title: "NOCHE ARGENTINA",
    subtitle: "Asado, amigos y buenos momentos",
    description:
      "Te invitamos a disfrutar de una auténtica noche argentina con comida, bebidas típicas y buena compañía.",

    date: "11 de septiembre",
    time: "17:00 – 22:00",
    location: "En el edificio",

    bookingTitle: "Hacé tu reserva",
    pricePerPerson: "€20 por persona",

    people: "Cantidad de personas",
    foodOption: "Elegí los menús",
    meat: "Carne",
    vegetarian: "Vegetariano",

    total: "Total",
    reserveAndPay: "Reservar y pagar",
    processing: "Procesando...",

    securePayment: "Pago seguro",

    includes: "¿Qué incluye?",
    empanadas: "Empanadas",
    asado: "Asado",
    chori: "Chori",
    burger: "Hamburguesa",
    salad: "Chimichurri y ensalada",
    mate: "Mate cocido",
    fernet: "Fernet",
    fernetExtra: "1 vaso incluido",
    chocotorta: "Chocotorta",

    yourData: "Tus datos",
    fullName: "Nombre completo",
    email: "Email",
    phone: "Teléfono",

    missingMenu: "Falta elegir",
    menu: "menú",
    menus: "menús",
    selected: "seleccionados",

    reservationSuccess: "¡Reserva creada correctamente!",
    reservationError:
      "No pudimos crear la reserva. Intentá nuevamente.",
  },

  en: {
    navHome: "Home",
    navMenu: "Menu",
    navInfo: "Information",
    reserve: "Book",

    title: "ARGENTINE NIGHT",
    subtitle: "BBQ, friends and good times",
    description:
      "Join us for an authentic Argentine evening with traditional food, drinks and good company.",

    date: "September 11",
    time: "17:00 – 22:00",
    location: "In the building",

    bookingTitle: "Make your reservation",
    pricePerPerson: "€20 per person",

    people: "Number of people",
    foodOption: "Choose the menus",
    meat: "Meat",
    vegetarian: "Vegetarian",

    total: "Total",
    reserveAndPay: "Book and pay",
    processing: "Processing...",

    securePayment: "Secure payment",

    includes: "What's included?",
    empanadas: "Empanadas",
    asado: "Argentine BBQ",
    chori: "Chorizo",
    burger: "Burger",
    salad: "Chimichurri & salad",
    mate: "Mate cocido",
    fernet: "Fernet",
    fernetExtra: "1 glass included",
    chocotorta: "Chocotorta",

    yourData: "Your details",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",

    missingMenu: "Choose",
    menu: "menu",
    menus: "menus",
    selected: "selected",

    reservationSuccess: "Reservation created successfully!",
    reservationError:
      "We couldn't create your reservation. Please try again.",
  },

  nl: {
    navHome: "Home",
    navMenu: "Menu",
    navInfo: "Informatie",
    reserve: "Reserveren",

    title: "ARGENTIJNSE AVOND",
    subtitle: "Asado, vrienden en mooie momenten",
    description:
      "Geniet van een authentieke Argentijnse avond met traditioneel eten, typische drankjes en gezelligheid.",

    date: "11 september",
    time: "17:00 – 22:00",
    location: "In het gebouw",

    bookingTitle: "Maak je reservering",
    pricePerPerson: "€20 per persoon",

    people: "Aantal personen",
    foodOption: "Kies de menu's",
    meat: "Vlees",
    vegetarian: "Vegetarisch",

    total: "Totaal",
    reserveAndPay: "Reserveren en betalen",
    processing: "Bezig...",

    securePayment: "Veilig betalen",

    includes: "Wat is inbegrepen?",
    empanadas: "Empanadas",
    asado: "Asado",
    chori: "Chorizo",
    burger: "Hamburger",
    salad: "Chimichurri en salade",
    mate: "Mate cocido",
    fernet: "Fernet",
    fernetExtra: "1 glas inbegrepen",
    chocotorta: "Chocotorta",

    yourData: "Jouw gegevens",
    fullName: "Volledige naam",
    email: "E-mail",
    phone: "Telefoon",

    missingMenu: "Kies nog",
    menu: "menu",
    menus: "menu's",
    selected: "geselecteerd",

    reservationSuccess: "Reservering succesvol aangemaakt!",
    reservationError:
      "We konden je reservering niet aanmaken. Probeer het opnieuw.",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");

  const [people, setPeople] = useState(1);

  const [meatCount, setMeatCount] = useState(1);
  const [vegetarianCount, setVegetarianCount] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const total = useMemo(() => {
    return people * PRICE_PER_PERSON;
  }, [people]);

  const selectedMenus = meatCount + vegetarianCount;

  const menusComplete = selectedMenus === people;

  /* ==============================
     PEOPLE
  ============================== */

  const decreasePeople = () => {
    if (people <= 1) return;

    const newPeople = people - 1;

    setPeople(newPeople);

    if (selectedMenus > newPeople) {
      if (vegetarianCount > 0) {
        setVegetarianCount((current) =>
          Math.max(0, current - 1)
        );
      } else if (meatCount > 0) {
        setMeatCount((current) =>
          Math.max(0, current - 1)
        );
      }
    }
  };

  const increasePeople = () => {
    setPeople((current) => current + 1);
  };

  /* ==============================
     MEAT
  ============================== */

  const increaseMeat = () => {
    if (selectedMenus >= people) return;

    setMeatCount((current) => current + 1);
  };

  const decreaseMeat = () => {
    setMeatCount((current) =>
      Math.max(0, current - 1)
    );
  };

  /* ==============================
     VEGETARIAN
  ============================== */

  const increaseVegetarian = () => {
    if (selectedMenus >= people) return;

    setVegetarianCount((current) => current + 1);
  };

  const decreaseVegetarian = () => {
    setVegetarianCount((current) =>
      Math.max(0, current - 1)
    );
  };

  /* ==============================
     MENU MESSAGE
  ============================== */

  const getMenuMessage = () => {
    if (menusComplete) {
      return `✓ ${selectedMenus} de ${people} ${t.menus} ${t.selected}`;
    }

    const missing = people - selectedMenus;

    return `${t.missingMenu} ${missing} ${
      missing === 1 ? t.menu : t.menus
    }`;
  };

  /* ==============================
     RESERVATION
  ============================== */

  const handleReservation = async () => {
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
      const { error } = await supabase
        .from("reservations")
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),

          people,

          meat_count: meatCount,

          vegetarian_count:
            vegetarianCount,

          total,

          payment_status: "pending",
        });

      if (error) {
        throw error;
      }

      alert(t.reservationSuccess);

      /*
       * Más adelante:
       *
       * acá vamos a generar el pago
       * con Revolut y redirigir al usuario.
       */

    } catch (error) {
      console.error(
        "Error creando reserva:",
        error
      );

      alert(t.reservationError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#181818]">

      {/* ============================
          HERO
      ============================ */}

      <section
        id="inicio"
        className="relative min-h-[720px] bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,.94), rgba(0,0,0,.55)), url('/asado.jpg')",
        }}
      >

        {/* HEADER */}

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">

          <div>
            <p className="font-serif text-xl tracking-[0.2em]">
              NOCHE
            </p>

            <h2 className="font-serif text-2xl font-bold tracking-wider">
              ARGENTINA 🇦🇷
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

          {/* LANGUAGE */}

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value as Language
              )
            }
            className="rounded-md border border-white/20 bg-black/60 px-3 py-2 text-white"
          >
            <option value="es">
              🇪🇸 ES
            </option>

            <option value="en">
              🇬🇧 EN
            </option>

            <option value="nl">
              🇳🇱 NL
            </option>
          </select>

        </header>

        {/* HERO CONTENT */}

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.25fr_.75fr]">

          {/* LEFT */}

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

          {/* QUICK BOOKING */}

          <div className="rounded-2xl border border-white/15 bg-black/55 p-7 shadow-2xl backdrop-blur-md">

            <h2 className="text-center font-serif text-3xl font-bold uppercase">
              {t.bookingTitle}
            </h2>

            <p className="mt-3 text-center text-xl text-[#f2cf88]">
              {t.pricePerPerson}
            </p>

            {/* PEOPLE */}

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

            {/* MENUS */}

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
                  {getMenuMessage()}
                </p>

              </div>

            </div>

            {/* TOTAL */}

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
                    behavior:
                      "smooth",
                  })
              }
              disabled={
                !menusComplete
              }
              className="w-full rounded-xl bg-[#ddb566] py-4 text-lg font-bold text-black transition hover:bg-[#eccb8c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.reserve}
            </button>

          </div>

        </div>

      </section>

      {/* ============================
          MENU
      ============================ */}

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
            label={t.empanadas}
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
            label={t.chocotorta}
          />

        </div>

      </section>

      {/* ============================
          BOOKING
      ============================ */}

      <section
        id="booking"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-5xl px-6">

          <div className="grid overflow-hidden rounded-3xl border shadow-xl lg:grid-cols-2">

            {/* DATA */}

            <div className="p-8 md:p-12">

              <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-[#284c73]">
                1. {t.yourData}
              </p>

              <div className="space-y-5">

                <Field
                  label={
                    t.fullName
                  }
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

            {/* SUMMARY */}

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

                {/* TOTAL */}

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

                {/* WARNING */}

                {!menusComplete && (

                  <p className="rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-300">
                    ⚠️{" "}
                    {getMenuMessage()}
                  </p>

                )}

                {/* RESERVE */}

                <button
                  type="button"
                  onClick={
                    handleReservation
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
                    : t.reserveAndPay}
                </button>

                <p className="text-center text-xs text-white/50">
                  🔒{" "}
                  {t.securePayment}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================
          INFO
      ============================ */}

      <section
        id="info"
        className="bg-[#f5f0e8] py-16"
      >

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="font-serif text-3xl font-bold">
            🇦🇷 Noche Argentina
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-neutral-600">
            €20 por persona · Reserva
            previa · Pago online
          </p>

        </div>

      </section>

    </main>
  );
}

/* ==============================
   COUNTER
============================== */

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

/* ==============================
   MENU COUNTER
============================== */

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

/* ==============================
   MENU ITEM
============================== */

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

/* ==============================
   FIELD
============================== */

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

/* ==============================
   SUMMARY
============================== */

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