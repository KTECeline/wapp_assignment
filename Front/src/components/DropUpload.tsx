
import { ChangeEvent, FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai';


interface Props {
  className?: string
  onChange?: (value: File | undefined) => void
  // multiple?: boolean
  value: File
  placeholder?: ReactNode
  title?: string
  description?: string
  disabled?: boolean
  defaultValue?: string
  accept?: string
  preview?: (value: File) => string | Promise<string>
}

const DropUpload: FC<Props> = ({
  className = '',
  onChange,
  value,
  placeholder,
  description,
  defaultValue,
  title = 'Upload a file',
  accept = 'image/png,image/jpeg,image/gif,image/webp',
  disabled = false,
  preview: _preview,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState(false)

  const dragenter = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setFocus(true)
  }
  const dragleave = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setFocus(false)
  }
  const dragover = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setFocus(true)
  }
  const drop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setFocus(false)

    const files = event?.dataTransfer?.files
    if (files) {
      onChange?.(files?.[0])
    }
  }
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const { files } = event.currentTarget
    if (files) {
      onChange?.(files?.[0])
    }
  }

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('dragenter', dragenter, false)
      ref.current.addEventListener('dragleave', dragleave, false)
      ref.current.addEventListener('dragover', dragover, false)
      ref.current.addEventListener('drop', drop, false)
    }

    return () => {
      ref.current?.removeEventListener('dragenter', dragenter)
      ref.current?.removeEventListener('dragleave', dragleave)
      ref.current?.removeEventListener('dragover', dragover)
      ref.current?.removeEventListener('drop', drop)
    }
  }, [])

  const [previewURL, setPreviewURL] = useState<string>()

  const preview = async () => {
    if (!value || !(value instanceof File)) {
      return setPreviewURL(defaultValue)
    }
    if (_preview) {
      return setPreviewURL(await _preview(value))
    }
    return setPreviewURL(
      await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(value)
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
      })
    )
  }

  useEffect(() => {
    preview()
  }, [value, _preview, defaultValue])

  return (
    <div className={`${className} ${focus ? 'ring-primary-500 border-primary-500' : 'border-gray-300 border-dashed'} flex justify-center border-2 rounded-md`}
      ref={ref}
    >
      <div className="space-y-1 text-center px-6 pt-5 pb-6 flex flex-col items-center justify-center">
        {previewURL ? (
          <div className="relative w-full flex justify-center">
            <img src={previewURL} alt="Preview"
              className="mx-auto max-w-full max-h-48 object-contain mb-4"
              draggable={false}
            />
            {value ? (
              <AiFillCloseCircle
                className="w-5 h-5 text-red-500 absolute right-0 top-0 cursor-pointer rounded-full"
                onClick={() => {
                  onChange?.(undefined);
                }}
              />

            ) : null}
          </div>
        ) : placeholder ?? (
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        )}
        <div className="flex text-sm text-gray-600 flex-row items-center">
          <label id="uploadLabel" className="font-inter relative cursor-pointer bg-white rounded-md text-black px-2 py-1 border border-black transition-all duration-[600ms] hover:scale-105">
            <span>{title}</span>
            <input type="file" accept={accept} className="sr-only"
              onChange={onInputChange}
              disabled={disabled}
            />
          </label>
          <p className="pl-[6px] text-gray-500">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default DropUpload
