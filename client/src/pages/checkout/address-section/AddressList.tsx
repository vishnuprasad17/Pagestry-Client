import React, { useEffect, useState } from 'react';
import { useFetchAddressesQuery } from '../../../redux/features/address/addressApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCheckoutAddress } from '../../../redux/features/slices/checkoutSlice';
import EditAddressForm from './EditAddress';
import AddAddressForm from './AddAddress';
import { useNavigate } from 'react-router-dom';
import { HiCheck, HiPencil, HiPlus } from 'react-icons/hi';
import { AppDispatch, RootState } from '../../../redux/store';
import { AddressData } from '../../../types/address';

const AddressList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedAddressId = useSelector((state: RootState) => state.checkout.selectedAddressId);
  const { data: addresses = [], isLoading, refetch } = useFetchAddressesQuery(user?.mongoUserId as string, {
    skip: !user?.mongoUserId,
  });

  const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(selectedAddressId || addresses.find(a => a.isDefault)?.id);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [addingAddress, setAddingAddress] = useState<boolean>(false);

  useEffect(() => {
  if (!tempSelectedId && addresses.length > 0) {
    const defaultAddr = addresses.find(a => a.isDefault);
    setTempSelectedId(defaultAddr?.id ?? addresses[0].id);
  }
}, [addresses, tempSelectedId]);

  const handleSelectAddress = (addressId: string) => {
    setTempSelectedId(addressId);
  };

  const handleContinueToCheckout = () => {
    if (tempSelectedId) {
      dispatch(setCheckoutAddress(tempSelectedId));
      navigate('/checkout');
    }
  };

  const handleEditAddress = (address: AddressData, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingAddress(address);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  const handleEditSuccess = () => {
    setEditingAddress(null);
    refetch();
  };

  const handleAddAddress = () => {
    setAddingAddress(true);
  };

  const handleCancelAdd = () => {
    setAddingAddress(false);
  };

  const handleAddSuccess = () => {
    setAddingAddress(false);
    refetch();
  };

  // Show edit form if editing
  if (editingAddress) {
    return (
      <EditAddressForm 
        address={editingAddress}
        onCancel={handleCancelEdit}
        onSuccess={handleEditSuccess}
      />
    );
  }

  // Show add form if adding
  if (addingAddress) {
    return (
      <AddAddressForm
        onCancel={handleCancelAdd}
        onSuccess={handleAddSuccess}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Select a delivery address</h1>
          <p className="text-sm text-gray-600 mt-1">Choose from your saved addresses</p>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No addresses found</p>
              <button
                onClick={() => navigate('/user-dashboard/address/add')}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <HiPlus className="w-5 h-5" />
                Add New Address
              </button>
            </div>
          ) : (
            <>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleSelectAddress(address.id)}
                  className={`bg-white p-5 rounded-lg shadow cursor-pointer transition-all relative
                    ${tempSelectedId === address.id 
                      ? 'ring-2 ring-black border-2 border-black' 
                      : 'border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {/* Selection Indicator */}
                  {tempSelectedId === address.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <HiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="pr-10">
                    {/* Name and Default Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-300">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address Details */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      {address.landmark && (
                        <p>Landmark: {address.landmark}</p>
                      )}
                      <p>
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                      <p className="font-medium text-gray-900 mt-2">
                        Phone: {address.phone}
                      </p>
                    </div>

                    {/* Edit Button */}
                    {tempSelectedId === address.id && (
                      <button
                        onClick={(e) => handleEditAddress(address, e)}
                        className="mt-3 text-sm text-gray-700 hover:text-black font-medium inline-flex items-center gap-1"
                      >
                        <HiPencil className="w-4 h-4" />
                        Edit address
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Address Card */}
              <div
                onClick={() => handleAddAddress()}
                className="bg-white p-5 rounded-lg shadow border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 text-gray-700 hover:text-black">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <HiPlus className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Add a new address</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Continue Button - Sticky at bottom */}
        {addresses.length > 0 && tempSelectedId && (
          <div className="sticky bottom-0 mt-6 bg-white border-t border-gray-200 p-4 -mx-4 shadow-lg">
            <div className="max-w-4xl mx-auto px-4">
              <button
                onClick={handleContinueToCheckout}
                disabled={!tempSelectedId}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;