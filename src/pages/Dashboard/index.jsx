import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaDownload, FaTrash, FaChevronLeft, FaChevronRight, FaFilter, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
  IdentificationIcon,
  HomeIcon,
  AcademicCapIcon,
  HeartIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UsersIcon,
  HeartIcon as LoveIcon,
  ScaleIcon,
} from '@heroicons/react/24/solid';
import DocumentModal from './components/document_model';
import noaadharlinkimage from '../../assets/images/dashboardimg.json';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import axios from 'axios';
import FilePreview from './components/document_preview';
import LazyLoad from 'react-lazyload';
import Lottie from 'lottie-react';
import ShareDocumentModal from './components/share_document_modal';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [openShareDocumentModal, setOpenShareDocumentModal] = useState(false);
  const [currentShareDoc, setCurrentShareDoc] = useState(null);
  const [userFileStorage, setUserFileStorage] = useState();
  const itemsPerPage = 6;

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

  const icons = [
    <IdentificationIcon className="h-6 w-6 text-blue-500" />,   // Unique ID
    <HomeIcon className="h-6 w-6 text-green-500" />,             // Address
    <AcademicCapIcon className="h-6 w-6 text-purple-500" />,     // Education
    <HeartIcon className="h-6 w-6 text-red-500" />,              // Medical
    <BanknotesIcon className="h-6 w-6 text-yellow-500" />,       // Financial/Legal
    <DocumentTextIcon className="h-6 w-6 text-indigo-500" />,    // Business Docs
    <UsersIcon className="h-6 w-6 text-pink-500" />,             // Gov & Welfare
    <LoveIcon className="h-6 w-6 text-rose-500" />,              // Marriage & Family
    <ScaleIcon className="h-6 w-6 text-gray-500" />,             // Legal
  ];

  const getUserStorage = async () => {
    try {
      const response = await axios.get(`${API_URL}/storage-usage`, {
        withCredentials: true
      });
      if (response.data.success === true) {
        setUserFileStorage(response.data.totalStorage);
      } else {
        toast.error(`Some problem occurred while retrieving storage: ${response.data.message}`);
      }
    } catch (err) {
      toast.error("Failed to retrieve storage");
    }
  };

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
    
    getUserStorage();    
    fetchDocuments();
  }, [showUploadModal]);

  const storageLimit = 100;
  const storagePercentage = (userFileStorage / storageLimit) * 100;

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


  const openShareDocModal = (doc) => {
    setCurrentShareDoc(doc);
    setOpenShareDocumentModal(true);
  };


  const handleCheckboxChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSelectChange = (type) => {
    if (type === "None") {
      setSelectedTypes([]);
    } else {
      if (selectedTypes.includes(type)) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      } else {
        setSelectedTypes([type]);
      }
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
        getUserStorage();
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

  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [sortOrder, setSortOrder] = useState("latest");

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const sortedDocuments = [...currentDocuments].sort((a, b) => {
    const dateA = new Date(a.date_of_upload);
    const dateB = new Date(b.date_of_upload);

    if (sortOrder === "latest") {
      return dateB - dateA; 
    } else {
      return dateA - dateB;
    }
  });


  return (
    <div className="dashboard flex flex-col md:flex-row px-2">
      {aadharPresent ? (
        <>
        {isMobile && (
          <select
            onChange={(e) => handleSelectChange(e.target.value)}
            className="mobile-form-select w-full border p-2 rounded-md text-sm"
            value={selectedTypes[0] || ""}
          >
            <option value="None">None</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        {!isMobile && (
          <div className="dashboard-filters md:w-1/5 w-full flex-none rounded-xl shadow-md p-3 md:p-4 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-lg text-gray-600" />
                <h5 className="text-md font-bold text-gray-800">Filters</h5>
              </div>

              {/* Filter Options */}
              <div className="filter-item-container flex flex-col space-y-2 text-left">
                {documentTypes.map((type,index) => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <div className={`filter-item cursor-pointer text-black flex items-center px-3 py-2 w-full text-sm font-medium text-gray-800 border !rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all
                      ${isSelected
                        ? '!bg-blue-600 !border-blue-700 shadow-lg transform scale-105'
                        : 'text-gray-800 border-gray-300 hover:bg-gray-200 hover:shadow-md transform hover:scale-105 bg-white'}`}>
                      <div className={`filter-icons flex-0 text-left text-gray-700 ${isSelected ? '!text-white' : ''}`}>{icons[index]}</div>
                      <label
                        key={type}
                        htmlFor={type}
                        className={`ml-2 flex-1 text-black ${isSelected ? '!text-white' : ' '}`}
                      >
                        <input
                          type="checkbox"
                          id={type}
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(type)}
                          className="hidden"
                        />
                        
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

          <div className="dashboard-documents right-section flex-1 ml-0 md:ml-6 max-h-[70vh] sm:max-h-[75vh] md:max-h-[85vh] overflow-y-auto p-2">
            <div className="flex flex-row mb-2 justify-between items-center">
              <div className="sort-documents flex items-center space-x-2 bg-white p-2 border rounded-md">
                <label htmlFor="sortOrder" className="text-black text-sm font-bold">Sort By</label>
                <div className="flex items-center space-x-2">
                  {sortOrder === "latest" && (
                    <>
                      <span className="text-sm text-gray-700">Latest to Oldest</span>
                      <button
                        className="p-2 cursor-pointer text-gray-700 hover:text-gray-900"
                        onClick={() => handleSortChange("oldest")}
                        aria-label="Sort by oldest to latest"
                      >
                      <FaArrowDown />
                    </button>
                    </>
                  )}
                  {sortOrder === "oldest" && (
                   <>
                      <span className="text-sm text-gray-700">Oldest to Latest</span>
                      <button
                      className="p-2 cursor-pointer text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortChange("latest")}
                      aria-label="Sort by latest to oldest"
                      >
                        <FaArrowUp />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1 w-1/2">
                {/* Storage Usage */}
                <div className="storage-bar w-1/3 mb-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Usage {userFileStorage} MB / {storageLimit} MB</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${storagePercentage}%`,
                        background: storagePercentage >= 100
                          ? 'linear-gradient(to right, #ff4e50, #f9d423)' // red-orange gradient for overflow
                          : 'linear-gradient(to right, #00c6ff, #0072ff)', // blue gradient for normal usage
                        boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
                        transition: 'width 0.4s ease-in-out',
                      }}
                    ></div><p className='!text-xs text-gray-500'>compressed size</p>
                  </div>
                </div>

                {/* Pagination */}
                <div className="pagination flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-white p-2 rounded-md flex items-center transition-all duration-200 disabled:opacity-50"
                  >
                    <FaChevronLeft className="icon text-gray-800" /> 
                  </button>
                  <p className="text-gray-800 font-bold m-3">
                    {currentPage}/{totalPages}
                  </p>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-white p-2 rounded-md flex items-center transition-all duration-200 disabled:opacity-50"
                  >
                    <FaChevronRight className="icon text-gray-800" /> 
                  </button>
                </div>
              </div>
            </div>
  
            <div className="documents-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedDocuments.length === 0 ? (
                <p>No documents available.</p>
              ) : (
                sortedDocuments.flatMap((doc) =>
                  filterDocuments([doc], searchQuery).map((doc) => (
                    <div
                      key={doc.document_name}
                      className="pb-3 document-item hover:scale-102 transition-transform duration-200 mb-2 border rounded-lg shadow-sm hover:shadow-xl"
                    >
                      <div
                        className="document-preview mb-2 relative cursor-pointer"
                        title={`open ${doc.document_name}`}
                        onClick={() => openModal(doc)}
                      >
                       <div className="absolute -top-1 -left-1 rounded-bl-lg">
                        {doc.document_extension === "pdf" && <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-sm">{doc.document_extension}</span>}
                        {doc.document_extension === "pptx" && <span className="bg-orange-700 text-white text-xs font-semibold px-3 py-1 rounded-sm">{doc.document_extension}</span>}
                        {["png", "jpg", "webp"].includes(doc.document_extension) && <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-sm">{doc.document_extension}</span>}
                        {(doc.document_extension === "docx" || doc.document_extension === "doc") && <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-sm">{doc.document_extension}</span>}
                        {["xlsx", "xls", "csv"].includes(doc.document_extension) && <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-sm">{doc.document_extension}</span>}
                        {doc.document_extension === "txt" && <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded">{doc.document_extension}</span>}
                      </div>

                        <LazyLoad height={200} offset={100}>
                          <FilePreview base64String={doc.upload_data} fileType={doc.document_extension} />
                        </LazyLoad>
                      </div>
  
                      <div className="document-info text-center max-w-full overflow-hidden p-2">
                        <span className="font-bold break-words text-sm">{doc.document_name}<p className="!text-xs text-gray-500">{doc.file_size_mb} MB (original size)</p></span>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.date_of_upload).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })} • {new Date(doc.date_of_upload).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <div className="action-icons flex justify-evenly items-center space-x-4 mt-4 overflow-x-auto">
                          <FaShareAlt
                            className="text-md cursor-pointer text-gray-400 hover:text-blue-800 transition duration-200"
                            title="Share"
                            onClick={()=>openShareDocModal(doc)}
                          />
                          <FaDownload
                            className="text-md cursor-pointer text-gray-400 hover:text-green-800 transition duration-200"
                            title="Download"
                            onClick={() => handleDownload(doc)}
                          />
                          <FaTrash
                            className="text-md cursor-pointer text-gray-400 hover:text-red-800 transition duration-200"
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
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
          <p className="text-red-500 mt-4">Please link your Aadhar in the profile menu!</p>
          <Lottie animationData={noaadharlinkimage} />
        </div>
      )}
  
      {isModalOpen && (
        <DocumentModal doc={currentDoc} closeModal={closeModal} />
      )}
      {openShareDocumentModal && (
        <ShareDocumentModal onClose={()=>setOpenShareDocumentModal(false)} doc={currentShareDoc}/>
      )}
      {showDeleteConfirmModal && docToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="delete-confirm-modal bg-white p-6 rounded-lg shadow-lg max-w-[90vw] md:max-w-[35vw]">
            <h5 className="!text-md !font-bold mb-4">
              Are you sure you want to delete {docToDelete.document_name}?
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
