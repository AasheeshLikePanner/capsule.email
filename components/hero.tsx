export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/background1.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full">
        {/* Content will go here */}
      </div>
    </div>
  );
}
