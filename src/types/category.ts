export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  colorToken: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  icon: string;
  colorToken: string;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: CategoryType;
  icon?: string;
  colorToken?: string;
  isActive?: boolean;
}
