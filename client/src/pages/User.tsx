import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProfileInfo from '../components/ProfileInfo';
import '../styles/Profile.css';
import {
  UserCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const User: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Staff')) {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/profile');
      return;
    }
  }, [user, navigate]);

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log('Admin/Staff profile updated:', updatedProfile);
    toast.success('Cập nhật hồ sơ thành công');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-header-title">
            <ShieldCheckIcon className="profile-header-icon" /> Hồ sơ 
          </h1>
          <p className="profile-header-desc">Quản lý thông tin cá nhân</p>
        </div>

        {}
        <ProfileInfo onProfileUpdate={handleProfileUpdate} />
      </div>
    </div>
  );
};

export default User;