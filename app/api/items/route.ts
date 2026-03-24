import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

const BUCKET = 'bakery-images';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function authGuard(): Promise<NextResponse | undefined> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error('/api/items uploadImage supabase error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

async function deleteImage(imageUrl: string) {
  try {
    // Extract filename from full URL
    const parts = imageUrl.split(`/${BUCKET}/`);
    if (parts.length < 2) return;
    const filename = parts[1];
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([filename]);
    if (error) {
      console.error('/api/items deleteImage supabase error:', error);
    }
  } catch (err) {
    // Non-fatal: log but don't throw
    console.error('Failed to delete image from storage', err);
  }
}

// ── POST — Create item ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' },
      { status: 500 }
    );
  }
  
  const guard = await authGuard();
  if (guard) return guard;

  try {
    const formData = await req.formData();

    const name = (formData.get('name') as string | null)?.trim() || '';
    const description = (formData.get('description') as string | null)?.trim() || '';
    const price = parseFloat((formData.get('price') as string | null) ?? '');
    const category = (formData.get('category') as string | null)?.trim() || '';
    const available = formData.get('available') === 'true';
    const imageFile = formData.get('image') as File | null;

    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Name, description and category are required' }, { status: 400 });
    }
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    let image_url: string | null = null;
    if (imageFile && imageFile.size > 0) {
      image_url = await uploadImage(imageFile);
    }

    const { data, error } = await supabaseAdmin
      .from('bakery_items')
      .insert([{ name, description, price, category, available, image_url }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (err: any) {
    console.error('/api/items POST error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

// ── PUT — Update item ─────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' },
      { status: 500 }
    );
  }
  
  const guard = await authGuard();
  if (guard) return guard;

  try {
    const formData = await req.formData();

    const id = (formData.get('id') as string | null)?.trim() || '';
    const name = (formData.get('name') as string | null)?.trim() || '';
    const description = (formData.get('description') as string | null)?.trim() || '';
    const price = parseFloat((formData.get('price') as string | null) ?? '');
    const category = (formData.get('category') as string | null)?.trim() || '';
    const available = formData.get('available') === 'true';
    const imageFile = formData.get('image') as File | null;
    const existingImageUrl = formData.get('existing_image_url') as string | null;

    if (!id) {
      return NextResponse.json({ error: 'Item id is required for update' }, { status: 400 });
    }
    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Name, description and category are required' }, { status: 400 });
    }
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    let image_url: string | null = existingImageUrl || null;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if present
      if (existingImageUrl) await deleteImage(existingImageUrl);
      image_url = await uploadImage(imageFile);
    }

    const { data, error } = await supabaseAdmin
      .from('bakery_items')
      .update({ name, description, price, category, available, image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (err: any) {
    console.error('/api/items PUT error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

// ── PATCH — Toggle availability ───────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' },
      { status: 500 }
    );
  }
  
  const guard = await authGuard();
  if (guard) return guard;

  try {
    const { id, available } = await req.json();

    const { data, error } = await supabaseAdmin
      .from('bakery_items')
      .update({ available })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (err: any) {
    console.error('/api/items PATCH error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE — Remove item ──────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' },
      { status: 500 }
    );
  }
  
  const guard = await authGuard();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const imageUrl = searchParams.get('image_url');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('bakery_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (imageUrl) await deleteImage(imageUrl);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('/api/items DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
