export type AdminLanguage = "es" | "en";

export const adminTranslations = {
  es: {
    title: "Panel de reservas",
    date: "11 de septiembre",
    logout: "Cerrar sesión",

    reservations: "Reservas",
    people: "Personas",
    meat: "Carne",
    vegetarian: "Vegetarianos",
    paid: "Cobrado",
    pending: "Pendiente",

    name: "Nombre",
    contact: "Contacto",
    total: "Total",
    payment: "Pago",

    paidStatus: "Pagado",
    pendingStatus: "Pendiente",

    loading: "Cargando reservas...",
    noReservations: "Todavía no hay reservas.",
  },

  en: {
    title: "Reservation dashboard",
    date: "September 11",
    logout: "Log out",

    reservations: "Reservations",
    people: "People",
    meat: "Meat",
    vegetarian: "Vegetarian",
    paid: "Paid",
    pending: "Pending",

    name: "Name",
    contact: "Contact",
    total: "Total",
    payment: "Payment",

    paidStatus: "Paid",
    pendingStatus: "Pending",

    loading: "Loading reservations...",
    noReservations: "There are no reservations yet.",
  },
};

export type AdminTranslation =
  (typeof adminTranslations)[AdminLanguage];