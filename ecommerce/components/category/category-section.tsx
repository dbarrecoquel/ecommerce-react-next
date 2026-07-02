"use client";

import { useCatalog } from "@/contexts/category.context";
import { useEffect, useRef } from "react";
import CatalogList from "./category-list";


export default function CatalogSection() {
  const { loadCatalog } = useCatalog();
  useEffect(() => {
    loadCatalog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CatalogList></CatalogList>
    </>
  );
}