import React from 'react';
import { PlusCircle, UserPlus, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenAddMoment, onOpenAddChild }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon-wrapper">
            <Sparkles size={22} />
          </div>
          <div className="brand-text">
            Kid<span>Timeline</span>
          </div>
        </div>

        <div className="nav-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onOpenAddChild}
            id="btn-add-child"
          >
            <UserPlus size={17} />
            <span>Thêm bé</span>
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onOpenAddMoment}
            id="btn-add-moment"
          >
            <PlusCircle size={17} />
            <span>Thêm khoảnh khắc</span>
          </button>
        </div>
      </div>
    </header>
  );
}
