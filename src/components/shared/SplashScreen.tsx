export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f7f2ea] overflow-hidden">

      {/* soft warm ambient glow (matches your app) */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e7dccb] blur-[120px] opacity-60" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#d8cbb3] blur-[120px] opacity-40" />
      </div>

      {/* subtle grain grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* content */}
      <div className="relative z-10 text-center px-6 animate-fade-up">

        {/* icon */}
        <div className="relative mx-auto w-24 h-24 mb-6">

          <div className="absolute inset-0 rounded-3xl bg-white/40 blur-xl" />

          <div className="relative w-full h-full rounded-3xl bg-white border border-[#e7dccb] flex items-center justify-center shadow-sm">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <path
                d="M7 18L14 25L29 10"
                stroke="#2c2420"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* title */}
        <h1 className="text-4xl font-bold tracking-tight text-[#2c2420]">
          Habit Tracker
        </h1>

        <p className="mt-2 text-sm text-[#7a6f63]">
          Discipline builds identity.
        </p>

        {/* loader */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#2c2420]/60 animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}