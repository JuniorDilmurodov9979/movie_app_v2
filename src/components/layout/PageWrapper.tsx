export default function PageWrapper({ children }) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      {children}
    </div>
  );
}