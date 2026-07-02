import { ProductsSearchProvider } from "@/contexts/products.context";

export default function ProductsSearchLayout({children} : {children : React.ReactNode})
{
   return (<ProductsSearchProvider>
        {children}
    </ProductsSearchProvider>)    
}