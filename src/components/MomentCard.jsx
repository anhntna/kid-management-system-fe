import React from 'react';
import { Heart, Calendar, Images, Edit3, Trash2, Smile, Award, Sparkles } from 'lucide-react';

const EMOTION_LABELS = {
  HAPPY: { label: 'Vui vẻ', class: 'badge-emotion-happy', icon: '😄' },
  PROUD: { label: 'Tự hào', class: 'badge-emotion-proud', icon: '🌟' },
  FUNNY: { label: 'Hài hước', class: 'badge-emotion-funny', icon: '😆' },
  LOVING: { label: 'Đáng yêu', class: 'badge-emotion-loving', icon: '🥰' },
  AMAZED: { label: 'Bất ngờ', class: 'badge-emotion-amazed', icon: '😲' },
  PEACEFUL: { label: 'Bình yên', class: 'badge-emotion-peaceful', icon: '😴' },
};

const CATEGORY_LABELS = {
  DAILY: 'Đời thường',
  FIRST_TIME: 'Lần đầu tiên ✨',
  BIRTHDAY: 'Sinh nhật 🎂',
  TRIP: 'Dã ngoại ⛺',
  HEALTH: 'Sức khỏe 🏥',
  SCHOOL: 'Đi học 🎒',
  MILESTONE: 'Cột mốc 🏆',
};

export default function MomentCard({
  moment,
  onToggleFavorite,
  onOpenLightbox,
  onEdit,
  onDelete,
}) {
  const emotionInfo = EMOTION_LABELS[moment.emotion] || EMOTION_LABELS.HAPPY;
  const categoryText = CATEGORY_LABELS[moment.category] || moment.category;
  const photos = moment.mediaUrls || [];
  const photoCount = photos.length;

  return (
    <article className="moment-card" id={`moment-card-${moment.id}`}>
      <div className="moment-header">
        <div className="moment-badges">
          {moment.ageDisplay && (
            <span className="badge badge-age">
              👶 Lúc {moment.ageDisplay}
            </span>
          )}
          <span className={`badge ${emotionInfo.class}`}>
            <span>{emotionInfo.icon}</span>
            <span>{emotionInfo.label}</span>
          </span>
          <span className="badge badge-category">
            {categoryText}
          </span>
        </div>

        <div className="moment-actions">
          <button
            className={`fav-btn ${moment.favorite ? 'is-fav' : ''}`}
            onClick={() => onToggleFavorite(moment.id)}
            title={moment.favorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
            id={`fav-btn-${moment.id}`}
          >
            <Heart size={20} fill={moment.favorite ? '#FF2E63' : 'none'} />
          </button>
          {onEdit && (
            <button
              className="fav-btn"
              onClick={() => onEdit(moment)}
              title="Chỉnh sửa khoảnh khắc"
              id={`edit-btn-${moment.id}`}
            >
              <Edit3 size={17} />
            </button>
          )}
          {onDelete && (
            <button
              className="fav-btn"
              onClick={() => onDelete(moment.id)}
              title="Xóa khoảnh khắc"
              id={`delete-btn-${moment.id}`}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>

      <h2 className="moment-title">{moment.title}</h2>

      {moment.content && (
        <p className="moment-content">{moment.content}</p>
      )}

      {/* Media: Single photo or Album Collage Grid */}
      {photoCount === 1 && (
        <div 
          className="single-photo-wrapper"
          onClick={() => onOpenLightbox(photos, 0)}
          title="Click để phóng to ảnh"
        >
          <img
            src={photos[0]}
            alt={moment.title}
            className="single-photo"
            loading="lazy"
          />
        </div>
      )}

      {photoCount > 1 && (
        <div className="album-wrapper">
          <div className={`album-collage-grid count-${photoCount <= 3 ? photoCount : 'more'}`}>
            {photos.slice(0, 4).map((photoUrl, idx) => {
              const isLastTile = idx === 3 && photoCount > 4;
              const remainingCount = photoCount - 3;

              return (
                <div
                  key={idx}
                  className="album-thumb-container"
                  onClick={() => onOpenLightbox(photos, idx)}
                  title={`Ảnh ${idx + 1} / ${photoCount} - Click để xem album`}
                >
                  <img
                    src={photoUrl}
                    alt={`${moment.title} - ảnh ${idx + 1}`}
                    className="album-thumb"
                    loading="lazy"
                  />
                  {isLastTile && (
                    <div className="album-overlay-more">
                      <span>+{remainingCount}</span>
                      <span>ảnh khác</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div 
            className="album-badge-ribbon"
            onClick={() => onOpenLightbox(photos, 0)}
          >
            <Images size={16} />
            <span>Album sự kiện: {photoCount} ảnh (click để xem trình chiếu toàn bộ)</span>
          </div>
        </div>
      )}

      <div className="moment-footer">
        <div className="moment-footer-date">
          <Calendar size={15} />
          <span>Ngày {moment.momentDate}</span>
        </div>
      </div>
    </article>
  );
}
