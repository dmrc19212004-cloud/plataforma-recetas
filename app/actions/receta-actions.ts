'use server'

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. CREAR RECETA (Chef)
export async function crearReceta(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No autorizado');

  const titulo = formData.get('titulo') as string;
  const descripcion = formData.get('descripcion') as string;
  const ingredientes = formData.get('ingredientes') as string;
  const instrucciones = formData.get('instrucciones') as string;
  const categoria = formData.get('categoria') as string;
  const tiempo_preparacion = parseInt(formData.get('tiempo_preparacion') as string);

  const { error } = await supabase.from('recetas').insert({
    titulo,
    descripcion,
    ingredientes,
    instrucciones,
    categoria,
    tiempo_preparacion,
    chef_id: user.id
  });

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// 2. ACTUALIZAR RECETA (Chef)
export async function actualizarReceta(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No autorizado');

  const titulo = formData.get('titulo') as string;
  const descripcion = formData.get('descripcion') as string;
  const ingredientes = formData.get('ingredientes') as string;
  const instrucciones = formData.get('instrucciones') as string;
  const categoria = formData.get('categoria') as string;
  const tiempo_preparacion = parseInt(formData.get('tiempo_preparacion') as string);

  const { error } = await supabase
    .from('recetas')
    .update({ titulo, descripcion, ingredientes, instrucciones, categoria, tiempo_preparacion })
    .eq('id', id)
    .eq('chef_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// 3. ELIMINAR RECETA (Chef)
export async function eliminarReceta(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No autorizado');

  const { error } = await supabase
    .from('recetas')
    .delete()
    .eq('id', id)
    .eq('chef_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/dashboard');
}