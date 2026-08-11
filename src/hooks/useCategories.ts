import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryType, CreateCategoryInput, UpdateCategoryInput } from '../types/category';
import { categoryRepository } from '../repositories';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

export function useCategories(type?: CategoryType) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoryRepository.getCategories(type),
    enabled: isAuthenticated,
  });
}

export function useCategory(id?: string) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['category', id],
    queryFn: () => (id ? categoryRepository.getCategoryById(id) : null),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryRepository.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Category created successfully', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to create category', 'error');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryRepository.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Category updated', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update category', 'error');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (id: string) => categoryRepository.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Category removed', 'info');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to delete category', 'error');
    },
  });
}
