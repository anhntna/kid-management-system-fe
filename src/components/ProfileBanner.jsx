import React from 'react';
import { Calendar, Heart, Image as ImageIcon, Sparkles, Edit3, Trash2 } from 'lucide-react';

export default function ProfileBanner({
  currentChild,
  totalMoments,
  favoriteCount,
  onEditChild,
  onDeleteChild,
}) {
  if (!currentChild) {
    return (
      <div className="profile-banner">
        <div className="profile-left">
          <div
            className="profile-avatar-big"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB830 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Sparkles size={36} />
          </div>
          <div className="profile-info">
            <h1>Kho Kỷ Niệm Của Gia Đình</h1>
            <div className="profile-meta">
              <span className="profile-meta-item">
                Dòng thời gian tổng hợp tất cả những bước đi và kỷ niệm ngọt ngào nhất
              </span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <div className="stat-value">{totalMoments || 0}</div>
            <div className="stat-label">Khoảnh khắc</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{favoriteCount || 0}</div>
            <div className="stat-label">Yêu thích</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-banner">
      <div className="profile-left">
        {currentChild.avatarUrl ? (
          <img
            src={currentChild.avatarUrl}
            alt={currentChild.fullName}
            className="profile-avatar-big"
          />
        ) : (
          <div
            className="profile-avatar-big"
            style={{
              background: currentChild.themeColor || '#FF6B6B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '800'
            }}
          >
            {currentChild.nickname ? currentChild.nickname.charAt(0) : currentChild.fullName.charAt(0)}
          </div>
        )}

        <div className="profile-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1>
              {currentChild.fullName}
              {currentChild.nickname && (
                <span className="nickname-badge">"{currentChild.nickname}"</span>
              )}
            </h1>

            {/* Child Profile Action Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {onEditChild && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '8px' }}
                  onClick={() => onEditChild(currentChild)}
                  title="Chỉnh sửa thông tin bé"
                  id="btn-edit-child-profile"
                >
                  <Edit3 size={14} />
                  <span>Sửa</span>
                </button>
              )}
              {onDeleteChild && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '8px', color: '#E03131', borderColor: '#FFC9C9' }}
                  onClick={() => onDeleteChild(currentChild.id, currentChild.fullName)}
                  title="Xóa hồ sơ bé này"
                  id="btn-delete-child-profile"
                >
                  <Trash2 size={14} />
                  <span>Xóa bé</span>
                </button>
              )}
            </div>
          </div>

          <div className="profile-meta">
            <div className="profile-meta-item">
              <Calendar size={16} />
              <span>Sinh: {currentChild.birthDate}</span>
            </div>
            <div className="profile-meta-item">
              <span className="badge badge-age" style={{ fontSize: '0.84rem' }}>
                👶 {currentChild.ageDisplay}
              </span>
            </div>
          </div>

          {currentChild.bio && (
            <p className="profile-bio">"{currentChild.bio}"</p>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <div className="stat-value">{totalMoments || 0}</div>
          <div className="stat-label">Khoảnh khắc</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{favoriteCount || 0}</div>
          <div className="stat-label">Yêu thích</div>
        </div>
      </div>
    </div>
  );
}
