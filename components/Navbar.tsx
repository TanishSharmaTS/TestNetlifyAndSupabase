'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-sm shadow-sm py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-script text-3xl text-brown-800 group-hover:text-brown-600 transition-colors">
            La Farine
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-brown-500 -mt-1">
            Artisan Bakery
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {['Menu', 'About', 'Story', 'Contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="font-sans text-xs tracking-widest uppercase text-brown-700 hover:text-brown-900 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-brown-800 after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#menu"
              className="btn-primary text-[10px] py-2.5"
            >
              Order Now
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-brown-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-6 space-y-4">
          {['Menu', 'About', 'Story', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block font-sans text-xs tracking-widest uppercase text-brown-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
