import React, { useState, useContext } from 'react';
import Lottie from 'lottie-react';
import docuploadanimation from "../../../assets/images/docuploadanimation.json";
import { toast } from 'react-toastify';
import axios from 'axios';
import { DocumentsContext } from '../../../context/DocumentContext';

const UploadDocumentModal = ({ onClose }) => {
  const { fetchDocuments, getUserStorage } = useContext(DocumentsContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedCategory) return;

    setLoading(true);

    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop();

    const reader = new FileReader();
    reader.onload = async function (e) {
      const buffer = e.target.result;

      const base64String = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const docData = {
        document_name: fileName,
        document_extension: fileExtension,
        document_category: selectedCategory,
        upload_data: base64String,
      };

      try {
        const response = await axios.post(`${API_URL}/upload-document/`, docData, {
          withCredentials: true,
        });

        if (response.data.success === true) {
          toast.success("Document Saved!");
          setSelectedFile(null);
          setSelectedCategory("");
          onClose();
          fetchDocuments();
          getUserStorage();
        } else {
          toast.error(`Failed to upload document! ${response.data.message}`);
        }
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(`Upload failed: ${err.response.data.detail}`);
          console.error('Error details:', err.response.data);
        } else {
          toast.error("Upload failed. Please try again.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const categoryOptions = [
    "Unique Identification & Identity Proofs",
    "Address Proofs",
    "Education-related Documents",
    "Healthcare & Medical Documents",
    "Financial & Legal Documents",
    "Business-related Documents",
    "Government Schemes & Social Welfare Documents",
    "Marriage and Family Documents",
    "Legal Documents",
  ];

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 px-4"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="upload-doc-modal bg-white w-lg max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-4 relative">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">Upload Document</p>
          <button
            onClick={onClose}
            className="!text-3xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <p className="text-sm">
          For optimal performance, we recommend avoiding the upload of large files, as it may impact the preview load time.
        </p>
        <hr className="border border-black mb-4" />

        {/* Drag-and-Drop Area */}
        <div
          className="drag-drop-area flex pb-4 flex-col items-center justify-center border-2 border-dashed rounded hover:border-blue-400 hover:bg-blue-100 transition-all duration-200 w-full min-h-[220px] cursor-pointer text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label htmlFor="fileUpload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <Lottie animationData={docuploadanimation} loop autoplay className="h-32" />
            <p className="text-black drag-drop-text">Drag and drop files here</p>
            <span className="mt-2 px-3 py-1 bg-white border rounded text-black text-sm font-bold">
              Select File
            </span>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Display Selected File */}
        {selectedFile && (
          <p className="mt-2 text-sm text-green-700 font-medium">
            Selected file: {selectedFile.name}
          </p>
        )}

        {/* Category Selector and Upload Button */}
        <div className="flex justify-between gap-4 mt-4 items-center">
          <select
            id="docCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded w-3/4"
            required
          >
            <option value="" disabled>Select category</option>
            {categoryOptions.map((option, index) => (
              <option className="option-list bg-gray-100 text-black" key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || !selectedCategory || loading}
            className={`px-4 py-2 rounded text-white flex items-center justify-center ${
              selectedFile && selectedCategory && !loading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="status"
                aria-label="Loading"
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
                  d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 1120 12h2a10 10 0 00-10-10z"
                />
              </svg>
            ) : (
              'Upload'
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
