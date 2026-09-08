import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function ImageViewerModal({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) {
  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  const totalPhotos = photos.length;
  const hasMultiple = totalPhotos > 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasMultiple) {
        onNavigate((currentIndex - 1 + totalPhotos) % totalPhotos);
      } else if (e.key === 'ArrowRight' && hasMultiple) {
        onNavigate((currentIndex + 1) % totalPhotos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalPhotos, hasMultiple, onClose, onNavigate]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-topbar" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
          {hasMultiple ? `Ảnh ${currentIndex + 1} / ${totalPhotos}` : 'Xem ảnh'}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={currentPhoto}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn btn-icon-only"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            title="Tải ảnh về"
          >
            <Download size={18} />
          </a>
          <button
            className="btn btn-icon-only"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
            title="Đóng (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="lightbox-main" onClick={(e) => e.stopPropagation()}>
        {hasMultiple && (
          <button
            className="lightbox-nav-btn lightbox-nav-prev"
            onClick={() => onNavigate((currentIndex - 1 + totalPhotos) % totalPhotos)}
            title="Ảnh trước (Mũi tên trái)"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        <img
          src={currentPhoto}
          alt={`Kỷ niệm ${currentIndex + 1}`}
          className="lightbox-image"
        />

        {hasMultiple && (
          <button
            className="lightbox-nav-btn lightbox-nav-next"
            onClick={() => onNavigate((currentIndex + 1) % totalPhotos)}
            title="Ảnh tiếp theo (Mũi tên phải)"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
          {photos.map((p, idx) => (
            <button
              key={idx}
              className={`lightbox-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => onNavigate(idx)}
            >
              <img src={p} alt={`Thumb ${idx + 1}`} className="lightbox-thumb-img" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
