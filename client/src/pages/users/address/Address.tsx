import React, { useState } from 'react';
import { useFetchAddressesQuery, useDeleteAddressMutation, useMakeDefaultMutation } from '../../../redux/features/address/addressApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMapPin, FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { RootState } from '../../../redux/store';
import { USER } from '../../../constants/nav-routes/userRoutes';

const Address: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: addresses = [], isLoading } = useFetchAddressesQuery(user?.mongoUserId!, {
    skip: !user?.mongoUserId,
  });

  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useMakeDefaultMutation();
  const navigate = useNavigate();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  
  const MAX_ADDRESSES = 4;

  const handleAddNew = (): void => {
    if (addresses.length >= MAX_ADDRESSES) {
      toast.error(`You can only add up to ${MAX_ADDRESSES} addresses`);
      return;
    }
    navigate(USER.ADD_ADDRESS);
  };

  const handleEdit = (addressId: string): void => {
    navigate(`${USER.EDIT_ADDRESS}/${addressId}`);
  };

  const openDeleteModal = (addressId: string): void => {
    setAddressToDelete(addressId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = (): void => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!addressToDelete) return;

    try {
      await deleteAddress(addressToDelete).unwrap();
      toast.success('Address deleted successfully');
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string): Promise<void> => {
    if (!user?.mongoUserId) {
      toast.error('User not logged in');
      return;
    }

    try {
      await setDefaultAddress({id: addressId, userId: user?.mongoUserId}).unwrap();
      toast.success('Default address updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to set default address');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading addresses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Your Addresses</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded shadow-sm transition-colors"
            >
              <FaPlus size={16} />
              Add New Address
            </button>
          </div>

          {/* Address Count */}
          <p className="text-sm text-gray-600 mb-6">
            {addresses.length} of {MAX_ADDRESSES} addresses saved
          </p>

          {/* Addresses Grid */}
          {addresses.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
              <FaMapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
              <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-6 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded shadow-sm transition-colors"
              >
                <FaPlus size={16} />
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white border rounded-lg p-5 hover:shadow-md transition-shadow ${
                    address.isDefault ? 'border-black border-2' : 'border-gray-300'
                  }`}
                >
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-medium rounded">
                        <FaCheck size={10} />
                        Default
                      </span>
                    </div>
                  )}

                  {/* Address Details */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{address.fullName}</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                      <p className="font-medium text-gray-900 mt-2">Phone: {address.phone}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded transition-colors"
                    >
                      <FaEdit size={13} />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => openDeleteModal(address.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      <FaTrash size={13} />
                      Delete
                    </button>

                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={isSettingDefault}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      >
                        <FaCheck size={13} />
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {addresses.length > 0 && addresses.length < MAX_ADDRESSES && (
            <div
              onClick={handleAddNew}
              className="mt-4 bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black hover:bg-gray-50 cursor-pointer transition-all"
            >
              <FaPlus size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Add a new address</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title = "Delete Address"
        message = "Are you sure you want to delete this address?"
        confirmText = "Delete"
        cancelText = "Cancel"
      />
    </>
  );
};

export default Address;