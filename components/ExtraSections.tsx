export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sonam Wangchuk',
      text: "The sourdough here is unlike anything I've had outside of Paris. Perfectly fermented, incredible crust.",
    },
    {
      name: 'Pema Dorji',
      text: 'We order our birthday cakes exclusively from La Farine. Every year they exceed expectations.',
    },
    {
      name: 'Karma Choden',
      text: "I stop here every single morning. The almond croissant alone is worth the detour.",
    },
  ];

  return (
    <section id="story" className="py-28 px-6 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-3">Kind Words</p>
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="w-16 h-px bg-brown-400 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, text }) => (
            <div
              key={name}
              className="bg-cream-50 p-8 border border-cream-200 hover:shadow-xl transition-shadow duration-500"
            >
              <div className="font-serif text-5xl text-cream-300 leading-none mb-4">"</div>
              <p className="font-sans text-sm text-brown-700 leading-relaxed mb-6">{text}</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brown-200 flex items-center justify-center font-serif text-brown-700 font-bold">
                  {name[0]}
                </div>
                <span className="font-sans text-xs tracking-widest uppercase text-brown-500">
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="py-28 px-6 bg-brown-950 text-cream-50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-subtitle text-cream-400 mb-3">Find Us</p>
        <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-8">
          Come visit us
        </h2>
        <p className="font-sans text-sm text-cream-400 leading-relaxed mb-14 max-w-md mx-auto">
          We're open Tuesday through Sunday. Pop in, take a seat, and let the
          smell of fresh bread do the rest.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 mb-14">
          {[
            {
              icon: '📍',
              title: 'Location',
              lines: ['Norzin Lam, Thimphu', 'Bhutan'],
            },
            {
              icon: '🕐',
              title: 'Hours',
              lines: ['Tue–Sun: 7 AM – 6 PM', 'Mon: Closed'],
            },
            {
              icon: '📞',
              title: 'Contact',
              lines: ['+975 17 xxx xxx', 'hello@lafarine.bt'],
            },
          ].map(({ icon, title, lines }) => (
            <div
              key={title}
              className="bg-brown-900 border border-brown-800 p-8"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-serif text-lg text-cream-200 mb-2">{title}</h3>
              {lines.map((l) => (
                <p key={l} className="font-sans text-xs text-cream-500 leading-relaxed">
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p className="font-sans text-[10px] tracking-widest uppercase text-brown-600">
          © {new Date().getFullYear()} La Farine Artisan Bakery — Made with love in Thimphu
        </p>
      </div>
    </section>
  );
}
