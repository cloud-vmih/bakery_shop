import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Profile.css';
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  Address,
  CreateAddressPayload,
  deleteAddress,
} from '../services/address.service';
import AddressAutocomplete, {
  AddressResult,
} from '../components/AddressAutocomplete';
import MapProvider from '../components/MapProvider';
import {
  HomeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import ProfileInfo from '../components/ProfileInfo'; 

// Interface cho callback (nếu cần sync data)
interface UserResponse {
  // ... từ user.service.ts
  // Thêm nếu cần: defaultAddress?: Address; (để sync)
}

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses(); 
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddAddress = async () => {
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ');
      return;
    }

    try {
      setIsLoadingAddresses(true);
      const hasExistingAddresses = addresses.length > 0;
      const payload: CreateAddressPayload = {
        placeId: selectedAddress.placeId || '',
        fullAddress: selectedAddress.fullAddress,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
        ...(hasExistingAddresses && isDefaultAddress ? { isDefault: true } : {}),
      };

      await createAddress(payload);
      toast.success('Thêm địa chỉ thành công');
      setShowAddAddressForm(false);
      setSelectedAddress(null);
      setIsDefaultAddress(false);
      setShowDefaultConfirm(false);
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || 'Không thể thêm địa chỉ');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress(address);
    const hasExistingAddresses = addresses.length > 0;
    if (hasExistingAddresses) {
      setShowDefaultConfirm(true);
    }
  };

  const handleEditAddress = async (addressId: number, updatedAddress: AddressResult) => {
    try {
      setIsLoadingAddresses(true);
      const payload: Partial<CreateAddressPayload> = {
        placeId: updatedAddress.placeId || '',
        fullAddress: updatedAddress.fullAddress,
        lat: updatedAddress.lat,
        lng: updatedAddress.lng,
      };

      await updateAddress(addressId, payload);
      toast.success('Cập nhật địa chỉ thành công');
      setEditingAddressId(null);
      setSelectedAddress(null);
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật địa chỉ');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      setIsLoadingAddresses(true);
      await setDefaultAddress(addressId);
      toast.success('Đã đặt địa chỉ mặc định');
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || 'Không thể đặt địa chỉ mặc định');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const getDefaultAddress = () => {
    return addresses.find((addr) => addr.isDefault) || null;
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      setIsLoadingAddresses(true);
      await deleteAddress(addressId);
      toast.success("Xóa địa chỉ thành công");
      await fetchAddresses();
      setDeletingAddressId(null);
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa địa chỉ");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // THÊM CALLBACK ĐỂ SYNC DATA TỪ PROFILEINFO
  const handleProfileUpdate = (updatedProfile: UserResponse) => {
    console.log('Profile updated:', updatedProfile);
  };
  const defaultAddress = getDefaultAddress();

  return (
    <MapProvider>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="profile-header-title">Hồ sơ cá nhân</h1>
            <p className="profile-header-desc">Quản lý thông tin cá nhân và sổ địa chỉ của bạn</p>
          </div>

          {/* GỌI COMPONENT PROFILEINFO */}
          <ProfileInfo 
            onProfileUpdate={handleProfileUpdate} // Truyền callback nếu cần sync
          />

          <div className="profile-actions">
            <button
                onClick={() => navigate('/change-password')}
                className="change-password-btn"
            >
                <LockClosedIcon className="btn-icon" /> Đổi mật khẩu
            </button>
        </div>

          <div className="addresses-card">
            <div className="addresses-header">
              <h2 className="addresses-header-title">
                <HomeIcon className="profile-card-icon" /> Sổ địa chỉ
              </h2>
              <button
                onClick={() => {
                  setShowAddAddressForm(true);
                  setEditingAddressId(null);
                  setSelectedAddress(null);
                }}
                className="add-address-btn"
              >
                <PlusIcon className="btn-icon" /> Thêm địa chỉ
              </button>
            </div>

            <div className="addresses-content">
              {isLoadingAddresses ? (
                <p className="addresses-loading">Đang tải địa chỉ...</p>
              ) : addresses.length === 0 ? (
                <p className="addresses-empty">Chưa có địa chỉ nào. Hãy thêm địa chỉ giao hàng của bạn!</p>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-item ${addr.isDefault ? 'address-item-default' : 'address-item-normal'}`}
                    >
                      <div className="address-info">
                        <div className="address-details">
                          <h4 className="address-title">{addr.fullAddress.split(',')[0]}</h4>
                          <p className="address-description">{addr.fullAddress.split(',').slice(1).join(', ')}</p>
                        </div>
                        {addr.isDefault && <span className="default-badge">Mặc định</span>}
                      </div>

                      <div className="address-actions">
                        <button onClick={() => setEditingAddressId(addr.id!)} className="edit-address-btn">
                          <PencilIcon className="edit-icon" /> Sửa
                        </button>
                        {!addr.isDefault && ( // Không cho xóa default address
                          <button onClick={() => setDeletingAddressId(addr.id!)} className="delete-address-btn">
                            <TrashIcon className="edit-icon" /> Xóa
                          </button>
                        )}
                      </div>

                      {editingAddressId === addr.id && (
                        <div className="mt-4">
                          <AddressAutocomplete
                            placeholder="Cập nhật địa chỉ..."
                            onSelect={(newAddr) => handleEditAddress(addr.id!, newAddr)}
                          />
                          <button onClick={() => setEditingAddressId(null)} className="mt-2 px-4 py-2 bg-gray-500 text-white text-sm rounded-lg">
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {showAddAddressForm && (
                <div className="add-address-form">
                  <h3 className="add-address-form-title">Thêm địa chỉ mới</h3>
                  <AddressAutocomplete
                    placeholder="Tìm kiếm địa chỉ..."
                    onSelect={handleAddressSelect}
                  />

                  {showDefaultConfirm && selectedAddress && (
                    <div className="default-confirm">
                      <p className="default-confirm-desc">Bạn có muốn đặt địa chỉ này làm mặc định không?</p>
                      <div className="default-confirm-actions">
                        <button onClick={() => { setIsDefaultAddress(true); setShowDefaultConfirm(false); }} className="default-yes-btn">
                          Có
                        </button>
                        <button onClick={() => { setIsDefaultAddress(false); setShowDefaultConfirm(false); }} className="default-no-btn">
                          Không
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedAddress && (
                    <div className="selected-address">
                      <p className="selected-address-label">Đã chọn:</p>
                      <p className="selected-address-value">{selectedAddress.fullAddress}</p>
                    </div>
                  )}

                  <div className="add-form-actions">
                    <button onClick={handleAddAddress} disabled={!selectedAddress || isLoadingAddresses} className="save-address-btn">
                      {isLoadingAddresses ? 'Đang lưu...' : 'Lưu địa chỉ'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddAddressForm(false);
                        setSelectedAddress(null);
                        setShowDefaultConfirm(false);
                      }}
                      className="cancel-add-btn"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {deletingAddressId && (
            <div className="delete-modal">
              <div className="delete-modal-content">
                <h3 className="delete-modal-title">Xác nhận xóa</h3>
                <p className="delete-modal-desc">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                <div className="delete-address-display">
                  {addresses.find(a => a.id === deletingAddressId)?.fullAddress}
                </div>
                <div className="delete-actions">
                  <button onClick={() => handleDeleteAddress(deletingAddressId)} disabled={isLoadingAddresses} className="confirm-delete-btn">
                    {isLoadingAddresses ? 'Đang xóa...' : 'Xóa'}
                  </button>
                  <button onClick={() => setDeletingAddressId(null)} className="cancel-delete-btn">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MapProvider>
  );
};

export default ProfilePage;