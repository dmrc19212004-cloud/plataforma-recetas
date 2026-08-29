'use server'

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function iniciarSesion(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    return;
  }

  redirect("/dashboard");
}