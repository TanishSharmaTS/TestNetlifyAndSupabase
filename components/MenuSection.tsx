'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase, BakeryItem } from '@/lib/supabase';
import { ShoppingBag } from 'lucide-react';

const CATEGORIES = ['All', 'Bread', 'Pastry', 'Cake', 'Cookie', 'Seasonal'];

export default function MenuSection() {
  const [items, setItems] = useState<BakeryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('bakery_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    }
    fetchItems();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <section id="menu" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-subtitle mb-3">What We Bake</p>
          <h2 className="section-title">Our Daily Menu</h2>
          <div className="w-16 h-px bg-brown-400 mx-auto mt-6" />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-brown-800 text-cream-50 border-brown-800'
                  : 'border-brown-400 text-brown-600 hover:border-brown-800 hover:text-brown-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-cream-100 animate-pulse h-80 rounded"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-brown-300 mb-4" />
            <p className="font-serif text-xl text-brown-500">
              No items in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ItemCard({ item, index }: { item: BakeryItem; index: number }) {
  return (
    <div
      className="card-hover group cursor-default opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-100 aspect-[4/3]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🥐</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-brown-800 text-cream-50 font-sans text-[10px] tracking-widest uppercase px-2.5 py-1">
            {item.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-5 border-b border-cream-200">
        <h3 className="font-serif text-xl text-brown-900 mb-1">{item.name}</h3>
        <p className="font-sans text-sm text-brown-500 leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-serif text-2xl text-brown-800">
            Nu. {item.price.toFixed(2)}
          </span>
          <button className="font-sans text-[10px] tracking-widest uppercase text-brown-600 hover:text-brown-900 border border-brown-300 hover:border-brown-900 px-3 py-1.5 transition-all duration-300">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
