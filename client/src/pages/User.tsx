import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../context/authContext'; // Giả sử có context cho auth
import { getProfile, updateProfile } from '../services/user.service';
import { UserResponse, UpdateUserPayload } from '../services/user.service'; // Import types
import { useUser } from '../context/authContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user}  = useUser();
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
    // if (!token) {
    //   navigate('/login'); // Redirect nếu chưa login
    //   return;
    // }
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

  if(isLoading) return <div className="loading">Đang tải thông tin hồ sơ...</div>;
  if (error) return <div className="error">Lỗi: {error} <button onClick={fetchProfile}>Thử lại</button></div>;

  return (
    <div className="profile-page">
      <h1>Hồ sơ cá nhân</h1>
      {profile && (
        <div className="profile-content">
          {!isEditing ? (
            // View mode
            <div className="profile-view">
              <img 
                src={profile.avatar || '/default-avatar.png'} 
                alt="Avatar" 
                className="avatar" 
                style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
              />
              <p><strong>Tên:</strong> {profile.fullName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Số điện thoại:</strong> {profile.phoneNumber}</p>
              <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
              <button onClick={handleEdit} className="edit-btn">Chỉnh sửa hồ sơ</button>
            </div>
          ) : (
            // Edit mode với form
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="fullName">Tên đầy đủ</label>
                <input 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  id="fullName" 
                  type="text" 
                />
                {formErrors.fullName && <p className="error">{formErrors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  id="email" 
                  type="email" 
                />
                {formErrors.email && <p className="error">{formErrors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleInputChange} 
                  id="phoneNumber" 
                  type="tel" 
                />
                {formErrors.phoneNumber && <p className="error">{formErrors.phoneNumber}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Ngày sinh</label>
                <input 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange} 
                  id="dateOfBirth" 
                  type="date" 
                />
                {formErrors.dateOfBirth && <p className="error">{formErrors.dateOfBirth}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar URL (tùy chọn)</label>
                <input 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleInputChange} 
                  id="avatar" 
                  type="url" 
                  placeholder="https://example.com/avatar.jpg" 
                />
                {formErrors.avatar && <p className="error">{formErrors.avatar}</p>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} disabled={isLoading}>Hủy</button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;