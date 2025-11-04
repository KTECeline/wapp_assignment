import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

// Lightweight JS version of DropUpload (drag-and-drop + preview)
export default function DropUpload({
  className = '',
  onChange,
  value,
  placeholder,
  description,
  defaultValue,
  title = 'Upload a file',
  accept = 'image/png,image/jpeg,image/gif,image/webp',
  disabled = false,
  preview: customPreview,
}) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [focus, setFocus] = useState(false);

  const dragenter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setFocus(true);
  }, []);
  const dragleave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setFocus(false);
  }, []);
  const dragover = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setFocus(true);
  }, []);
  const drop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setFocus(false);
    const files = event?.dataTransfer?.files;
    if (files && files[0]) {
      onChange?.(files[0]);
    }
  }, [onChange]);

  const onInputChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { files } = event.currentTarget;
    if (files && files[0]) {
      onChange?.(files[0]);
    }
  };

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.addEventListener('dragenter', dragenter, false);
    el.addEventListener('dragleave', dragleave, false);
    el.addEventListener('dragover', dragover, false);
    el.addEventListener('drop', drop, false);
    return () => {
      el.removeEventListener('dragenter', dragenter);
      el.removeEventListener('dragleave', dragleave);
      el.removeEventListener('dragover', dragover);
      el.removeEventListener('drop', drop);
    };
  }, [dragenter, dragleave, dragover, drop]);

  const [previewURL, setPreviewURL] = useState();

  useEffect(() => {
    const makePreview = async () => {
      if (!value || !(value instanceof File)) {
        setPreviewURL(defaultValue);
        return;
      }
      if (customPreview) {
        const url = await customPreview(value);
        setPreviewURL(url);
        return;
      }
      const url = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onloadend = () => resolve(reader.result);
      });
      setPreviewURL(url);
    };
    makePreview();
  }, [value, customPreview, defaultValue]);

  return (
    <div
      className={`${className} flex justify-center rounded-xl border-2 border-dashed`}
      style={{ borderColor: focus ? '#D9433B' : '#F2E6E0', boxShadow: focus ? '0 0 0 2px rgba(217, 67, 59, 0.15)' : 'none' }}
      ref={ref}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <div className="space-y-1 text-center px-6 pt-5 pb-6 flex flex-col items-center justify-center">
        {previewURL ? (
          <div className="relative">
            <img src={previewURL} alt="Preview" className="mx-auto w-40 h-40 object-contain max-w-full mb-4" draggable={false} />
            {value ? (
              <AiFillCloseCircle
                className="w-5 h-5 text-[#B13A33] absolute right-0 top-0 cursor-pointer rounded-full"
                onClick={() => onChange?.(undefined)}
              />
            ) : null}
          </div>
        ) : (
          placeholder ?? (
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          )
        )}
        <div className="flex text-sm text-gray-600 flex-row items-center">
          <label className="font-inter relative cursor-pointer bg-white rounded-md text-[#B13A33] px-2 py-1 border transition-all duration-200 hover:bg-[#FFF8F2]"
            style={{ borderColor: '#D9433B' }}
          >
            <span>{title}</span>
            <input ref={inputRef} type="file" accept={accept || 'image/*'} className="sr-only" onChange={onInputChange} disabled={disabled} />
          </label>
          <p className="pl-[6px] text-gray-500">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
