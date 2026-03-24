export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brown-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wheat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#de9940" />
              <line x1="30" y1="10" x2="30" y2="50" stroke="#de9940" strokeWidth="0.5" />
              <line x1="10" y1="30" x2="50" y2="30" stroke="#de9940" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wheat)" />
        </svg>
      </div>

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brown-950 via-brown-900/90 to-brown-800/60" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p
              className="font-sans text-[11px] tracking-[0.4em] uppercase text-cream-400 opacity-0 animate-fade-in stagger-1"
              style={{ animationFillMode: 'forwards' }}
            >
              Est. 2010 · Thimphu, Bhutan
            </p>
            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream-50 leading-[1.1] opacity-0 animate-slide-up stagger-2"
              style={{ animationFillMode: 'forwards' }}
            >
              Baked with
              <br />
              <em className="text-cream-400 font-serif italic">love</em>
              {' '}& flour
            </h1>
          </div>

          <p
            className="font-sans text-base text-cream-300 leading-relaxed max-w-md opacity-0 animate-slide-up stagger-3"
            style={{ animationFillMode: 'forwards' }}
          >
            Every morning, we wake before dawn to craft breads, pastries, and
            cakes from the finest local ingredients. No shortcuts, no preservatives
            — just honest, handmade baking the way it was always meant to be.
          </p>

          <div
            className="flex flex-wrap gap-4 opacity-0 animate-slide-up stagger-4"
            style={{ animationFillMode: 'forwards' }}
          >
            <a href="#menu" className="btn-primary bg-cream-400 text-brown-950 hover:bg-cream-300">
              Explore Menu
            </a>
            <a href="#about" className="btn-secondary border-cream-500 text-cream-300 hover:bg-cream-400 hover:text-brown-950 hover:border-cream-400">
              Our Story
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex gap-10 pt-4 opacity-0 animate-fade-in stagger-5"
            style={{ animationFillMode: 'forwards' }}
          >
            {[
              { num: '14+', label: 'Years Baking' },
              { num: '40+', label: 'Daily Items' },
              { num: '500+', label: 'Happy Customers' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-3xl text-cream-400">{num}</div>
                <div className="font-sans text-[10px] tracking-widest uppercase text-cream-500 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative right side */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-96 h-96">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-cream-400/20 animate-float" />
            <div className="absolute inset-8 rounded-full border border-cream-400/15 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-16 rounded-full border border-cream-400/10 animate-float" style={{ animationDelay: '2s' }} />
            {/* Center emoji */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl animate-float" style={{ animationDelay: '0.5s' }}>🥖</span>
            </div>
            {/* Floating items */}
            <div className="absolute top-4 right-12 text-4xl animate-float" style={{ animationDelay: '0.8s' }}>🧁</div>
            <div className="absolute bottom-10 left-6 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🥐</div>
            <div className="absolute top-1/2 right-0 text-3xl animate-float" style={{ animationDelay: '2.3s' }}>🍰</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-500">
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-cream-500 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
