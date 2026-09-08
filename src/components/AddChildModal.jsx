import React, { useState, useEffect } from 'react';
import { X, UserPlus, Upload, Loader2, Edit3 } from 'lucide-react';
import { api } from '../services/api';

const THEME_COLORS = [
  { label: 'Cam Đào', value: '#FF7E67' },
  { label: 'Hồng Phấn', value: '#FF8E8E' },
  { label: 'Vàng Nắng', value: '#FFB830' },
  { label: 'Tím Oải Hương', value: '#845EC2' },
  { label: 'Xanh Lam', value: '#4D96FF' },
  { label: 'Xanh Bạc Hà', value: '#2EC4B6' },
];

export default function AddChildModal({ isOpen, onClose, childToEdit, onSaveSuccess }) {
  if (!isOpen) return null;

  const isEditing = !!childToEdit;

  const [fullName, setFullName] = useState(childToEdit?.fullName || '');
  const [nickname, setNickname] = useState(childToEdit?.nickname || '');
  const [birthDate, setBirthDate] = useState(childToEdit?.birthDate || '');
  const [gender, setGender] = useState(childToEdit?.gender || 'BOY');
  const [avatarUrl, setAvatarUrl] = useState(childToEdit?.avatarUrl || '');
  const [themeColor, setThemeColor] = useState(childToEdit?.themeColor || '#FF7E67');
  const [bio, setBio] = useState(childToEdit?.bio || '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (childToEdit) {
      setFullName(childToEdit.fullName || '');
      setNickname(childToEdit.nickname || '');
      setBirthDate(childToEdit.birthDate || '');
      setGender(childToEdit.gender || 'BOY');
      setAvatarUrl(childToEdit.avatarUrl || '');
      setThemeColor(childToEdit.themeColor || '#FF7E67');
      setBio(childToEdit.bio || '');
    } else {
      setFullName('');
      setNickname('');
      setBirthDate('');
      setGender('BOY');
      setAvatarUrl('');
      setThemeColor('#FF7E67');
      setBio('');
    }
    setErrorMsg('');
  }, [childToEdit, isOpen]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const res = await api.uploadFile(file);
      if (res && res.url) {
        setAvatarUrl(res.url);
      }
    } catch (err) {
      setErrorMsg('Tải ảnh đại diện thất bại, vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bé');
      return;
    }
    if (!birthDate) {
      setErrorMsg('Vui lòng chọn ngày sinh của bé');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      birthDate,
      gender,
      avatarUrl,
      themeColor,
      bio: bio.trim(),
    };

    try {
      if (isEditing) {
        await api.updateChild(childToEdit.id, payload);
      } else {
        await api.createChild(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi lưu thông tin hồ sơ bé');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEditing ? (
              <>
                <Edit3 size={22} color="var(--primary)" />
                <span>Chỉnh Sửa Hồ Sơ Bé</span>
              </>
            ) : (
              <>
                <UserPlus size={22} color="var(--primary)" />
                <span>Thêm Hồ Sơ Bé Mới</span>
              </>
            )}
          </div>
          <button className="btn btn-icon-only btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ padding: '10px 14px', background: '#FFF0F0', color: '#E03131', borderRadius: '10px', fontSize: '0.88rem' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Họ và tên bé *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: Nguyễn Minh Khang"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biệt danh ở nhà</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: Bé Bắp, Cún con..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ngày sinh *</label>
                <input
                  type="date"
                  className="form-input"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Giới tính *</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="BOY">Bé trai 👦</option>
                  <option value="GIRL">Bé gái 👧</option>
                </select>
              </div>
            </div>

            {/* Avatar upload */}
            <div className="form-group">
              <label className="form-label">Ảnh đại diện của bé</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: themeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '800'
                    }}
                  >
                    {nickname ? nickname.charAt(0) : (fullName ? fullName.charAt(0) : '👶')}
                  </div>
                )}

                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={16} />
                  <span>{uploading ? 'Đang tải...' : 'Tải ảnh đại diện'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Theme color */}
            <div className="form-group">
              <label className="form-label">Màu sắc đại diện</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {THEME_COLORS.map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setThemeColor(col.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: col.value,
                      border: themeColor === col.value ? '3px solid white' : 'none',
                      outline: themeColor === col.value ? `2px solid ${col.value}` : 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      transform: themeColor === col.value ? 'scale(1.15)' : 'none',
                    }}
                    title={col.label}
                  />
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label">Lời nhắn / Giới thiệu về con</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Một câu chúc hoặc vài nét đáng yêu về tính cách của con..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || uploading}
              id="btn-submit-child"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
