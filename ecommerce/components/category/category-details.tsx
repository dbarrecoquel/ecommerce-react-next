"use client";
import { useSubCategoryDetails } from "@/contexts/subcategory-details.context";
import { useEffect, useRef } from "react";
import ProductList from "../product/category-product-list";


export default function SubCategoryDetails({ parentCategoryId , id }: {parentCategoryId: number, id : number }) {
  const { loadSubCategoryDetails } = useSubCategoryDetails();
  useEffect(() => {
    loadSubCategoryDetails(parentCategoryId, id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ProductList></ProductList>
    </>
  );
}