import React from 'react';
import { Users } from 'lucide-react';

export default function ChildSelector({ childrenList, selectedChildId, onSelectChild }) {
  return (
    <div className="child-selector-container">
      {/* All Children Pill */}
      <button
        className={`child-pill ${selectedChildId === null ? 'active' : ''}`}
        onClick={() => onSelectChild(null)}
        id="child-pill-all"
      >
        <div 
          className="child-pill-avatar"
          style={{ background: 'linear-gradient(135deg, #4D96FF, #6BCB77)' }}
        >
          <Users size={18} />
        </div>
        <div className="child-pill-info">
          <span className="child-pill-name">Tất cả các con</span>
          <span className="child-pill-age">{childrenList.length} bé</span>
        </div>
      </button>

      {/* Individual Child Pills */}
      {childrenList.map((child) => {
        const isActive = selectedChildId === child.id;
        return (
          <button
            key={child.id}
            className={`child-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectChild(child.id)}
            id={`child-pill-${child.id}`}
          >
            {child.avatarUrl ? (
              <img
                src={child.avatarUrl}
                alt={child.fullName}
                className="child-pill-avatar"
              />
            ) : (
              <div
                className="child-pill-avatar"
                style={{ background: child.themeColor || '#FF7E67' }}
              >
                {child.nickname ? child.nickname.charAt(0) : child.fullName.charAt(0)}
              </div>
            )}
            <div className="child-pill-info">
              <span className="child-pill-name">{child.nickname || child.fullName}</span>
              <span className="child-pill-age">{child.ageDisplay || 'Chưa rõ'}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
