import React from 'react';
import MomentCard from './MomentCard';
import { Calendar, PlusCircle, Sparkles } from 'lucide-react';

export default function Timeline({
  timelineData,
  momentsList,
  isFiltered,
  onToggleFavorite,
  onOpenLightbox,
  onEdit,
  onDelete,
  onOpenAddMoment,
}) {
  // If filtered or searching, we render the filtered list directly
  if (isFiltered) {
    if (!momentsList || momentsList.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <Sparkles size={32} />
          </div>
          <h3>Không tìm thấy khoảnh khắc phù hợp</h3>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc danh mục xem sao nhé.</p>
        </div>
      );
    }

    return (
      <div className="moments-grid">
        {momentsList.map((m) => (
          <MomentCard
            key={m.id}
            moment={m}
            onToggleFavorite={onToggleFavorite}
            onOpenLightbox={onOpenLightbox}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Grouped Timeline View (Tree)
  const years = timelineData?.years || [];

  if (years.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Sparkles size={32} />
        </div>
        <h3>Chưa có khoảnh khắc nào được lưu lại</h3>
        <p>Hãy bắt đầu ghi lại những khoảnh khắc đáng yêu đầu tiên, những tiếng cười giòn tan của con ngay hôm nay!</p>
        <button className="btn btn-primary" onClick={onOpenAddMoment}>
          <PlusCircle size={18} />
          <span>Tạo khoảnh khắc đầu tiên</span>
        </button>
      </div>
    );
  }

  return (
    <div className="timeline-tree">
      {years.map((yg) => (
        <div key={yg.year} className="year-section">
          <div className="year-header">
            <Calendar size={18} />
            <span>Năm {yg.year}</span>
          </div>

          {yg.months.map((mg) => (
            <div key={`${yg.year}-${mg.month}`} className="month-section">
              <div className="month-marker">
                <div className="month-dot" />
                <span>{mg.monthName} ({mg.momentCount} kỷ niệm)</span>
              </div>

              <div className="moments-grid">
                {mg.moments.map((tm) => (
                  <MomentCard
                    key={tm.id}
                    moment={tm}
                    onToggleFavorite={onToggleFavorite}
                    onOpenLightbox={onOpenLightbox}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
