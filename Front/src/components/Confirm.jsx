import React, { createContext, useCallback, useContext, useState } from 'react';

const ConfirmContext = createContext({ confirm: async () => false });

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, title: '', body: '', confirmText: 'Confirm', cancelText: 'Cancel', resolve: null });

  const confirm = useCallback(({ title = 'Are you sure?', body = 'This action cannot be undone.', confirmText = 'Confirm', cancelText = 'Cancel' } = {}) => {
    return new Promise((resolve) => {
      setState({ open: true, title, body, confirmText, cancelText, resolve });
    });
  }, []);

  const onClose = () => {
    if (state.resolve) state.resolve(false);
    setState(prev => ({ ...prev, open: false }));
  };
  const onConfirm = () => {
    if (state.resolve) state.resolve(true);
    setState(prev => ({ ...prev, open: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-lg border border-rose-100 w-[95%] max-w-md p-4">
            <h3 className="text-base font-semibold text-rose-700 mb-2">{state.title}</h3>
            <p className="text-sm text-slate-700">{state.body}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 rounded-xl border border-rose-200" onClick={onClose}>{state.cancelText}</button>
              <button className="px-3 py-2 rounded-xl bg-rose-500 text-white" onClick={onConfirm}>{state.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
