import React from 'react';
import { FaUser, FaGlobe } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { useFetchSingleAuthorQuery } from '../../../redux/features/admin/adminApi';
import { useNavigate, useParams } from 'react-router-dom';
import { ADMIN } from '../../../constants/nav-routes/adminRoutes';

const Author: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) {
      navigate(ADMIN.MANAGE_AUTHORS);
      return null;
    }
    const { data: author, isLoading, isError } = useFetchSingleAuthorQuery(id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LuLoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (isError || !author) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">Unable to load author profile</p>
                    <p className="text-gray-400 text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-8">
                        {author.profileImage ? (
                            <img 
                                src={author.profileImage} 
                                alt={author.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                                <FaUser className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Author Name */}
                    <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
                        {author.name}
                    </h1>

                    {/* Bio */}
                    {author.bio && (
                        <div className="mb-8">
                            <p className="text-gray-600 leading-relaxed text-center max-w-2xl mx-auto">
                                {author.bio}
                            </p>
                        </div>
                    )}

                    {/* Website */}
                    {author.website && (
                        <div className="flex justify-center">
                            <a 
                                href={author.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <FaGlobe className="w-4 h-4" />
                                <span className="text-sm font-medium">Visit Website</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Author;