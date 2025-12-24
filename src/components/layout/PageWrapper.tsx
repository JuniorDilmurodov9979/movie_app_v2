type PageWrapperProps = {
  children: React.ReactNode
}
export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      {children}
    </div>
  );
}