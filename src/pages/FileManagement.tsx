import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, Download, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface FileItem {
  id: string;
  filename: string;
  file_type: string;
  uploaded_at: string;
  file_url: string;
  audit_id?: string;
}

const FileManagement: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [user]);

  const loadFiles = async () => {
    // Mock file loading - in real app would use Supabase storage
    setLoading(true);
    setTimeout(() => {
      const mockFiles: FileItem[] = [
        {
          id: '1',
          filename: 'sitemap.xml',
          file_type: 'application/xml',
          uploaded_at: '2024-01-15T10:30:00Z',
          file_url: '#',
        },
        {
          id: '2',
          filename: 'robots.txt',
          file_type: 'text/plain',
          uploaded_at: '2024-01-14T14:20:00Z',
          file_url: '#',
        },
      ];
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const file = fileList[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/plain', 'application/xml', 'text/xml', 'application/json'];
    if (!allowedTypes.includes(file.type)) {
      addNotification('error', 'Only XML, TXT, and JSON files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addNotification('error', 'File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      // Mock file upload - in real app would use Supabase storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFile: FileItem = {
        id: 'file-' + Date.now(),
        filename: file.name,
        file_type: file.type,
        uploaded_at: new Date().toISOString(),
        file_url: '#',
      };
      
      setFiles(prev => [newFile, ...prev]);
      addNotification('success', 'File uploaded successfully');
    } catch (error) {
      addNotification('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      addNotification('success', 'File deleted successfully');
    } catch (error) {
      addNotification('error', 'Failed to delete file');
    }
  };

  const downloadFile = (file: FileItem) => {
    // Mock download - in real app would use actual file URL
    addNotification('info', `Downloading ${file.filename}...`);
  };

  const getFileIcon = (fileType: string) => {
    return <File className="h-5 w-5 text-blue-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File Management</h1>
          <p className="text-gray-400">Upload and manage SEO-related files like sitemaps, robots.txt, and configuration files</p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xml,.txt,.json"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            <div className="space-y-4">
              <Upload className={`h-12 w-12 mx-auto ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
              <div>
                <h3 className="text-lg font-medium text-white">
                  {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
                </h3>
                <p className="text-gray-400 mt-2">
                  Supports XML, TXT, and JSON files up to 10MB
                </p>
              </div>
              {uploading && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Uploaded Files</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No files uploaded</h3>
              <p className="text-gray-400">Upload your first SEO file to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {files.map((file) => (
                <div key={file.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.file_type)}
                      <div>
                        <div className="text-sm font-medium text-white">{file.filename}</div>
                        <div className="text-xs text-gray-400 flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{file.file_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadFile(file)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagement;