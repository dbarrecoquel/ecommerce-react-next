import { CheckoutProvider } from "@/contexts/checkout.context";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutProvider>
      <main className="main-content">{children}</main>
    </CheckoutProvider>
  );
}