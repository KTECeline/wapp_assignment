import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Image as ImageIcon, Edit2, Trash2, Calendar, X } from 'lucide-react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api/client';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-red-100 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
    <div className="w-1 h-12 bg-red-500 rounded-full"></div>
    <span className="text-gray-800 font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
      <X size={18} />
    </button>
  </div>
);

const ConfirmDialog = ({ title, body, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{body}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState();
  const [bannerPreview, setBannerPreview] = useState();
  const [imgMeta, setImgMeta] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const TARGET_W = 1200;
  const TARGET_H = 400;
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!banner || !(banner instanceof File)) return setBannerPreview(undefined);
    const reader = new FileReader();
    reader.readAsDataURL(banner);
    reader.onloadend = () => setBannerPreview(reader.result);
  }, [banner]);

  // fetch announcements from backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getAnnouncements();
        if (!mounted) return;
        // map backend shape to UI shape
        setItems(list.map(a => ({
          id: a.id,
          title: a.title,
          body: a.body,
          date: a.date || new Date().toISOString().slice(0,10),
          banner: a.annImg || null,
          visible: a.visible
        })));
      } catch (err) {
        console.error('Failed to load announcements', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!bannerPreview) { setImgMeta({ width: 0, height: 0 }); return; }
    const img = new Image();
    img.onload = () => setImgMeta({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = bannerPreview;
  }, [bannerPreview]);

  const cropBanner = async () => {
    if (!bannerPreview) return undefined;
    const img = await new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.src = bannerPreview;
    });
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_W;
    canvas.height = TARGET_H;
    const ctx = canvas.getContext('2d');
    const baseScale = Math.max(TARGET_W / img.width, TARGET_H / img.height);
    const scale = baseScale * Math.max(1, zoom);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const extraX = Math.max(0, drawW - TARGET_W);
    const extraY = Math.max(0, drawH - TARGET_H);
    const x = -extraX / 2 + (offsetX * extraX) / 2;
    const y = -extraY / 2 + (offsetY * extraY) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, TARGET_W, TARGET_H);
    ctx.drawImage(img, x, y, drawW, drawH);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const onCreate = async () => {
    if (!title.trim() && !text.trim()) return;
    const finalBanner = await cropBanner();

    try {
      const created = await createAnnouncement({
        title: (title || text).slice(0, 80),
        body: text,
        annFile: banner instanceof File ? banner : undefined,
        annDataUrl: !(banner instanceof File) && finalBanner ? finalBanner : undefined,
        visible: true
      });

      const uiItem = {
        id: created.id,
        title: created.title,
        body: created.body,
        date: new Date().toISOString().slice(0,10),
        banner: created.annImg || null,
        visible: created.visible
      };

      setItems(prev => [uiItem, ...prev]);
      setTitle('');
      setText('');
      setBanner(undefined);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setImgMeta({ width: 0, height: 0 });
      setIsCreating(false);
      setToast('Announcement posted successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      setToast('Failed to create announcement');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(a => (a.title || '').toLowerCase().includes(q) || (a.body || '').toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Announcements</h1>
            <p className="text-gray-600">Create and manage platform-wide updates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full md:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all bg-white"
                placeholder="Search announcements..."
              />
            </div>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="border-red-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setTitle('');
                  setText('');
                  setBanner(undefined);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                  placeholder="Enter a catchy title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none"
                  placeholder="What would you like to announce?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} />
                  Banner Image (3:1 ratio)
                </label>
                <div
                  className="rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const f = e.dataTransfer?.files?.[0];
                    if (f) setBanner(f);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBanner(e.target.files?.[0])}
                    className="hidden"
                    id="banner-upload"
                    ref={fileInputRef}
                  />
                  <label htmlFor="banner-upload" className="cursor-pointer block text-center">
                    {!bannerPreview ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                          <ImageIcon style={{ color: 'var(--accent)' }} size={20} />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium" style={{ color: 'var(--accent)' }}>Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-gray-500">Recommended: 1200x400 pixels</div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-600 text-left">
                          Image: {imgMeta.width} × {imgMeta.height}px • Target: {TARGET_W} × {TARGET_H}px
                        </div>
                        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                          <div className="relative w-full" style={{ aspectRatio: '3 / 1' }}>
                            <img
                              src={bannerPreview}
                              alt="Preview"
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                              style={{
                                width: 'auto',
                                height: 'auto',
                                transform: `translate(-50%, -50%) scale(${Math.max(1, zoom) * Math.max(TARGET_W / Math.max(1, imgMeta.width), TARGET_H / Math.max(1, imgMeta.height))}) translate(${offsetX * 50}%, ${offsetY * 50}%)`,
                              }}
                              draggable={false}
                            />
                          </div>
                        </div>
                        <div className="space-y-3 text-left">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-gray-700">Zoom</label>
                              <span className="text-xs text-gray-600">{zoom.toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="0.01"
                              value={zoom}
                              onChange={(e) => setZoom(parseFloat(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Horizontal</label>
                              <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.01"
                                value={offsetX}
                                onChange={(e) => setOffsetX(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Vertical</label>
                              <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.01"
                                value={offsetY}
                                onChange={(e) => setOffsetY(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setBanner(undefined);
                            setBannerPreview(undefined);
                          }}
                          className="text-xs font-medium"
                          style={{ color: 'var(--accent)' }}
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setTitle('');
                    setText('');
                    setBanner(undefined);
                  }}
                  className="px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onCreate}
                  disabled={!title.trim() && !text.trim()}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Post Announcement
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <Card className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-600">No announcements found</p>
            </Card>
          )}
          {filtered.map((a, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              {a.banner && (
                <div className="w-full mb-4 rounded-xl overflow-hidden border border-gray-100">
                  <div className="w-full" style={{ aspectRatio: '3 / 1' }}>
                    <img src={a.banner} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {a.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{a.title}</h3>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap mb-3">{a.body}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={async () => {
                      const newTitle = prompt('Edit title:', a.title);
                      if (newTitle == null) return;
                      try {
                        const updated = await updateAnnouncement(a.id, { title: newTitle });
                        setItems(prev => prev.map(x => x.id === a.id ? { ...x, title: updated.title } : x));
                        setToast('Announcement updated');
                        setTimeout(() => setToast(null), 3000);
                      } catch (err) {
                        console.error(err);
                        setToast('Failed to update announcement');
                        setTimeout(() => setToast(null), 3000);
                      }
                    }}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                        setConfirm({
                          title: 'Delete announcement?',
                          body: 'This action cannot be undone.',
                          onConfirm: async () => {
                            try {
                              await deleteAnnouncement(a.id);
                              setItems(prev => prev.filter(x => x.id !== a.id));
                              setToast('Announcement deleted');
                              setTimeout(() => setToast(null), 3000);
                              setConfirm(null);
                            } catch (err) {
                              console.error(err);
                              setToast('Failed to delete announcement');
                              setTimeout(() => setToast(null), 3000);
                              setConfirm(null);
                            }
                          },
                        });
                      }}
                    className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          body={confirm.body}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}