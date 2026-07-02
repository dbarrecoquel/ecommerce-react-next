import { SubCategoryDetailsProvider } from "@/contexts/subcategory-details.context";

export default function SubCategoryDetailsLayout({ children }: { children: React.ReactNode }) {
  return <SubCategoryDetailsProvider>{children}</SubCategoryDetailsProvider>;
}