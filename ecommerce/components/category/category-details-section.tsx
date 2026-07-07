"use client";

import SubCategoryDetails from "./category-details";
import Pagination from "@/components/pagination/pagination";
import { useSubCategoryDetails } from "@/contexts/subcategory-details.context";

interface CategorySectionProps {
  parentCategoryId: number;
  id: number;
}

export default function CategoryDetailsSection({ parentCategoryId, id }: CategorySectionProps) {
  const { subCategoryDetails, searchParams, loadSubCategoryDetails } = useSubCategoryDetails();

  // Mapper SubCategoryDetails → PaginatedData attendu par Pagination
  const paginatedData = subCategoryDetails ? {
    page: subCategoryDetails.number,      // "number" dans Spring = numéro de page
    totalPages: subCategoryDetails.totalPages,
    last: !subCategoryDetails.first && subCategoryDetails.number === subCategoryDetails.totalPages - 1,
  } : null;
  const handlePageChange = (p: number) => {
    loadSubCategoryDetails(parentCategoryId, id, { ...searchParams, page: p });
  };
  return (
    <>
      <SubCategoryDetails parentCategoryId={parentCategoryId} id={id} />
      <Pagination
        data={paginatedData}
        basePath={`/categories/${parentCategoryId}/${id}`}
        extraParams={searchParams}
        onPageChange={handlePageChange}
      />
    </>
  );
}