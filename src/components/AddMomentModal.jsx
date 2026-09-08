import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const EMOTIONS = [
  { value: 'HAPPY', label: 'Vui vẻ 😄' },
  { value: 'PROUD', label: 'Tự hào 🌟' },
  { value: 'FUNNY', label: 'Ngộ nghĩnh 😆' },
  { value: 'LOVING', label: 'Đáng yêu 🥰' },
  { value: 'AMAZED', label: 'Bất ngờ 😲' },
  { value: 'PEACEFUL', label: 'Bình yên 😴' },
];

const CATEGORIES = [
  { value: 'DAILY', label: 'Đời thường' },
  { value: 'FIRST_TIME', label: 'Lần đầu tiên ✨' },
  { value: 'BIRTHDAY', label: 'Sinh nhật 🎂' },
  { value: 'TRIP', label: 'Dã ngoại / Du lịch ⛺' },
  { value: 'HEALTH', label: 'Sức khỏe / Khám định kỳ 🏥' },
  { value: 'SCHOOL', label: 'Đi học / Mầm non 🎒' },
  { value: 'MILESTONE', label: 'Cột mốc phát triển 🏆' },
];

export default function AddMomentModal({
  isOpen,
  onClose,
  childrenList,
  defaultChildId,
  momentToEdit,
  onSaveSuccess,
}) {
  if (!isOpen) return null;

  const isEditing = !!momentToEdit;

  const [childId, setChildId] = useState(
    momentToEdit?.childId || defaultChildId || (childrenList[0]?.id || '')
  );
  const [title, setTitle] = useState(momentToEdit?.title || '');
  const [content, setContent] = useState(momentToEdit?.content || '');
  const [momentDate, setMomentDate] = useState(
    momentToEdit?.momentDate || new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState(momentToEdit?.category || 'DAILY');
  const [emotion, setEmotion] = useState(momentToEdit?.emotion || 'HAPPY');
  const [mediaUrls, setMediaUrls] = useState(momentToEdit?.mediaUrls || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (momentToEdit) {
      setChildId(momentToEdit.childId);
      setTitle(momentToEdit.title);
      setContent(momentToEdit.content || '');
      setMomentDate(momentToEdit.momentDate);
      setCategory(momentToEdit.category);
      setEmotion(momentToEdit.emotion);
      setMediaUrls(momentToEdit.mediaUrls || []);
    } else {
      setChildId(defaultChildId || (childrenList[0]?.id || ''));
      setTitle('');
      setContent('');
      setMomentDate(new Date().toISOString().split('T')[0]);
      setCategory('DAILY');
      setEmotion('HAPPY');
      setMediaUrls([]);
    }
    setErrorMsg('');
  }, [momentToEdit, defaultChildId, childrenList]);

  // Handle uploading local file(s)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setErrorMsg('');
    try {
      if (files.length === 1) {
        const res = await api.uploadFile(files[0]);
        if (res && res.url) {
          setMediaUrls((prev) => [...prev, res.url]);
        }
      } else {
        const res = await api.uploadMultipleFiles(files);
        if (res && res.urls) {
          setMediaUrls((prev) => [...prev, ...res.urls]);
        }
      }
    } catch (err) {
      setErrorMsg('Tải file ảnh thất bại, vui lòng thử lại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle adding image from web URL directly
  const handleAddUrl = () => {
    if (!imageUrlInput.trim()) return;
    setMediaUrls((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Remove photo from list
  const handleRemovePhoto = (index) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề khoảnh khắc');
      return;
    }
    if (!childId) {
      setErrorMsg('Vui lòng chọn bé cho khoảnh khắc này');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      childId: Number(childId),
      title: title.trim(),
      content: content.trim(),
      momentDate,
      category,
      emotion,
      mediaUrls,
    };

    try {
      if (isEditing) {
        await api.updateMoment(momentToEdit.id, payload);
      } else {
        await api.createMoment(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi lưu khoảnh khắc');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ImageIcon size={22} color="var(--primary)" />
            <span>{isEditing ? 'Chỉnh Sửa Khoảnh Khắc' : 'Thêm Khoảnh Khắc Mới'}</span>
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

            {/* Child Selector */}
            <div className="form-group">
              <label className="form-label">Chọn bé</label>
              <select
                className="form-select"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                disabled={isEditing}
                required
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.nickname || c.ageDisplay})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Tiêu đề khoảnh khắc / sự kiện</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: Bé lần đầu tự xúc ăn, Tiệc sinh nhật 2 tuổi..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Date & Category */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ngày diễn ra</label>
                <input
                  type="date"
                  className="form-input"
                  value={momentDate}
                  onChange={(e) => setMomentDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phân loại</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Emotion */}
            <div className="form-group">
              <label className="form-label">Cảm xúc chủ đạo</label>
              <select
                className="form-select"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
              >
                {EMOTIONS.map((em) => (
                  <option key={em.value} value={em.value}>
                    {em.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content / Story */}
            <div className="form-group">
              <label className="form-label">Lời kể / Kỷ niệm</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Ghi lại cảm xúc hoặc câu chuyện ngộ nghĩnh của con lúc này..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Photo & Album Upload */}
            <div className="form-group">
              <label className="form-label">
                Hình ảnh (1 ảnh trong ngày hoặc Album nhiều ảnh sự kiện)
              </label>

              <label className="dropzone">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                {uploading ? (
                  <div>
                    <Loader2 size={26} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
                    <div className="dropzone-text">Đang tải ảnh lên...</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={26} color="var(--primary)" style={{ margin: '0 auto' }} />
                    <div className="dropzone-text">
                      Bấm vào đây để chọn <strong>1 ảnh</strong> hoặc <strong>chọn cùng lúc nhiều ảnh sự kiện</strong>
                    </div>
                    <div className="dropzone-hint">Hỗ trợ JPG, PNG, WEBP (tối đa 50MB)</div>
                  </div>
                )}
              </label>

              {/* Link URL fallback */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Hoặc dán đường dẫn ảnh trực tiếp..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddUrl}
                >
                  <Plus size={16} />
                  <span>Thêm</span>
                </button>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {mediaUrls.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Đã chọn {mediaUrls.length} ảnh {mediaUrls.length > 1 ? '(Album sự kiện)' : '(Ảnh đơn)'}:
                  </div>
                  <div className="upload-previews">
                    {mediaUrls.map((url, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={url} alt={`Preview ${idx + 1}`} className="preview-img" />
                        <button
                          type="button"
                          className="preview-remove"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Xóa ảnh này"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              id="btn-submit-moment"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEditing ? 'Cập nhật' : 'Lưu khoảnh khắc'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
