import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/user.service';
import { UserResponse, UpdateUserPayload } from '../services/user.service';
import { useUser } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Profile.css'; 
import {
  UserCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface ProfileInfoProps {
  onProfileUpdate?: (updatedProfile: UserResponse) => void; // Callback để parent nhận data mới
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onProfileUpdate }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchProfile();
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

  // Validation thủ công (giữ nguyên)
  const validateForm = (data: UpdateUserPayload): string[] => {
    const errors: string[] = [];

    if (!data.fullName?.trim()) errors.push('Tên đầy đủ là bắt buộc');
    if (!data.email?.trim()) {
      errors.push('Email là bắt buộc');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Email không hợp lệ');
    }
    if (!data.phoneNumber?.trim()) {
      errors.push('Số điện thoại là bắt buộc');
    } else if (!/^\d{10,11}$/.test(data.phoneNumber)) {
      errors.push('Số điện thoại phải 10-11 chữ số');
    }
    if (!data.dateOfBirth?.trim()) {
      errors.push('Ngày sinh là bắt buộc');
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfBirth)) {
      errors.push('Định dạng ngày sinh: YYYY-MM-DD');
    }
    if (data.avatar && !/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)$/.test(data.avatar)) {
      errors.push('Avatar phải là URL hợp lệ');
    }

    // Set errors vào state
    const errorObj: Partial<Record<keyof UpdateUserPayload, string>> = {};
    errors.forEach((msg) => {
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
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updated = await updateProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      if (onProfileUpdate) {
        onProfileUpdate(updated); // Gọi callback để parent nhận data mới
      }
      toast.success('Cập nhật hồ sơ thành công'); 
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
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
    if (formErrors[name as keyof UpdateUserPayload]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading) return <div className="loading">Đang tải thông tin hồ sơ...</div>;
  if (error) return <div className="error">Lỗi: {error} <button onClick={fetchProfile}>Thử lại</button></div>;

  return (
    <>
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
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={handleEdit} className="edit-profile-btn">
                <PencilIcon className="btn-icon" /> Chỉnh sửa hồ sơ
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
    </>
  );
};

export default ProfileInfo;