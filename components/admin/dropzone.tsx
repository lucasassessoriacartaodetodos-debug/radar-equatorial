"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, FileSpreadsheet, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export function Dropzone({ onFileSelect, accept = ".xlsx,.xls", disabled }: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(e.type === "dragenter" || e.type === "dragover");
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [disabled, onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (selectedFile) {
    return (
      <div className="eq-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-equatorial-teal/10 flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-equatorial-teal" />
          </div>
          <div>
            <p className="text-sm font-medium text-graphite-100">{selectedFile.name}</p>
            <p className="text-xs text-graphite-400">
              {(selectedFile.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-status-danger
                       hover:bg-graphite-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
        dragActive
          ? "border-equatorial-teal bg-equatorial-teal/5"
          : "border-graphite-700 hover:border-graphite-600 hover:bg-graphite-850",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-graphite-800 flex items-center justify-center">
          <UploadCloud className="h-6 w-6 text-graphite-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-graphite-100">
            Arraste o arquivo aqui ou clique para selecionar
          </p>
          <p className="text-xs text-graphite-500 mt-1">
            Formatos aceitos: {accept}
          </p>
        </div>
      </div>
    </div>
  );
}