import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/user.service';
import { UserResponse, UpdateUserPayload } from '../services/user.service'; // Import types
import { useUser } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Profile.css';
import {
  getMyAddresses,
  addAddress,
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
  UserCircleIcon,
  HomeIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';


const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  // Address management state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);

  // Form state thủ công
  const [formData, setFormData] = useState<UpdateUserPayload>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatar: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UpdateUserPayload, string>>>({});

  useEffect(() => {
    // if (!token) {
    //   navigate('/login'); // Redirect nếu chưa login
    //   return;
    // }
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
      // Reset form với data khi edit
      if (isEditing) {
        setFormData({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          avatar: data.avatar || '',
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation thủ công (tương đương schema Yup)
  const validateForm = (data: UpdateUserPayload): string[] => {
    const errors: string[] = [];

    // fullName required
    if (!data.fullName?.trim()) errors.push('Tên đầy đủ là bắt buộc');

    // email required + valid
    if (!data.email?.trim()) {
      errors.push('Email là bắt buộc');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Email không hợp lệ');
    }

    // phoneNumber required + 10-11 digits
    if (!data.phoneNumber?.trim()) {
      errors.push('Số điện thoại là bắt buộc');
    } else if (!/^\d{10,11}$/.test(data.phoneNumber)) {
      errors.push('Số điện thoại phải 10-11 chữ số');
    }

    // dateOfBirth required + YYYY-MM-DD format
    if (!data.dateOfBirth?.trim()) {
      errors.push('Ngày sinh là bắt buộc');
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfBirth)) {
      errors.push('Định dạng ngày sinh: YYYY-MM-DD');
    }

    // avatar optional + url nếu có
    if (data.avatar && !/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)$/.test(data.avatar)) {
      errors.push('Avatar phải là URL hợp lệ');
    }

    // Set errors vào state
    const errorObj: Partial<Record<keyof UpdateUserPayload, string>> = {};
    errors.forEach((msg) => {
      // Map message to field (simplified, có thể cải thiện bằng object mapping)
      if (msg.includes('Tên đầy đủ')) errorObj.fullName = msg;
      if (msg.includes('Email')) errorObj.email = msg;
      if (msg.includes('Số điện thoại')) errorObj.phoneNumber = msg;
      if (msg.includes('Ngày sinh')) errorObj.dateOfBirth = msg;
      if (msg.includes('Avatar')) errorObj.avatar = msg;
    });
    setFormErrors(errorObj);

    return errors;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      // Hiển thị errors, không submit
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updated = await updateProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      // Có thể update context auth nếu cần
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth,
        avatar: profile.avatar || '',
      });
      setFormErrors({});
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error khi user type
    if (formErrors[name as keyof UpdateUserPayload]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Address management functions
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

      // Backend tự động xử lý: địa chỉ đầu tiên sẽ tự động là mặc định
      // Từ địa chỉ thứ 2: chỉ gửi isDefault nếu user chọn
      const payload: CreateAddressPayload = {
        placeId: selectedAddress.placeId || '',
        fullAddress: selectedAddress.fullAddress,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
        // Chỉ gửi isDefault nếu đã có địa chỉ và user chọn set làm mặc định
        ...(hasExistingAddresses && isDefaultAddress ? { isDefault: true } : {}),
      };

      await addAddress(payload);
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

    // Nếu đã có địa chỉ, hiển thị confirm dialog để hỏi có muốn set làm mặc định không
    // Địa chỉ đầu tiên: backend tự động set làm mặc định, không cần hỏi
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

  if (isLoading) return <div className="loading">Đang tải thông tin hồ sơ...</div>;
  if (error) return <div className="error">Lỗi: {error} <button onClick={fetchProfile}>Thử lại</button></div>;

  const defaultAddress = getDefaultAddress();

  const handleDeleteAddress = async (addressId: number) => {
    try {
      setIsLoadingAddresses(true);
      await deleteAddress(addressId);
      toast.success("Xóa địa chỉ thành công");
      await fetchAddresses(); // Refresh danh sách
      setDeletingAddressId(null);
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa địa chỉ");
    } finally {
      setIsLoadingAddresses(false);
    }
  };


  return (
    <MapProvider>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="profile-header-title">Hồ sơ cá nhân</h1>
            <p className="profile-header-desc">Quản lý thông tin cá nhân và sổ địa chỉ của bạn</p>
          </div>

          {!isEditing ? (
            <div className="profile-card">
              <div className="profile-card-header">
                <h2 className="profile-card-header-title">
                  <UserCircleIcon className="profile-card-icon" /> Thông tin cá nhân
                </h2>
              </div>

              <div className="profile-card-content">
                <div className="profile-info">
                  <div className="profile-avatar-wrapper">
                    <img
                      src={profile?.avatar || '/default-avatar.png'}
                      alt="Avatar"
                      className="profile-avatar"
                    />
                  </div>

                  <div className="profile-details">
                    <div className="profile-grid">
                      <div>
                        <label className="profile-field-label">Họ và tên</label>
                        <p className="profile-name-value">{profile?.fullName}</p>
                      </div>
                      <div>
                        <label className="profile-field-label">Email</label>
                        <p className="profile-field-value">{profile?.email}</p>
                      </div>
                      <div>
                        <label className="profile-field-label">Số điện thoại</label>
                        <p className="profile-field-value">{profile?.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="profile-field-label">Ngày sinh</label>
                        <p className="profile-field-value">{profile?.dateOfBirth}</p>
                      </div>
                    </div>

                    {defaultAddress && (
                      <div className="default-address">
                        <label className="default-address-label">Địa chỉ mặc định</label>
                        <p className="default-address-value">{defaultAddress.fullAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-actions">
                  <button onClick={handleEdit} className="edit-profile-btn">
                    <PencilIcon className="btn-icon" /> Chỉnh sửa hồ sơ
                  </button>
                  <button onClick={() => navigate('/change-password')} className="change-password-btn">
                    <LockClosedIcon className="btn-icon" /> Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <h2 className="edit-form-title">Chỉnh sửa thông tin</h2>
              <form onSubmit={handleUpdate} className="edit-form-content">
                {(['fullName', 'email', 'phoneNumber', 'dateOfBirth', 'avatar'] as const).map((field) => (
                  <div key={field} className="form-group">
                    <label className="form-group-label">
                      {field === 'fullName' && 'Họ và tên'}
                      {field === 'email' && 'Email'}
                      {field === 'phoneNumber' && 'Số điện thoại'}
                      {field === 'dateOfBirth' && 'Ngày sinh'}
                      {field === 'avatar' && 'Link ảnh đại diện (tùy chọn)'}
                    </label>
                    <input
                      type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      placeholder={field === 'avatar' ? 'https://example.com/avatar.jpg' : ''}
                      className="form-group-input"
                    />
                    {formErrors[field] && <p className="form-error">{formErrors[field]}</p>}
                  </div>
                ))}

                <div className="form-actions">
                  <button type="button" onClick={handleCancel} className="cancel-edit-btn">
                    Hủy
                  </button>
                  <button type="submit" disabled={isLoading} className="submit-edit-btn">
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

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
                        <button onClick={() => setDeletingAddressId(addr.id!)} className="delete-address-btn">
                          <TrashIcon className="edit-icon" /> Xóa
                        </button>
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
}
export default ProfilePage;