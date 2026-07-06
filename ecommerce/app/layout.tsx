import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CatalogProvider } from "@/contexts/category.context";
import { BasketProvider } from "@/contexts/basket.context";
import Header from "@/components/header/header";


const inter = Inter ({ subsets : ["latin"]});

export const metadata : Metadata = {
  title : "Ecommerce - Annonces produis",
  description : "Trouvez votre produit idéal"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <BasketProvider>
          
          <CatalogProvider>
            <main className="main-content">
            {children}
            </main>
          </CatalogProvider>
          
        </BasketProvider>
        </body>
    </html>
  );
}
