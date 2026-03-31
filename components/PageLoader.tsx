export default function PageLoader() {
  return (
    <div className="absolute inset-0 z-20 bg-white flex items-center justify-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#219e02]/20 border-t-[#219e02] animate-spin [animation-duration:1s]" />
        {/* Static green logo */}
        <img
          src="/logoWhite.svg"
          alt="Loading..."
          className="w-10 h-10 object-contain"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(97%) contrast(50%)",
          }}
        />
      </div>
    </div>
  );
}
