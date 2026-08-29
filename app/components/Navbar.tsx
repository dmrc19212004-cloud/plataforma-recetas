import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-500">
          🍳 Recetas App
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/catalogo" className="hover:text-amber-400 transition-colors">
            Catálogo
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-slate-400 hover:text-red-400 transition-colors">
                  Cerrar Sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-400 transition-colors">
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}