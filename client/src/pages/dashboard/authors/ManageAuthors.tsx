import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetchFilteredAuthorsQuery, useUpdateAuthorMutation, useDeleteAuthorMutation } from '../../../redux/features/admin/adminApi';
import { FaSearch, FaUser, FaEdit, FaTrash, FaGlobe, FaWindowClose, FaCheck, FaSortAmountDown } from 'react-icons/fa';
import Pagination from '../../../components/Pagination';
import { Link } from 'react-router-dom';
import { ADMIN } from '../../../constants/nav-routes/adminRoutes';
import ImageUploader from '../../../components/ImageUploader';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { AuthorResponseDto } from '../../../types/admin';

interface UpdateAuthorForm {
  name: string;
  bio: string;
  website?: string;
  featured?: boolean;
}

const ManageAuthors: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateAuthorForm>();
  
  const { data: authorsResponse, isLoading } = useFetchFilteredAuthorsQuery({ page, sort, search });
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();
  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
      folder: "author-profiles",
    });

  const handleEdit = (author: AuthorResponseDto) => {
    setEditingId(author.id);
    const existingImage = author.profileImage || null;
    setCurrentImage(existingImage);
    reset({
      name: author.name || '',
      bio: author.bio || '',
      website: author.website || '',
      featured: author.isFeatured || false
    });
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
  };

  const onSubmit = async (formData: UpdateAuthorForm) => {
    if (!editingId) {
      return;
    }
    try {
      const updateData: UpdateAuthorForm & { isFeatured?: boolean; profileImage?: string } = { ...formData };
      
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        updateData.profileImage = uploadRes.secure_url;
      }
      
      await updateAuthor({ id: editingId, ...updateData, isFeatured: formData.featured }).unwrap();
      setEditingId(null);
      setCurrentImage(null);
      reset();
    } catch (error) {
      console.error('Failed to update author:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAuthor(id).unwrap();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete author:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCurrentImage(null);
    reset();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const authors: AuthorResponseDto[] = authorsResponse?.authors || [];
  const totalPages = authorsResponse?.totalPages || 1;
  const currentPage = authorsResponse?.currentPage || 1;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Authors</h1>
          <p className="text-gray-600">View and manage all authors</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search authors by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="">All Authors</option>
              <option value="featured">Featured First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {authors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No authors found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {editingId === author.id ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        {...register('bio', { required: 'Bio is required' })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        {...register('website', {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL'
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      {errors.website && (
                        <p className="text-red-600 text-sm mt-1">{errors.website.message}</p>
                      )}
                    </div>
                    {/* Featured Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register("featured")}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          Featured Author
                        </span>
                      </label>
                    </div>

                    {/* Profile Image Section */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Profile Image
                      </label>
                      
                      {currentImage ? (
                        <div className="relative group">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 transition-all duration-300">
                            <div className="relative overflow-hidden rounded-lg flex justify-center">
                              <img
                                src={currentImage}
                                alt="Author Profile"
                                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="mt-4 w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="transition-all duration-300">
                          <ImageUploader label="" onSelect={handleImageSelect} />
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    {uploading && (
                      <div className="space-y-2 animate-fadeIn">
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                          <div
                            className="flex h-full items-center justify-center rounded-full
                                       bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
                                       text-[10px] font-semibold text-white
                                       transition-all duration-500 ease-out shadow-md"
                            style={{ width: `${progress}%` }}
                          >
                            {progress > 15 && `${progress}%`}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">Uploading image...</span>
                          <span className="text-blue-600 font-bold">{progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        <FaCheck className="w-4 h-4" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FaWindowClose className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start gap-4">
                    <Link to={`${ADMIN.MANAGE_AUTHORS}/${author.id}`}>
                      <div className="flex-shrink-0">
                        {author.profileImage ? (
                          <img
                            src={author.profileImage}
                            alt={author.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <FaUser className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`${ADMIN.MANAGE_AUTHORS}/${author.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:underline hover:text-gray-600">
                            {author.name}
                          </h3>
                        </Link>
                        {author.isFeatured && (
                          <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      {author.bio && (
                        <p className="text-gray-600 mb-2 line-clamp-2">{author.bio}</p>
                      )}
                      {author.website && (
                        <a
                          href={author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <FaGlobe className="w-4 h-4" />
                          {author.website}
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit author"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(author.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete author"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Author</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this author? All associated content will be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAuthors;