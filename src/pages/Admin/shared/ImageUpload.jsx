import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';

const CLOUD_NAME   = 'dbjwnych0';
const UPLOAD_PRESET = 'buildpe_services';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(value || null);
  const [error,     setError]     = useState(null);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const secureUrl = data.secure_url;

      setPreview(secureUrl);
      onChange(secureUrl); // pass URL up to form
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(value || null); // revert preview
      onChange(value || '');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {/* If no image selected yet */}
      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '24px 16px',
            border: '1.5px dashed #D1D5DB',
            borderRadius: '8px',
            background: '#F9FAFB',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#EC1940';
            e.currentTarget.style.background = '#FFF5F7';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.background = '#F9FAFB';
          }}
        >
          {uploading ? (
            <Loader2 size={24} color="#6B7280" style={{ animation: 'adminSpin 0.75s linear infinite' }} />
          ) : (
            <Upload size={24} color="#6B7280" />
          )}
          <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'inherit' }}>
            {uploading ? 'Uploading...' : 'Click to upload image'}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'inherit' }}>
            PNG, JPG, WEBP — max 5MB
          </span>
        </button>
      ) : (
        /* Preview box */
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #E5E7EB' }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          />

          {/* Uploading overlay */}
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8
            }}>
              <Loader2 size={20} color="white" style={{ animation: 'adminSpin 0.75s linear infinite' }} />
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Uploading...</span>
            </div>
          )}

          {/* Action buttons */}
          {!uploading && (
            <div style={{
              position: 'absolute', top: 8, right: 8,
              display: 'flex', gap: 6
            }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                title="Change image"
                style={{
                  background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6,
                  color: 'white', cursor: 'pointer', padding: '5px 8px',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600
                }}
              >
                <Image size={12} /> Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                style={{
                  background: 'rgba(220,38,38,0.8)', border: 'none', borderRadius: 6,
                  color: 'white', cursor: 'pointer', padding: '5px 8px',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600
                }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#DC2626', fontFamily: 'inherit' }}>
          {error}
        </p>
      )}
    </div>
  );
}
