import React from 'react';
import { Search, Heart } from 'lucide-react';

const CATEGORIES = [
  { key: '', label: 'Tất cả' },
  { key: 'DAILY', label: 'Đời thường' },
  { key: 'FIRST_TIME', label: 'Lần đầu tiên ✨' },
  { key: 'BIRTHDAY', label: 'Sinh nhật 🎂' },
  { key: 'TRIP', label: 'Dã ngoại ⛺' },
  { key: 'HEALTH', label: 'Sức khỏe 🏥' },
  { key: 'SCHOOL', label: 'Đi học 🎒' },
  { key: 'MILESTONE', label: 'Cột mốc 🏆' },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  favoriteOnly,
  onToggleFavorite,
}) {
  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm kỷ niệm, câu chuyện..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="input-search-moments"
        />
      </div>

      <div className="filter-categories">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat.key)}
              id={`filter-cat-${cat.key || 'all'}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <button
        className={`filter-fav-btn ${favoriteOnly ? 'active' : ''}`}
        onClick={onToggleFavorite}
        id="filter-btn-favorite"
      >
        <Heart size={16} fill={favoriteOnly ? '#FF2E63' : 'none'} />
        <span>Yêu thích</span>
      </button>
    </div>
  );
}
