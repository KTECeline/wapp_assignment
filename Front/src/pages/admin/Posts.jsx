import React, { useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { posts as seed } from '../../data/posts';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/Confirm';

export default function Posts() {
  const [rows, setRows] = useState(seed);
  const { add } = useToast();
  const { confirm } = useConfirm();
  const columns = [
    { key: 'user', title: 'User' },
    { key: 'title', title: 'Title' },
    { key: 'likes', title: 'Likes' },
  ];
  return (
    <div className="space-y-4">
  <h2 className="text-xl font-semibold text-slate-800">Manage Posts</h2>
      <Card>
        <Table
          columns={columns}
          data={rows}
          actions={(row) => (
            <button className="btn btn-danger text-xs" onClick={async () => { if (await confirm({ title: 'Delete post?', body: 'This action cannot be undone.' })) { setRows(prev => prev.filter(r => r !== row)); add('Post deleted', 'success'); } }}>Delete</button>
          )}
        />
      </Card>
    </div>
  );
}
