'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, LogOut, X, Upload, Edit2,
  ToggleLeft, ToggleRight, Package, AlertCircle, CheckCircle
} from 'lucide-react';
import { BakeryItem } from '@/lib/supabase';

const CATEGORIES = ['Bread', 'Pastry', 'Cake', 'Cookie', 'Seasonal'];

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Bread',
  available: true,
};

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function AdminDashboard({ initialItems }: { initialItems: BakeryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<BakeryItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<BakeryItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  function openAdd() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  }

  function openEdit(item: BakeryItem) {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      available: item.available,
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditItem(null);
    setImageFile(null);
    setImagePreview(null);
    setForm(EMPTY_FORM);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const body = new FormData();
      body.append('name', form.name);
      body.append('description', form.description);
      body.append('price', form.price);
      body.append('category', form.category);
      body.append('available', String(form.available));
      if (imageFile) body.append('image', imageFile);
      if (editItem) body.append('id', editItem.id);
      if (editItem?.image_url && !imageFile) body.append('existing_image_url', editItem.image_url);

      const res = await fetch('/api/items', {
        method: editItem ? 'PUT' : 'POST',
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save item');
      }

      const { item } = await res.json();
      if (editItem) {
        setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
        showToast('success', 'Item updated successfully!');
      } else {
        setItems((prev) => [item, ...prev]);
        showToast('success', 'Item added successfully!');
      }
      closeForm();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item: BakeryItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/items?id=${item.id}&image_url=${encodeURIComponent(item.image_url || '')}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast('success', `"${item.name}" deleted.`);
    } catch {
      showToast('error', 'Could not delete item.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleAvailability(item: BakeryItem) {
    try {
      const res = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, available: !item.available }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
      );
    } catch {
      showToast('error', 'Could not update availability.');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const available = items.filter((i) => i.available).length;
  const unavailable = items.length - available;

  return (
    <div className="min-h-screen bg-brown-950 text-cream-100 admin-scroll">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 shadow-2xl font-sans text-sm transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-900 border border-green-700 text-green-200'
              : 'bg-red-900 border border-red-700 text-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-brown-800 px-8 py-5 flex items-center justify-between sticky top-0 bg-brown-950/95 backdrop-blur z-40">
        <div className="flex items-center gap-4">
          <span className="font-script text-2xl text-cream-400">La Farine</span>
          <span className="font-sans text-[9px] tracking-widest uppercase text-brown-500 border-l border-brown-700 pl-4">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="font-sans text-[10px] tracking-widest uppercase text-brown-500 hover:text-cream-400 transition-colors"
          >
            View Shop
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-brown-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Total Items', value: items.length, icon: Package },
            { label: 'Available', value: available, icon: ToggleRight },
            { label: 'Unavailable', value: unavailable, icon: ToggleLeft },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-brown-900 border border-brown-800 px-6 py-5 flex items-center gap-4">
              <Icon size={22} className="text-cream-400" />
              <div>
                <div className="font-serif text-3xl text-cream-100">{value}</div>
                <div className="font-sans text-[10px] tracking-widest uppercase text-brown-500 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl text-cream-100">Menu Items</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-cream-400 text-brown-950 font-sans font-bold text-xs tracking-widest uppercase px-5 py-3 hover:bg-cream-300 transition-colors"
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>

        {/* Items table */}
        {items.length === 0 ? (
          <div className="text-center py-24 border border-brown-800">
            <Package size={40} className="mx-auto text-brown-700 mb-4" />
            <p className="font-serif text-xl text-brown-600">No items yet.</p>
            <p className="font-sans text-xs text-brown-700 mt-2">Add your first menu item to get started.</p>
          </div>
        ) : (
          <div className="border border-brown-800 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_140px_100px_100px_130px] gap-4 px-5 py-3 bg-brown-900 border-b border-brown-800">
              {['Image', 'Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                <div key={h} className="font-sans text-[9px] tracking-widest uppercase text-brown-500">{h}</div>
              ))}
            </div>

            {/* Rows */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[60px_1fr_140px_100px_100px_130px] gap-4 px-5 py-4 border-b border-brown-800/60 hover:bg-brown-900/40 transition-colors items-center"
              >
                {/* Image */}
                <div className="w-12 h-12 bg-brown-800 overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🥐</div>
                  )}
                </div>

                {/* Name + desc */}
                <div className="min-w-0">
                  <p className="font-serif text-base text-cream-100 truncate">{item.name}</p>
                  <p className="font-sans text-xs text-brown-500 truncate mt-0.5">{item.description}</p>
                </div>

                {/* Category */}
                <div>
                  <span className="font-sans text-[10px] tracking-widest uppercase bg-brown-800 text-brown-300 px-2.5 py-1">
                    {item.category}
                  </span>
                </div>

                {/* Price */}
                <div className="font-serif text-lg text-cream-300">
                  Nu. {item.price.toFixed(2)}
                </div>

                {/* Toggle */}
                <div>
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`flex items-center gap-1.5 font-sans text-[10px] tracking-widest uppercase transition-colors ${
                      item.available ? 'text-green-400 hover:text-green-300' : 'text-brown-600 hover:text-brown-400'
                    }`}
                  >
                    {item.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {item.available ? 'Live' : 'Hidden'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 text-brown-500 hover:text-cream-300 hover:bg-brown-800 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="p-2 text-brown-500 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    {deletingId === item.id ? (
                      <span className="text-[10px]">...</span>
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-brown-900 border border-brown-700 shadow-2xl max-h-[90vh] overflow-y-auto admin-scroll">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-brown-800">
              <h2 className="font-serif text-xl text-cream-100">
                {editItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={closeForm} className="text-brown-500 hover:text-cream-300 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
              {/* Image upload */}
              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest uppercase text-brown-400">
                  Product Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brown-700 hover:border-cream-400 transition-colors cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="relative h-40">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="font-sans text-xs text-white tracking-widest uppercase">Change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center gap-3 text-brown-600">
                      <Upload size={28} />
                      <p className="font-sans text-xs tracking-widest uppercase">Click to upload</p>
                      <p className="font-sans text-[10px] text-brown-700">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <Field label="Item Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Almond Croissant"
                  className="admin-input"
                />
              </Field>

              {/* Description */}
              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="A short description of the item..."
                  className="admin-input resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-5">
                {/* Price */}
                <Field label="Price (Nu.)" required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    placeholder="0.00"
                    className="admin-input"
                  />
                </Field>

                {/* Category */}
                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="admin-input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Available toggle */}
              <div className="flex items-center justify-between py-3 border-t border-brown-800">
                <div>
                  <p className="font-sans text-xs text-cream-300">Available on Menu</p>
                  <p className="font-sans text-[10px] text-brown-600 mt-0.5">Show this item to customers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, available: !form.available })}
                  className={`transition-colors ${form.available ? 'text-green-400' : 'text-brown-600'}`}
                >
                  {form.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border border-brown-700 text-brown-400 font-sans text-xs tracking-widest uppercase py-3 hover:border-brown-500 hover:text-brown-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-cream-400 text-brown-950 font-sans font-bold text-xs tracking-widest uppercase py-3 hover:bg-cream-300 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline styles for admin inputs */}
      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: #3a1709;
          border: 1px solid #653116;
          color: #faf0dc;
          font-family: 'Lato', sans-serif;
          font-size: 0.875rem;
          padding: 0.625rem 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: #e6b05e;
        }
        .admin-input::placeholder {
          color: #7d3818;
        }
        .admin-input option {
          background: #3a1709;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="font-sans text-[10px] tracking-widest uppercase text-brown-400">
        {label} {required && <span className="text-cream-400">*</span>}
      </label>
      {children}
    </div>
  );
}
