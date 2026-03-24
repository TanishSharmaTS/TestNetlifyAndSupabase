export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-brown-900 text-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        {/* Left column */}
        <div>
          <p className="section-subtitle text-cream-400 mb-3">Who We Are</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight mb-8">
            A family tradition, one loaf at a time
          </h2>
          <div className="space-y-5 font-sans text-cream-300 leading-relaxed text-sm">
            <p>
              La Farine was born in a small kitchen in Thimphu, where our founder
              Dawa Lhamo learned to bake from her grandmother. Using traditional
              recipes handed down through generations, she opened our doors in 2010
              with nothing more than a wood-fired oven and a deep love for craft.
            </p>
            <p>
              Today, we rise every day at 4 AM to ensure every croissant is
              perfectly laminated, every sourdough properly fermented, and every
              birthday cake decorated with care. We source our flour from local
              mills and our butter from farms in Paro valley.
            </p>
            <p>
              Baking, to us, is not a job — it is a conversation between the baker
              and the person who will eventually sit down and take that first bite.
              We take that conversation seriously.
            </p>
          </div>
        </div>

        {/* Right: feature cards */}
        <div className="grid grid-cols-2 gap-5">
          {[
            {
              icon: '🌾',
              title: 'Local Ingredients',
              desc: 'Flour, butter, and eggs sourced from Bhutanese farms.',
            },
            {
              icon: '🔥',
              title: 'Wood-Fired Oven',
              desc: 'Traditional stone oven for that unmistakable crust.',
            },
            {
              icon: '⏰',
              title: 'Baked Fresh Daily',
              desc: 'We start at 4 AM so you get it warm by 8.',
            },
            {
              icon: '❤️',
              title: 'No Preservatives',
              desc: 'Real food that tastes real. Nothing more, nothing less.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-brown-800/60 border border-brown-700 p-6 hover:bg-brown-800 transition-colors duration-300"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-serif text-lg text-cream-100 mb-2">{title}</h3>
              <p className="font-sans text-xs text-cream-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
