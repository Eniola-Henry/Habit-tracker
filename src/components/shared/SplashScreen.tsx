export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,111,255,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-8 animate-fade-up">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-7"
          style={{
            background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)',
            boxShadow: '0 0 60px rgba(124,111,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18L14 25L29 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '2.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f0f0f8 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
          }}
        >
          Habit Tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 300 }}>
          Build streaks. Build yourself.
        </p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--accent)',
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
