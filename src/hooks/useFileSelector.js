import { useState, useRef } from "react";

export function useFileSelector() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleSelectFile = async () => {
    const filePath = await window.electronAPI.selectFile();
    if (!filePath) return;
    setSelectedFile({ path: filePath, name: filePath.split(/[\\/]/).pop() });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile({ name: file.name, path: file.path });
  };

  return {
    selectedFile,
    isDragging,
    handleSelectFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}