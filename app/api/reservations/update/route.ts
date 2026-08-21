import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      editToken,
      name,
      email,
      phone,
      people,
      meatCount,
      vegetarianCount,
    } = body;

    if (
      !id ||
      !editToken ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim()
    ) {
      return NextResponse.json(
        { error: "Datos incompletos." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(people) ||
      people < 1 ||
      people > 8
    ) {
      return NextResponse.json(
        { error: "Cantidad de personas inválida." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(meatCount) ||
      !Number.isInteger(vegetarianCount) ||
      meatCount < 0 ||
      vegetarianCount < 0 ||
      meatCount + vegetarianCount !== people
    ) {
      return NextResponse.json(
        { error: "La cantidad de platos no coincide." },
        { status: 400 }
      );
    }

    const total = people * 20;

    /*
     * Primero comprobamos que exista
     * la reserva con ese ID + token.
     */
    const {
      data: reservation,
      error: findError,
    } = await supabaseAdmin
      .from("reservations")
      .select("id, payment_status")
      .eq("id", id)
      .eq("edit_token", editToken)
      .maybeSingle();

    if (findError) {
      console.error(findError);

      return NextResponse.json(
        { error: "No se pudo verificar la reserva." },
        { status: 500 }
      );
    }

    if (!reservation) {
      return NextResponse.json(
        { error: "Reserva no encontrada." },
        { status: 404 }
      );
    }

    /*
     * Una reserva pagada no debería
     * poder modificarse desde la web.
     */
    if (reservation.payment_status === "paid") {
      return NextResponse.json(
        {
          error:
            "La reserva ya está pagada y no puede modificarse.",
        },
        { status: 409 }
      );
    }

    const {
      data,
      error: updateError,
    } = await supabaseAdmin
      .from("reservations")
      .update({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),

        people,

        meat_count: meatCount,
        vegetarian_count: vegetarianCount,

        total,

        payment_status: "pending",
      })
      .eq("id", id)
      .eq("edit_token", editToken)
      .select("id")
      .single();

    if (updateError) {
      console.error(updateError);

      return NextResponse.json(
        { error: "No se pudo actualizar la reserva." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error(
      "Error actualizando reserva:",
      error
    );

    return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }
}