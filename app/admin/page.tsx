import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';

export const revalidate = 0;

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  const { data: items, error } = await supabaseAdmin
    .from('bakery_items')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminDashboard initialItems={items || []} />;
}
