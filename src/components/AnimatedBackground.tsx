/**
 * A deliberately quiet background: one soft aurora glow + a fading grid.
 * No fast-moving blobs, no noise — premium minimalism.
 */
export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* subtle grid — cross-fades on theme change */}
      <div className="absolute inset-0 bg-grid-dark dark:opacity-100 opacity-0 bg-[size:56px_56px] mask-radial transition-opacity duration-500 ease-out" />
      <div className="absolute inset-0 bg-grid-light dark:opacity-0 opacity-100 bg-[size:56px_56px] mask-radial transition-opacity duration-500 ease-out" />

      {/* top aurora */}
      <div
        className="absolute left-1/2 top-[-20%] h-[620px] w-[1100px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
        }}
      />

      {/* subtle accent glow, lower right */}
      <div
        className="absolute right-[-10%] top-[30%] h-[520px] w-[520px] blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, hsl(var(--accent) / 0.14) 0%, transparent 70%)',
        }}
      />

      {/* bottom fade keeps footer clean */}
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
