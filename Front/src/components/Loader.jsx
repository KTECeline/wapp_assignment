import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
    </div>
  );
}
