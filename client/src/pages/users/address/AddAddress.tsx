import { useForm } from "react-hook-form";
import { useCreateAddressMutation } from "../../../redux/features/address/addressApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Input from "../../../components/InputBox";
import { RootState } from "../../../redux/store";
import { USER } from "../../../constants/nav-routes/userRoutes";

interface AddAddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddAddress: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [AddAddress, { isLoading }] = useCreateAddressMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAddressFormData>({
    mode: "onChange",
    shouldFocusError: true,
    reValidateMode: "onChange",
    defaultValues: {
      country: "India",
      isDefault: false,
    },
  });

  const onSubmit = async (formData: AddAddressFormData) => {
    if (!user?.mongoUserId) {
      toast.error("User not logged in");
      return;
    }

    try {
      const res = await AddAddress({
        userId: user.mongoUserId,
        ...formData,
      }).unwrap();

      toast.success(res.message || "Address added successfully");
      navigate(USER.ADDRESS);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add address");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-gray-900">Add a new address</h1>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-300 rounded-lg">
          <div className="p-6 space-y-5">
            {/* Full Name */}
            <Input
              label="Full name (First and Last name)"
              error={errors.fullName}
              {...register("fullName", {
                required: "Please enter a name",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
                maxLength: { value: 40, message: "Name cannot exceed 40 characters" },
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Name can only contain letters",
                },
                validate: (v) => v.trim().length > 0 || "Please enter a valid name",
              })}
            />

            {/* Phone Number */}
            <Input
              label="Mobile number"
              error={errors.phone}
              placeholder="10-digit mobile number"
              {...register("phone", {
                required: "Please enter a mobile number",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              })}
            />

            {/* Address Line 1 */}
            <Input
              label="Flat, House no., Building, Company, Apartment"
              error={errors.addressLine1}
              {...register("addressLine1", {
                required: "Please enter an address",
                minLength: { value: 10, message: "Address must be at least 10 characters" },
                maxLength: { value: 100, message: "Address cannot exceed 100 characters" },
                validate: (v) => v.trim().length > 0 || "Please enter a valid address",
              })}
            />

            {/* Address Line 2 */}
            <Input
              label="Area, Street, Sector, Village"
              error={errors.addressLine2}
              {...register("addressLine2", {
                maxLength: { value: 100, message: "Address cannot exceed 100 characters" },
              })}
            />

            {/* Landmark */}
            <Input
              label="Landmark"
              error={errors.landmark}
              placeholder="E.g. near Apollo hospital"
              {...register("landmark", {
                maxLength: { value: 50, message: "Landmark cannot exceed 50 characters" },
              })}
            />

            {/* City and State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Town/City"
                error={errors.city}
                {...register("city", {
                  required: "Please enter a city name",
                  minLength: { value: 2, message: "City must be at least 2 characters" },
                  maxLength: { value: 30, message: "City cannot exceed 30 characters" },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "City can only contain letters",
                  },
                  validate: (v) => v.trim().length > 0 || "Please enter a valid city",
                })}
              />

              <Input
                label="State"
                error={errors.state}
                {...register("state", {
                  required: "Please select a state",
                  minLength: { value: 2, message: "State must be at least 2 characters" },
                  maxLength: { value: 30, message: "State cannot exceed 30 characters" },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "State can only contain letters",
                  },
                  validate: (v) => v.trim().length > 0 || "Please enter a valid state",
                })}
              />
            </div>

            {/* ZIP Code */}
            <Input
              label="PIN Code"
              error={errors.zipCode}
              placeholder="6 digits [0-9] PIN code"
              {...register("zipCode", {
                required: "Please enter a PIN code",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit PIN code",
                },
              })}
            />

            {/* Country */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Country/Region
              </label>
              <input
                type="text"
                value="India"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                {...register("country")}
              />
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="isDefault"
                className="mt-1 h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 accent-gray-900"
                {...register("isDefault")}
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Make this my default address
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-2 bg-gray-800 hover:bg-gray-950 text-white text-sm font-medium rounded border border-yellow-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Adding Address..." : "Add Address"}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-600">
          <p>By adding an address, you agree to our privacy notice and conditions of use.</p>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;