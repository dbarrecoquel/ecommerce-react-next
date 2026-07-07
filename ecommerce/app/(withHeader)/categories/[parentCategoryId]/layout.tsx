import { SubCategoryProvider } from "@/contexts/subcategory.context";

export default function SubCategoryLayout({ children }: { children: React.ReactNode }) {
  return <SubCategoryProvider>{children}</SubCategoryProvider>;
}