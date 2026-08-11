import {
  Category,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../../types/category';
import { CategoryRepository } from '../interfaces/CategoryRepository';
import { apiClient } from '../../services/api/apiClient';

interface ApiCategoryItem {
  id: string;
  name: string;
  type: string;
  icon?: string | null;
  color?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiCategoryListResponse {
  items: ApiCategoryItem[];
}

function mapCategoryFromApi(item: ApiCategoryItem): Category {
  return {
    id: item.id,
    name: item.name,
    type: item.type.toLowerCase() as CategoryType,
    icon: item.icon || 'folder',
    colorToken: item.color || '#3B82F6',
    isDefault: true,
    isActive: item.is_active,
  };
}

export class ApiCategoryRepository implements CategoryRepository {
  async getCategories(type?: CategoryType): Promise<Category[]> {
    try {
      const query = type ? `?type=${type.toUpperCase()}` : '';
      const data = await apiClient.request<ApiCategoryListResponse>(`/categories${query}`);
      return data.items.map(mapCategoryFromApi);
    } catch (e) {
      console.warn('Failed to fetch categories from API:', e);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const data = await apiClient.request<ApiCategoryItem>(`/categories/${id}`);
      return mapCategoryFromApi(data);
    } catch {
      return null;
    }
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const data = await apiClient.request<ApiCategoryItem>('/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        type: input.type.toUpperCase(),
        icon: input.icon,
        color: input.colorToken,
      }),
    });
    return mapCategoryFromApi(data);
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const body: Record<string, unknown> = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.icon !== undefined) body.icon = input.icon;
    if (input.colorToken !== undefined) body.color = input.colorToken;

    const data = await apiClient.request<ApiCategoryItem>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return mapCategoryFromApi(data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await apiClient.request(`/categories/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  }

  async resetToDefault(): Promise<void> {
    // No-op for real backend
  }
}
