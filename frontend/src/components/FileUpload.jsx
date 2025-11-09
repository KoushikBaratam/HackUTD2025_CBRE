import { useState, useRef } from 'react';
import Loading from './Loading';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );

    if (droppedFiles.length > 0) {
      const newFiles = droppedFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        status: 'pending'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );

    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        status: 'pending'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[id];
      return newStatus;
    });
  };

  // API call function for uploading files
  const uploadFileToAPI = async (file) => {
    // Verify file exists and is a valid File object
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object');
    }

    // TODO: Update API endpoint and add any required headers/auth
    const formData = new FormData();
    formData.append('file', file, file.name); // Include filename explicitly

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      // Add headers if needed (don't set Content-Type, let browser set it with boundary):
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      // },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsProcessing(true);
    
    // Update all files to uploading status
    setFiles(prev => prev.map(f => 
      pendingFiles.some(pf => pf.id === f.id) 
        ? { ...f, status: 'uploading' } 
        : f
    ));
    
    // Upload all files sequentially
    for (const fileObj of pendingFiles) {
      try {
        // Call the API to upload the file
        const result = await uploadFileToAPI(fileObj.file);
        
        // Handle successful upload
        console.log('File uploaded successfully:', fileObj.name, result);
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        console.error('Upload error for', fileObj.name, ':', error);
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setIsProcessing(false);
  };

  // Show loading screen when processing
  if (isProcessing) {
    // Count files that are uploading or about to be uploaded
    const uploadingFiles = files.filter(f => f.status === 'uploading' || f.status === 'pending');
    const uploadingCount = uploadingFiles.length > 0 ? uploadingFiles.length : 1;
    const message = uploadingCount > 1 
      ? `Processing ${uploadingCount} files...` 
      : 'Processing file...';
    return <Loading message={message} />;
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-cbre-gray-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-cbre-green rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">CC</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Upload Documents</h2>
          <p className="mt-2 text-sm text-gray-600">
            Upload contract and ESG PDF documents for analysis
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg mb-6">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-cbre-green bg-green-50'
                : 'border-gray-300 hover:border-cbre-green hover:bg-gray-50'
            }`}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600 mb-4">
              <p className="text-lg font-medium">Drag and drop PDF files here</p>
              <p className="text-sm mt-2">or</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cbre-green hover:bg-cbre-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbre-green transition-colors duration-200"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="mt-4 text-xs text-gray-500">
              PDF files only (Max file size: 50MB)
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white py-6 px-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Selected Files ({files.length})
              </h3>
              {files.some(f => f.status === 'pending') && (
                <button
                  onClick={handleUploadAll}
                  className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cbre-green hover:bg-cbre-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbre-green transition-colors duration-200"
                >
                  Upload Files
                </button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cbre-green transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileObj.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileObj.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    {fileObj.status === 'pending' && (
                      <span className="text-sm text-gray-500">Ready to upload</span>
                    )}
                    {fileObj.status === 'uploading' && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Uploading...
                      </div>
                    )}
                    {fileObj.status === 'success' && (
                      <div className="flex items-center text-sm text-green-600">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Uploaded
                      </div>
                    )}
                    {fileObj.status === 'error' && (
                      <div className="flex items-center text-sm text-red-600">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Error
                      </div>
                    )}
                    {fileObj.status === 'pending' && (
                      <button
                        onClick={() => handleRemoveFile(fileObj.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove file"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 ClauseChain. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;

