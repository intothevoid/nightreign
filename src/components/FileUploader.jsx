import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseWorkbook } from '../utils/excelParser';

export function FileUploader({ onDataLoaded }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleManualUpload = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    files.forEach(file => {
      if (file.name.endsWith('.xlsx')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const parsedData = parseWorkbook(workbook);
            onDataLoaded(parsedData);
          } catch (error) {
            console.error('Error parsing file:', error);
            alert('Failed to parse Excel file. Please ensure it is a valid .xlsx file.');
          }
        };

        reader.readAsArrayBuffer(file);
      }
    });
  };

  return (
    <div
      className={`relative group transition-all duration-300 border-dashed border-2 rounded-xl px-6 py-3 flex items-center gap-3 cursor-pointer
        ${dragActive
          ? 'border-amber-500 bg-amber-900/20 scale-105'
          : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900/50'
        }
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept=".xlsx"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleManualUpload}
      />
      <div className="bg-neutral-800 p-2 rounded-full group-hover:bg-neutral-700 transition-colors">
        <Upload size={18} className="text-neutral-400 group-hover:text-amber-500 transition-colors" />
      </div>
      <div className="text-sm">
        <p className="text-neutral-300 font-medium group-hover:text-amber-100 transition-colors">
          Drop .xlsx File
        </p>
        <p className="text-neutral-500 text-xs">
          or click to browse
        </p>
      </div>
    </div>
  );
}
