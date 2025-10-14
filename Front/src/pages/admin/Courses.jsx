import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { courses as seed } from '../../data/courses';
import { useConfirm } from '../../components/Confirm';

export default function Courses() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { add } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'category', title: 'Category' },
    { key: 'difficulty', title: 'Difficulty' },
    { key: 'enrolled', title: 'Enrolled' },
  ];

  const onSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    record.enrolled = Number(record.enrolled || 0);
    if (editing != null) {
      const next = [...rows];
      next[editing] = record;
      setRows(next);
      add('Course updated');
    } else {
      setRows(prev => [...prev, record]);
      add('Course added');
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Manage Courses</h2>
        <button
          onClick={() => {
            // Navigate to the same editor used for editing, but in create mode
            navigate('/admin/courses/edit', { state: { mode: 'create' } });
          }}
          className="btn btn-primary"
        >
          Add Course
        </button>
      </div>
      <Card>
        <Table
          columns={columns}
          data={rows}
          actions={(row) => (
            <div className="flex gap-2">
              <button
                className="btn btn-warning text-xs"
                onClick={() => {
                  // Navigate to the split-view editor, carry course context
                  navigate('/admin/courses/edit', { state: { course: row } });
                }}
              >
                Edit
              </button>
              <button className="btn btn-danger text-xs" onClick={async () => { if (await confirm({ title: 'Delete course?', body: 'This action cannot be undone.' })) { setRows(prev => prev.filter(r => r !== row)); add('Course deleted'); } }}>Delete</button>
            </div>
          )}
        />
      </Card>

      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing != null ? 'Edit Course' : 'Add Course'}
        actions={(
          <>
            <button className="btn btn-outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</button>
            <button form="course-form" className="btn btn-primary">Save</button>
          </>
        )}
      >
        <form id="course-form" onSubmit={onSave} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Title</label>
            <input name="title" defaultValue={editing != null ? rows[editing].title : ''} className="w-full rounded-xl border border-rose-200 px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">Category</label>
              <input name="category" defaultValue={editing != null ? rows[editing].category : ''} className="w-full rounded-xl border border-rose-200 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Difficulty</label>
              <input name="difficulty" defaultValue={editing != null ? rows[editing].difficulty : ''} className="w-full rounded-xl border border-rose-200 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Enrolled</label>
            <input name="enrolled" type="number" defaultValue={editing != null ? rows[editing].enrolled : 0} className="w-full rounded-xl border border-rose-200 px-3 py-2" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
