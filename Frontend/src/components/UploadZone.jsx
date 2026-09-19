import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function UploadZone({ file, disabled, onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const handleDragLeave = (e) => {
    // Ignore leave events fired when moving over child elements
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) onFile(e.dataTransfer.files?.[0]);
  };

  const handleChange = (e) => {
    onFile(e.target.files?.[0]);
    e.target.value = ''; // allow re-selecting the same file
  };

  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload a PDF"
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: '2px dashed',
        borderColor: dragging ? 'primary.main' : 'divider',
        bgcolor: dragging ? 'action.hover' : 'background.paper',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': disabled ? {} : { borderColor: 'primary.main' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={handleChange}
      />

      {file ? (
        <>
          <Typography sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{file.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatSize(file.size)} · Drop or choose another PDF to analyze it
          </Typography>
        </>
      ) : (
        <>
          <Typography sx={{ fontWeight: 600 }}>Drop a PDF here</Typography>
          <Typography variant="body2" color="text.secondary">
            or click to choose a file
          </Typography>
        </>
      )}
    </Box>
  );
}