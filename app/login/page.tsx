import { iniciarSesion } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-sm text-slate-400">
            Ingresa tus credenciales para acceder a tu recetario
          </p>
        </div>

        <form action={iniciarSesion} className="space-y-4">
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
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-xl transition-colors font-semibold mt-2 cursor-pointer"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-amber-400 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}