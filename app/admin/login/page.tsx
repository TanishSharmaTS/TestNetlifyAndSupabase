import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brown-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-script text-4xl text-cream-400">La Farine</span>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-brown-500 mt-1">
            Admin Panel
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
