import { useForm } from "react-hook-form";
import { useUpdateUserMutation, useGetUserQuery } from "../../redux/features/user/userApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/InputBox";
import { useEffect, useState } from "react";
import { USER } from "../../constants/nav-routes/userRoutes";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import ImageUploader from "../../components/ImageUploader";
import { UpdateData } from "../../types/user";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface EditUserFormValues {
  name: string;
  profileImage: string;
  authProvider: string;
}

const EditProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: userData, isLoading: isFetching } = useGetUserQuery();
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(userData?.profileImage || null);
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "user-profiles",
    context: "userSide",
  });
  const navigate = useNavigate();

  const canEditName = userData?.authProvider === "password";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserFormValues>({
    mode: "onChange",
    shouldFocusError: true,
    reValidateMode: "onChange"
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        profileImage: userData.profileImage,
        authProvider: userData.authProvider,
      });
      setCurrentImage(userData.profileImage || null);
    }
  }, [userData, reset]);

  const handleRemoveImage = () => {
    setCurrentImage(null);
    setImageFile(null);
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
    }
  };

  const onSubmit = async (formData: EditUserFormValues) => {
    if (!user?.mongoUserId) {
      toast.error("Something went wrong, please refresh the page");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a cover image");
      return;
    }

    try {
      const uploadRes = await uploadImage(imageFile);

      const updatedData: UpdateData = {
        profileImage: uploadRes.secure_url,
      };

      if (canEditName) {
        updatedData.name = formData.name;
      }

      const res = await updateUser({ userId: user.mongoUserId, data: updatedData });
      toast.success(res.data?.message || "Profile updated successfully");
      navigate(USER.USER_DASHBOARD);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <p className="text-gray-600">User details not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto md:p-8 p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6">
          <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
          <p className="text-blue-100 mt-1">Edit your details and information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="space-y-5">
            {/* Name Field - Editable only for password auth */}
            <div className="relative">
              <Input
                label="Full name (First and Last name)"
                error={errors.name}
                disabled={!canEditName}
                {...register("name", {
                  required: "Please enter a name",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                  maxLength: { value: 20, message: "Name cannot exceed 20 characters" },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Name can only contain letters",
                  },
                  validate: (v) => v.trim().length > 0 || "Please enter a valid name",
                })}
              />
              {!canEditName && (
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Name cannot be changed for {userData.authProvider === "google.com" ? "Google" : "social"} sign-in accounts
                </p>
              )}
            </div>

            {/* Username Field - Read-only Display */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-3 bg-gray-100 text-gray-700 cursor-not-allowed opacity-60">
                {userData.username}
              </div>
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Username cannot be changed
              </p>
            </div>

            {/* Image Section */}
            <div className="space-y-3">
              {currentImage ? (
                <div className="relative group">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 transition-all duration-300">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={currentImage}
                        alt="Profile"
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
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
                  <ImageUploader label="Profile Image" onSelect={handleImageSelect} />
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
          </div>

          <button
            type="submit"
            disabled={isUpdating || uploading}
            className="w-full py-3 px-6 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isUpdating || uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;