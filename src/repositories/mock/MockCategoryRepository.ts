import {
  Category,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../../types/category';
import { CategoryRepository } from '../interfaces/CategoryRepository';
import initialCategories from '../../data/mock/categories.json';

export class MockCategoryRepository implements CategoryRepository {
  private categories: Category[] = [...(initialCategories as Category[])];

  async getCategories(type?: CategoryType): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (!type) return [...this.categories];
    return this.categories.filter(c => c.type === type);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 30));
    const cat = this.categories.find(c => c.id === id);
    return cat ? { ...cat } : null;
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      type: input.type,
      icon: input.icon,
      colorToken: input.colorToken,
      isDefault: false,
      isActive: true,
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updated: Category = {
      ...this.categories[index],
      ...input,
    };
    this.categories[index] = updated;
    return { ...updated };
  }

  async deleteCategory(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);
    return this.categories.length < initialLength;
  }

  async resetToDefault(): Promise<void> {
    this.categories = [...(initialCategories as Category[])];
  }
}
