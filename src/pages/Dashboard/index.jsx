import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaDownload, FaTrash } from 'react-icons/fa'; // Import FaTrash for delete icon
import DocumentModal from './components/document_model';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import axios from 'axios';
import FilePreview from './components/document_preview';

const Dashboard = ({ searchQuery, showProfileModal, showUploadModal }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const API_URL = import.meta.env.VITE_API_URL;
  const [aadharPresent, setIsAadharPresent] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showDeleteConfirmModal, setShowConfirmDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const documentTypes = [
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

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.post(`${API_URL}/get-documents/`, {}, { withCredentials: true });
        if (response.data.success === true) {
          setDocuments(response.data.documents);
        } else {
          toast.error(`Some problem occurred while retrieving documents: ${response.data.message}`);
        }
      } catch (err) {
        toast.error("Failed to retrieve documents");
      }
    };

    fetchDocuments();
  }, [showUploadModal]);

  useEffect(() => {
    const checkAadharLink = async () => {
      try {
        const response = await axios.post(`${API_URL}/check-user-adhar-link/`, {}, { withCredentials: true });
        setIsAadharPresent(response.data.aadhar_present === true);
      } catch (error) {
        toast.error("Some error occurred");
        console.error("Check Aadhar Link Error:", error);
      }
    };
    checkAadharLink();
  }, [showProfileModal]);

  const openModal = (doc) => {
    setCurrentDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDoc(null);
  };

  const handleCheckboxChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSelectChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([type]);
    }
  };

  const filterDocuments = (docs, query) => {
    if (!query) return docs;
    return docs.filter(doc => doc.document_name.toLowerCase().includes(query.toLowerCase()));
  };

  const filteredDocuments = selectedTypes.length === 0
    ? documents
    : documents.filter(doc => selectedTypes.includes(doc.document_category));

  const handleDownload = (doc) => {
    if (doc.upload_data) {
      const byteCharacters = atob(doc.upload_data);
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
  
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
  
      const blob = new Blob(byteArrays, { type: doc.document_extension });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = doc.document_name || 'document';
      link.click(); 
    } else {
      const link = document.createElement('a');
      link.href = doc.upload_url; 
      link.download = doc.document_name || 'document';
      link.click();
    }
  };

  const handleDelete = async (documentName) => {
    try {
      const response = await axios.post(`${API_URL}/delete-documents/`, {document_name: documentName}, { withCredentials: true });
      if (response.data.success == true) {
        setDocuments(documents.filter(doc => doc.document_name !== documentName));
        toast.success(response.data.message);
        setShowConfirmDeleteModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(`Delete failed: ${err.response.data.detail}`);
        console.error('Error details:', err.response.data);
      } else {
        toast.error("Delete failed. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard flex flex-col md:flex-row p-6">
      {aadharPresent ? (
        <>
          <div className="md:!h-[80vh] left-section flex-none w-full md:w-1/5 mb-6 md:mb-0 overflow-y-auto border-r pr-4">
            <h4 className="!text-lg font-semibold mb-4 !font-bold">FILTERS</h4>
            {isMobile ? (
              <select
                onChange={(e) => handleSelectChange(e.target.value)}
                className="form-select w-full border p-2 rounded-md text-sm"
                value={selectedTypes[0] || ""}
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            ) : (
              <div className="dashboard-filters space-y-3">
                {documentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                      className="filter-checkboxes appearance-none w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 border-2 border-gray-800 rounded-xs checked:bg-black checked:border-black checked:before:content-['✓'] checked:before:absolute checked:before:text-white checked:before:text-sm checked:before:font-bold checked:before:inset-0 checked:before:flex checked:before:items-center checked:before:justify-center focus:outline-none relative"
                    />
                    <label htmlFor={type} className="text-sm mx-2 text-black">{type}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="right-section flex-1 ml-0 md:ml-6 max-h-[80vh] overflow-y-auto p-2">
            <h4 className="text-lg !font-bold !mb-6">DOCUMENTS</h4>
            <div className="documents-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length === 0
                ? <p>No documents available.</p>
                : filteredDocuments.flatMap((doc) =>
                    filterDocuments([doc], searchQuery).map((doc) => (
                      <div className="pb-3 document-item hover:scale-102 transition-scale duration-200 mb-4 border rounded-lg shadow-sm hover:shadow-xl transition duration-300">
                        <div className="document-preview mb-2 relative">
                          <div className="absolute -top-1 -left-1 rounded-bl-lg text-white">
                            {doc.document_extension === "pdf" && <span className="bg-red-500 p-2 rounded">{`PDF`}</span>}
                            {doc.document_extension === "pptx" && <span className="bg-orange-600 p-2 rounded">{`PPT`}</span>}
                            {["png", "jpg", "webp"].includes(doc.document_extension) && <span className="bg-blue-400 p-2 rounded">{`Image`}</span>}
                            {(doc.document_extension === "docx" || doc.document_extension === "doc") && <span className="bg-blue-500 p-2 rounded">{`Doc`}</span>}
                            {["xlsx", "xls"].includes(doc.document_extension) && <span className="bg-green-600 p-2 rounded">{`Excel`}</span>}
                            {doc.document_extension === "txt" && <span className="bg-gray-500 p-2 rounded">{`TXT`}</span>}
                          </div>

                          <FilePreview base64String={doc.upload_data} fileType={doc.document_extension} />
                        </div>

                        <div className="document-info text-center">
                          <span className="font-medium">{doc.document_name}</span>
                          <div className="action-icons flex justify-center space-x-4 mt-2">
                            <FaShareAlt className="text-xl cursor-pointer text-blue-500 hover:scale-125 transition duration-200" title="Share" />
                            <FaDownload
                              className="text-xl cursor-pointer text-green-500 hover:scale-125 transition duration-200"
                              title="Download"
                              onClick={() => handleDownload(doc)} 
                            />
                            <FaTrash
                              className="text-xl cursor-pointer text-red-500 hover:scale-125 transition duration-200"
                              title="Delete"
                              onClick={() => {
                                setDocToDelete(doc);
                                setShowConfirmDeleteModal(true);
                              }}
                            />

                          </div>
                        </div>
                      </div>
                    ))
                  )}
            </div>
          </div>
        </>
      ) : (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
          <p className="text-red-500 mt-4">Please link your Aadhar in the profile menu!</p>
        </div>
      )}

      {isModalOpen && (
        <DocumentModal doc={currentDoc} closeModal={closeModal} />
      )}
      {showDeleteConfirmModal && docToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="delete-confirm-modal bg-white p-6 rounded-lg shadow-lg max-w-[90vw] md:max-w-[35vw]">
            <h5 className="!text-md !font-bold mb-4">
              Are you sure you want to delete {docToDelete.document_name} ? 
            </h5>
            <div className="flex justify-end !space-x-4">
              <button
                className="delete-cancel-button px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowConfirmDeleteModal(false);
                  setDocToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(docToDelete.document_name)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
