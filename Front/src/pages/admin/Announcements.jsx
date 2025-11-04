import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import { announcements as seed } from '../../data/announcements';
import { useConfirm } from '../../components/Confirm';
import { useToast } from '../../components/Toast';
import DropUpload from '../../components/DropUpload.jsx';

export default function Announcements() {
  const [items, setItems] = useState(seed);
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState();
  const [bannerPreview, setBannerPreview] = useState();
  const [imgMeta, setImgMeta] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0); // -1 .. 1
  const [offsetY, setOffsetY] = useState(0); // -1 .. 1
  const TARGET_W = 1200;
  const TARGET_H = 400;
  const { add } = useToast();
  const { confirm } = useConfirm();
  useEffect(() => {
    if (!banner || !(banner instanceof File)) return setBannerPreview(undefined);
    const reader = new FileReader();
    reader.readAsDataURL(banner);
    reader.onloadend = () => setBannerPreview(reader.result);
  }, [banner]);
  useEffect(() => {
    if (!bannerPreview) { setImgMeta({ width: 0, height: 0 }); return; }
    const img = new Image();
    img.onload = () => setImgMeta({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = bannerPreview;
  }, [bannerPreview]);

  const cropBanner = async () => {
    if (!bannerPreview) return undefined;
    // Ensure image is loaded
    const img = await new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.src = bannerPreview;
    });
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_W;
    canvas.height = TARGET_H;
    const ctx = canvas.getContext('2d');
    // Base scale for cover, then apply zoom
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
    const record = {
      title: (title || text).slice(0, 80),
      body: text,
      date: new Date().toISOString().slice(0,10),
      banner: finalBanner || bannerPreview,
    };
    setItems(prev => [record, ...prev]);
    setTitle('');
    setText('');
    setBanner(undefined);
    setZoom(1); setOffsetX(0); setOffsetY(0); setImgMeta({ width: 0, height: 0 });
    add('Announcement posted');
  };
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(a => (a.title || '').toLowerCase().includes(q) || (a.body || '').toLowerCase().includes(q));
  }, [items, query]);
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500">Create and manage platform-wide updates</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="w-64 md:w-72 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#F2E6E0', boxShadow: 'inset 0 0 0 0px transparent' }}
              placeholder="Search announcements..."
            />
          </div>
        </div>
      </div>
      <Card title="Create announcement">
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2"
            style={{ borderColor: '#F2E6E0' }}
            placeholder="Title (optional)"
          />
          <textarea
            value={text}
            onChange={(e)=>setText(e.target.value)}
            className="w-full min-h-32 rounded-xl border p-3 focus:outline-none focus:ring-2"
            style={{ borderColor: '#F2E6E0' }}
            placeholder="Write something..."
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium">Banner (3:1)</label>
            <div className="rounded-xl border p-3 space-y-3 bg-white" style={{ borderColor: '#F2E6E0' }}>
              <DropUpload className="!border-0" value={banner} onChange={setBanner} description="Recommended: 1200x400 (3:1)" />
              {bannerPreview ? (
                <>
                  <div className="text-xs text-gray-600">Image size: {imgMeta.width} × {imgMeta.height} • Target: {TARGET_W} × {TARGET_H} (3:1)</div>
                  <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
                    <div className="relative w-full" style={{ aspectRatio: '3 / 1' }}>
                      <img
                        src={bannerPreview}
                        alt="Adjust preview"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                        style={{
                          width: 'auto',
                          height: 'auto',
                          transform: `translate(-50%, -50%) scale(${Math.max(1, zoom) * Math.max(TARGET_W / Math.max(1, imgMeta.width), TARGET_H / Math.max(1, imgMeta.height))}) translate(${offsetX * 50}%, ${offsetY * 50}%)`,
                          willChange: 'transform',
                        }}
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600">Zoom: {zoom.toFixed(2)}x</label>
                      <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e)=>setZoom(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600">Horizontal</label>
                        <input type="range" min="-1" max="1" step="0.01" value={offsetX} onChange={(e)=>setOffsetX(parseFloat(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Vertical</label>
                        <input type="range" min="-1" max="1" step="0.01" value={offsetY} onChange={(e)=>setOffsetY(parseFloat(e.target.value))} className="w-full" />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary" onClick={onCreate}>Post</button>
        </div>
      </Card>
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <Card key={i}>
            {a.banner ? (
              <div className="w-full mb-3 rounded-xl overflow-hidden border" style={{ borderColor: '#F2E6E0' }}>
                <div className="w-full" style={{ aspectRatio: '3 / 1', backgroundColor: '#FFF8F2' }}>
                  <img src={a.banner} alt="Announcement banner" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : null}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-gray-900">{a.title}</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{a.body}</div>
                <div className="inline-flex items-center gap-2 mt-2 text-xs rounded-full px-2 py-0.5 border" style={{ color: '#B13A33', borderColor: '#F2E6E0', backgroundColor: '#FFF8F2' }}>{a.date}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline text-xs"
                  onClick={() => {
                    const newTitle = prompt('Edit title', a.title);
                    if (newTitle != null) {
                      setItems(prev => prev.map((x,idx)=> idx===i? {...x,title:newTitle}:x));
                      add('Announcement updated');
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger text-xs"
                  onClick={async () => {
                    if (await confirm({ title: 'Delete announcement?', body: 'This action cannot be undone.' })) {
                      setItems(prev => prev.filter((_, idx) => idx !== i));
                      add('Announcement deleted');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
