import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useFetchCategoriesQuery } from '../../../redux/features/admin/adminApi';
import { FaPencilAlt, FaTrash, FaPlus, FaWindowClose } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { CategoryData } from '../../../types/category';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface CategoryForm {
  name: string;
  icon: string;
}

const Category: React.FC = () => {
  const { data: categories = [], isLoading, error } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryForm>();

  const onSubmit = async (formData: CategoryForm) => {
    try {
      if (editingCategory) {
        await updateCategory({ 
          id: editingCategory.id, 
          data: formData 
        }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      closeModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save category. Please try again.'));
    }
  };

  const openEditModal = (category: CategoryData) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('icon', category.icon);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2 text-center">Error Loading Categories</h2>
          <p className="text-red-600 text-center">{err.data?.message || 'Failed to load categories'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Categories</h1>
            <p className="text-slate-600">Manage your content categories</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-950 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus size={20} />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">{category.icon}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaPencilAlt size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No categories yet</h3>
            <p className="text-slate-500 mb-6">Create your first category to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <FaPlus size={18} />
              Create First Category
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaWindowClose size={24} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  {...register('icon', { required: 'Icon is required' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter emoji (e.g., 🎨)"
                  maxLength={2}
                />
                {errors.icon && (
                  <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isCreating || isUpdating}
                >
                  {(isCreating || isUpdating) ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Category?</h2>
              <p className="text-slate-600">This action cannot be undone.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;