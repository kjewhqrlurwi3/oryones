'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function Verification() {
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const studentIdDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setStudentIdFile(acceptedFiles[0])
  });

  const nationalIdDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setNationalIdFile(acceptedFiles[0])
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Handle file uploads and verification submission
      if (studentIdFile) {
        const formData = new FormData();
        formData.append('file', studentIdFile);
        // Upload student ID and get URL
        const studentIdUrl = 'uploaded_url_here'; // Replace with actual upload logic

        await fetch('/api/user/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentType: 'studentId',
            documentUrl: studentIdUrl
          }),
        });
      }

      if (nationalIdFile) {
        const formData = new FormData();
        formData.append('file', nationalIdFile);
        // Upload national ID and get URL
        const nationalIdUrl = 'uploaded_url_here'; // Replace with actual upload logic

        await fetch('/api/user/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentType: 'nationalId',
            documentUrl: nationalIdUrl
          }),
        });
      }

      setSuccess('Documents submitted successfully for verification');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Failed to submit documents');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Document Verification</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>
            <div {...studentIdDropzone.getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input {...studentIdDropzone.getInputProps()} />
              {studentIdFile ? (
                <p className="text-sm text-gray-600">{studentIdFile.name}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  Drag & drop your student ID, or click to select
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National ID
            </label>
            <div {...nationalIdDropzone.getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input {...nationalIdDropzone.getInputProps()} />
              {nationalIdFile ? (
                <p className="text-sm text-gray-600">{nationalIdFile.name}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  Drag & drop your national ID, or click to select
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || (!studentIdFile && !nationalIdFile)}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              uploading || (!studentIdFile && !nationalIdFile)
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Submit Documents'}
          </button>
        </form>
      </div>
    </div>
  );
}