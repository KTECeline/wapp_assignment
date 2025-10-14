import React, { useState } from 'react';
import Card from '../../components/Card';
import { announcements as seed } from '../../data/announcements';
import { useConfirm } from '../../components/Confirm';
import { useToast } from '../../components/Toast';

export default function Announcements() {
  const [items, setItems] = useState(seed);
  const [text, setText] = useState('');
  const { add } = useToast();
  const { confirm } = useConfirm();
  const onCreate = () => {
    if (!text.trim()) return;
    const record = { title: text.slice(0, 40), body: text, date: new Date().toISOString().slice(0,10) };
    setItems(prev => [record, ...prev]);
    setText('');
    add('Announcement posted');
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Announcements</h2>
      <Card title="Create announcement">
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full min-h-32 rounded-xl border border-rose-200 p-3" placeholder="Write something..." />
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary" onClick={onCreate}>Post</button>
        </div>
      </Card>
      <div className="space-y-3">
        {items.map((a, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-800">{a.title}</div>
                <div className="text-sm text-slate-600 whitespace-pre-wrap">{a.body}</div>
                <div className="text-xs text-rose-500 mt-1">{a.date}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-warning text-xs" onClick={() => { const title = prompt('Edit title', a.title); if (title!=null){ setItems(prev => prev.map((x,idx)=> idx===i? {...x,title}:x)); add('Announcement updated'); } }}>Edit</button>
                <button className="btn btn-danger text-xs" onClick={async () => { if (await confirm({ title: 'Delete announcement?', body: 'This action cannot be undone.' })) { setItems(prev => prev.filter((_, idx) => idx !== i)); add('Announcement deleted'); } }}>Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
