import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaDownload, FaCog } from 'react-icons/fa';
import DocumentModal from './components/document_model';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = ({ searchQuery, showProfileModal }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const API_URL = import.meta.env.VITE_API_URL;
  const [aadharPresent, setIsAadharPresent] = useState(true);
  const [documents, setDocuments] = useState([]);

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
  }, []);

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

  return (
    <div className="dashboard flex flex-col md:flex-row p-6">
      {aadharPresent ? (
        <>
          <div className="md:!h-[80vh] left-section flex-none w-full md:w-1/5 mb-6 md:mb-0 overflow-y-auto border-r pr-4">
            <h4 className="text-xl font-semibold mb-4">Document Types</h4>
            {isMobile ? (
              <select
                onChange={(e) => handleSelectChange(e.target.value)}
                className="form-select w-full border p-2 rounded-md text-sm"
                value={selectedTypes[0] || ""}
              >
                <option value="" disabled>Select Document Type</option>
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
            <h4 className="text-xl font-semibold mb-6">Documents</h4>
            <div className="documents-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length === 0
                ? <p>No documents available.</p>
                : filteredDocuments.flatMap((doc) =>
                    filterDocuments([doc], searchQuery).map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => openModal(doc)}
                        className="document-item hover:scale-102 transition-scale duration-200 pb-3 mb-4 border rounded-lg shadow-sm hover:shadow-xl cursor-pointer transition duration-300"
                      >
                        <div className="document-preview mb-2">
                          <img
                            src={doc.upload_data}
                            alt={doc.document_name}
                            className="h-40 md:h-70 w-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="document-info text-center">
                          <span className="font-medium">{doc.document_name}</span>
                          <div className="action-icons flex justify-center space-x-4 mt-2">
                            <FaShareAlt className="cursor-pointer text-blue-500" title="Share" />
                            <FaDownload className="cursor-pointer text-green-500" title="Download" />
                            <FaCog className="cursor-pointer text-gray-500" title="Manage" />
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

      <DocumentModal isOpen={isModalOpen} closeModal={closeModal} document={currentDoc} />
    </div>
  );
};

export default Dashboard;
