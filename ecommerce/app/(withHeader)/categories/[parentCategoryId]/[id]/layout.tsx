import { ProductsSearchProvider } from "@/contexts/products.context";
import { SubCategoryDetailsProvider } from "@/contexts/subcategory-details.context";

export default function SubCategoryDetailsLayout({ children }: { children: React.ReactNode }) {
  return (<SubCategoryDetailsProvider>
       <ProductsSearchProvider>
       {children}
       </ProductsSearchProvider>
    </SubCategoryDetailsProvider>);
}