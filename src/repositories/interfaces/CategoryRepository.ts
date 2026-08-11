import {
  Category,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../../types/category';

export interface CategoryRepository {
  getCategories(type?: CategoryType): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(input: CreateCategoryInput): Promise<Category>;
  updateCategory(id: string, input: UpdateCategoryInput): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
  resetToDefault(): Promise<void>;
}
