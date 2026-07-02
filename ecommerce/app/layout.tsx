import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CatalogProvider } from "@/contexts/category.context";


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
        <CatalogProvider>
          {children}
        </CatalogProvider>
        </body>
    </html>
  );
}
