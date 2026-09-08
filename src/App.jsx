import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ChildSelector from './components/ChildSelector';
import ProfileBanner from './components/ProfileBanner';
import FilterBar from './components/FilterBar';
import Timeline from './components/Timeline';
import AddMomentModal from './components/AddMomentModal';
import AddChildModal from './components/AddChildModal';
import ImageViewerModal from './components/ImageViewerModal';
import { api } from './services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [momentsList, setMomentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Modals state
  const [isAddMomentOpen, setIsAddMomentOpen] = useState(false);
  const [momentToEdit, setMomentToEdit] = useState(null);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState(null);

  // Lightbox state
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Load children list
  const loadChildren = useCallback(async () => {
    try {
      const data = await api.getChildren();
      setChildrenList(data || []);
      if (data && data.length > 0 && selectedChildId === null) {
        setSelectedChildId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load children:', err);
      setError('Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại dịch vụ.');
    }
  }, [selectedChildId]);

  // Load timeline or filtered moments
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isFiltered = Boolean(searchQuery.trim() || selectedCategory || favoriteOnly);

      if (isFiltered) {
        const filtered = await api.getMoments({
          childId: selectedChildId || undefined,
          category: selectedCategory || undefined,
          favorite: favoriteOnly ? true : undefined,
          search: searchQuery.trim() || undefined,
        });
        setMomentsList(filtered || []);
      } else {
        const tl = await api.getTimeline(selectedChildId);
        setTimelineData(tl);
      }
    } catch (err) {
      console.error('Failed to load moments/timeline:', err);
      setError('Lỗi khi tải dữ liệu kỷ niệm.');
    } finally {
      setLoading(false);
    }
  }, [selectedChildId, searchQuery, selectedCategory, favoriteOnly]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle favorite toggle
  const handleToggleFavorite = async (momentId) => {
    try {
      await api.toggleFavorite(momentId);
      loadData();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Handle delete moment
  const handleDeleteMoment = async (momentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoảnh khắc kỷ niệm này không?')) {
      try {
        await api.deleteMoment(momentId);
        loadData();
      } catch (err) {
        alert('Lỗi khi xóa khoảnh khắc: ' + (err.message || err));
      }
    }
  };

  // Handle edit & delete child
  const handleEditChild = (child) => {
    setChildToEdit(child);
    setIsAddChildOpen(true);
  };

  const handleDeleteChild = async (childId, childName) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa hồ sơ của bé "${childName}"?\n\nToàn bộ các khoảnh khắc, ảnh chụp và album sự kiện của bé cũng sẽ bị xóa vĩnh viễn và không thể khôi phục!`
    );
    if (!confirmed) return;

    try {
      await api.deleteChild(childId);
      const updatedList = await api.getChildren();
      setChildrenList(updatedList || []);
      if (selectedChildId === childId) {
        setSelectedChildId(updatedList && updatedList.length > 0 ? updatedList[0].id : null);
      }
      loadData();
    } catch (err) {
      alert('Lỗi khi xóa hồ sơ bé: ' + (err.message || err));
    }
  };

  // Lightbox handlers
  const handleOpenLightbox = (photos, initialIndex = 0) => {
    setLightboxPhotos(photos);
    setLightboxIndex(initialIndex);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Edit moment
  const handleEditMoment = (moment) => {
    setMomentToEdit(moment);
    setIsAddMomentOpen(true);
  };

  const currentChild = childrenList.find((c) => c.id === selectedChildId);
  const isFiltered = Boolean(searchQuery.trim() || selectedCategory || favoriteOnly);

  return (
    <div>
      <Navbar
        onOpenAddMoment={() => {
          setMomentToEdit(null);
          setIsAddMomentOpen(true);
        }}
        onOpenAddChild={() => {
          setChildToEdit(null);
          setIsAddChildOpen(true);
        }}
      />

      <main className="app-container">
        {/* Child Selector */}
        <ChildSelector
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={(id) => {
            setSelectedChildId(id);
            setSearchQuery('');
            setSelectedCategory('');
            setFavoriteOnly(false);
          }}
        />

        {/* Profile / Stats Header */}
        <ProfileBanner
          currentChild={currentChild}
          totalMoments={timelineData?.totalMoments || momentsList.length}
          favoriteCount={timelineData?.favoriteCount}
          onEditChild={handleEditChild}
          onDeleteChild={handleDeleteChild}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          favoriteOnly={favoriteOnly}
          onToggleFavorite={() => setFavoriteOnly((prev) => !prev)}
        />

        {/* Loading / Error States */}
        {error && (
          <div style={{ padding: '16px', background: '#FFF0F0', border: '1px solid #FFC9C9', borderRadius: '14px', color: '#E03131', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <p>Đang tải dòng thời gian kỷ niệm của bé...</p>
          </div>
        ) : (
          <Timeline
            timelineData={timelineData}
            momentsList={momentsList}
            isFiltered={isFiltered}
            onToggleFavorite={handleToggleFavorite}
            onOpenLightbox={handleOpenLightbox}
            onEdit={handleEditMoment}
            onDelete={handleDeleteMoment}
            onOpenAddMoment={() => {
              setMomentToEdit(null);
              setIsAddMomentOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AddMomentModal
        isOpen={isAddMomentOpen}
        onClose={() => {
          setIsAddMomentOpen(false);
          setMomentToEdit(null);
        }}
        childrenList={childrenList}
        defaultChildId={selectedChildId}
        momentToEdit={momentToEdit}
        onSaveSuccess={() => {
          loadData();
          loadChildren();
        }}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        childToEdit={childToEdit}
        onClose={() => {
          setIsAddChildOpen(false);
          setChildToEdit(null);
        }}
        onSaveSuccess={() => {
          loadChildren();
          loadData();
        }}
      />

      {isLightboxOpen && (
        <ImageViewerModal
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
