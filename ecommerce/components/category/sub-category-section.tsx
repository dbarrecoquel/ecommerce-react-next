"use client";
import { useSubCategory } from "@/contexts/subcategory.context";
import { useEffect,  } from "react";
import SubCategoryList from "./sub-category-list";


export default function SubCategorySection({ parentCategoryId }: {parentCategoryId: string }) {

    const { loadSubCategory } = useSubCategory();

  useEffect(() => {
    loadSubCategory(Number(parentCategoryId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentCategoryId]);

  return (
    <>
      <SubCategoryList></SubCategoryList>
    </>
  );
}