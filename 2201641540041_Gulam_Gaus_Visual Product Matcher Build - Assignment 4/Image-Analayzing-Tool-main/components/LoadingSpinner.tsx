export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative w-12 h-12">
        {/* 8 dots around the circle */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            style={{
              top: `${50 + 40 * Math.sin((i * 45 * Math.PI) / 180)}%`,
              left: `${50 + 40 * Math.cos((i * 45 * Math.PI) / 180)}%`,
              transform: "translate(-50%, -50%)",
              animation: `spin 1.2s linear infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes spin {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
