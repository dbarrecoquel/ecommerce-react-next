import Header from "@/components/header/header";

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}