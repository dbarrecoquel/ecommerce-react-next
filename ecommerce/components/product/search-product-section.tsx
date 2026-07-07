"use client";

import { useProductSearch } from "@/contexts/products.context";
import { ProductSearchParams } from "@/models/product.model";
import { useEffect, useRef } from "react";
import ProductsSearch from "./search-product-list";
import Pagination from "../pagination/pagination";

interface ProductSearchSectionProps {
  params: ProductSearchParams;
}

export default function ProductSearchSection({ params }: ProductSearchSectionProps) {
  const { loadProducts, products, searchParams } = useProductSearch();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadProducts(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ProductsSearch />
      <Pagination
        data={products}
        basePath="/products"
        extraParams={searchParams}
        onPageChange={(p) => loadProducts({ ...searchParams, page: p })}
      />
    </>
  );
}