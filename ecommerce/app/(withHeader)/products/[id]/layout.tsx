import { ProductDetailsProvider } from "@/contexts/product-details.context";
export default function ProductDetailsLayout({ children }: { children: React.ReactNode }) {
  return <ProductDetailsProvider>
    {children}
    </ProductDetailsProvider>;
}