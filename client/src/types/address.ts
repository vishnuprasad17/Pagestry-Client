// Create Address
interface AddressData {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
}
interface CreateAddressResponse {
  success: true;
  data: AddressData;
  message: string;
}

interface CreateAddressArgs {
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

// Fetch Addresses
interface FetchAddressesResponse {
  success: boolean;
  data: AddressData[];
  message: string;
}

// Fetch Address
interface FetchAddressResponse {
  success: boolean;
  data: AddressData;
  message: string;
}

// Update Address
interface UpdateAddressResponse {
  success: boolean;
  data: AddressData;
  message: string;
}
interface UpdateData {
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}
interface UpdateAddressArgs {
  id: string;
  address: UpdateData;
}

// Make Address Default
interface MakeAddressDefaultResponse {
  success: boolean;
  data: AddressData;
  message: string;
}

interface MakeAddressDefaultArgs {
  id: string;
  userId: string;
}

// Delete Address
interface DeleteAddressResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

export type {
  AddressData,
  CreateAddressResponse,
  CreateAddressArgs,
  FetchAddressesResponse,
  FetchAddressResponse,
  UpdateAddressResponse,
  UpdateAddressArgs,
  MakeAddressDefaultResponse,
  MakeAddressDefaultArgs,
  DeleteAddressResponse
};
