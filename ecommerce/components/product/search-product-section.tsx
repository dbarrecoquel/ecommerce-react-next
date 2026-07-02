"use client";

import { useProductSearch } from "@/contexts/products.context";
import { ProductSearchParams } from "@/models/product.model";
import { useEffect, useRef } from "react";
import ProductsSearch from "./search-product-list";

interface ProductSearchSectionProps {
  params: ProductSearchParams;
}

export default function ProductSearchSection({ params }:ProductSearchSectionProps){
    const {loadProducts} = useProductSearch();
    const initialLoadDone = useRef(false);
    console.log(params);
    useEffect(() => {
        // Charge une seule fois au montage avec les params de l'URL.
        // Les recherches suivantes sont déclenchées par SearchBar directement.
        if (initialLoadDone.current) return;
        initialLoadDone.current = true;
        loadProducts(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(<>
        <ProductsSearch></ProductsSearch>
    </>
  )
}