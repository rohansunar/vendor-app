import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import axios from 'axios';
import { VendorProfile } from '../profile.types';
const IMMUTABLE_FIELDS = [
  'id',
  'vendorNo',
  'phone',
  'email',
  'created_at',
  'updated_at',
  'is_active',
  'is_available_today',
];

export async function fetchProfile(): Promise<VendorProfile> {
  const res = await apiClient.get(API_ENDPOINTS.VENDOR_ME);
  return res.data;
}

function getChangedFields(updated: any) {
  const changed: any = {};
  Object.keys(updated).forEach((key) => {
    if (IMMUTABLE_FIELDS.includes(key)) return;
    changed[key] = updated[key];
  });

  return changed;
}

export async function updateProfile(payload: Partial<VendorProfile>) {
  try {
    payload = getChangedFields(payload);
    const res = await apiClient.put(API_ENDPOINTS.VENDOR_ME, payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update profile',
      );
    }

    throw new Error('Unexpected error occurred');
  }
}

export async function updateAvailability(is_available_today: boolean) {
  try {
    await apiClient.put(API_ENDPOINTS.AVAILABILITY, { is_available_today });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update profile',
      );
    }

    throw new Error('Unexpected error occurred');
  }
}
