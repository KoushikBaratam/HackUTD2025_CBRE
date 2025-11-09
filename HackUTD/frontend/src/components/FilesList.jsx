import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FilesList = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  // Load files from localStorage on component mount
  useEffect(() => {
    const loadFiles = () => {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      // Sort by upload date (newest first)
      const sortedFiles = storedFiles.sort((a, b) => 
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setFiles(sortedFiles);
    };

    loadFiles();
    
    // Listen for storage events to update when files are added from other tabs
    window.addEventListener('storage', loadFiles);
    
    return () => {
      window.removeEventListener('storage', loadFiles);
    };
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-cbre-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-cbre-green rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ClauseChain</h1>
                <p className="text-xs text-gray-500">Contract Intelligence Platform</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="text-sm text-gray-600 hover:text-cbre-green transition-colors"
              >
                Home
              </button>
              <button className="text-sm font-medium text-cbre-green">
                Files
              </button>
              <button className="text-sm text-gray-600 hover:text-cbre-green transition-colors">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Uploaded Files</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage your uploaded documents
          </p>
        </div>

        {/* Files List */}
        <div className="space-y-4">
          {files.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload your first document to get started
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="px-4 py-2 bg-cbre-green text-white rounded-lg hover:bg-cbre-green-light transition-colors"
              >
                Upload Files
              </button>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* File Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-red-600"
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {file.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">
                            Uploaded {formatDate(file.uploadedAt)}
                          </p>
                          <span className="text-gray-300">•</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              file.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {file.status === 'processed' ? 'Processed' : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="px-3 py-1.5 text-sm text-cbre-green hover:bg-green-50 rounded-md border border-cbre-green transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Summary Section */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Document Summary
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {file.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesList;