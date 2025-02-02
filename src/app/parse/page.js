// src\app\parse\page.js
'use client';
import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('prescription'); // or 'medical'

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const endpoint = analysisType === 'prescription' 
        ? '/api/parse-prescription'
        : '/api/parse-test';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Medical Document Analyzer</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Select Analysis Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
            >
              <option value="prescription">Prescription Analysis</option>
              <option value="medical">Medical Report Analysis</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full"
              />
            </div>

            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !image
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Analyze Image'}
            </button>
          </form>

          {analysis && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Analysis Results:</h2>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}