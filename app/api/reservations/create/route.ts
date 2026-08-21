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
      name,
      email,
      phone,
      people,
      meatCount,
      vegetarianCount,
      editToken,
    } = body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !editToken
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

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("reservations")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),

        people,

        meat_count: meatCount,
        vegetarian_count: vegetarianCount,

        total,

        payment_status: "pending",
        edit_token: editToken,
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        "Error creando reserva:",
        error
      );

      return NextResponse.json(
        {
          error:
            "No se pudo crear la reserva.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error(
      "Error interno creando reserva:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}