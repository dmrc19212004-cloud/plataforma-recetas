'use server'

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

async function registrarUsuario(formData: FormData) {
  'use server'

  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // 'chef' o 'lector'

  // 1. Crear el usuario en Supabase Auth pasando el rol en la metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    console.error("Error en el registro:", error.message);
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  // 2. Redirigir al dashboard una vez completado el registro
  redirect("/dashboard");
}

export default async function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Crear una Cuenta</h1>
          <p className="text-sm text-slate-400">
            Únete a la comunidad de cocina como Chef o Lector
          </p>
        </div>

        <form action={registrarUsuario} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder="Ej. María Augusta Pérez"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Selección del Rol: Chef o Lector */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
              ¿Cómo deseas participar?
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="lector">Lector (Explorar y guardar recetas)</option>
              <option value="chef">Chef (Publicar y gestionar mis recetas)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-xl transition-colors font-semibold mt-2"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-amber-400 hover:underline font-semibold">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </main>
  );
}