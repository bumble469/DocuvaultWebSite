import React, { useState } from 'react';
import { FaShareAlt, FaDownload, FaCog, FaFileAlt, FaCertificate, FaFileSignature, FaIdCard, FaCalendarAlt, FaDollarSign, FaStethoscope, FaBuilding, FaClipboardList } from 'react-icons/fa'; // Import necessary icons
import DocumentModal from './components/document_model';
import { useMediaQuery } from 'react-responsive';

const documents = {
  "Unique Identification & Identity Proofs": [
    { id: 1, name: 'Aadhaar Card', type: 'Unique Identification & Identity Proofs' },
    { id: 2, name: 'Voter ID', type: 'Unique Identification & Identity Proofs' },
    { id: 3, name: 'Passport', type: 'Unique Identification & Identity Proofs' },
    { id: 4, name: 'PAN Card', type: 'Unique Identification & Identity Proofs' },
  ],
  "Address Proofs": [
    { id: 5, name: 'Utility Bill', type: 'Address Proofs' },
    { id: 6, name: 'Bank Statement', type: 'Address Proofs' },
    { id: 7, name: 'Rental Agreement', type: 'Address Proofs' },
    { id: 8, name: 'Election Card', type: 'Address Proofs' },
  ],
  "Education-related Documents": [
    { id: 9, name: 'Mark Sheets', type: 'Education-related Documents' },
    { id: 10, name: 'Degree Certificate', type: 'Education-related Documents' },
    { id: 11, name: 'Transfer Certificate', type: 'Education-related Documents' },
    { id: 12, name: 'Diplomas/Certificates', type: 'Education-related Documents' },
  ],
  "Healthcare & Medical Documents": [
    { id: 13, name: 'Medical Reports', type: 'Healthcare & Medical Documents' },
    { id: 14, name: 'Health Insurance', type: 'Healthcare & Medical Documents' },
    { id: 15, name: 'Vaccination Certificate', type: 'Healthcare & Medical Documents' },
    { id: 16, name: 'Disability Certificate', type: 'Healthcare & Medical Documents' },
  ],
  "Financial & Legal Documents": [
    { id: 17, name: 'Income Tax Returns', type: 'Financial & Legal Documents' },
    { id: 18, name: 'Bank Passbook/Statement', type: 'Financial & Legal Documents' },
    { id: 19, name: 'Insurance Policy', type: 'Financial & Legal Documents' },
    { id: 20, name: 'Loan Documents', type: 'Financial & Legal Documents' },
  ],
  "Business-related Documents": [
    { id: 21, name: 'GST Registration Certificate', type: 'Business-related Documents' },
    { id: 22, name: 'Partnership Deed', type: 'Business-related Documents' },
    { id: 23, name: 'Trade License', type: 'Business-related Documents' },
    { id: 24, name: 'Company Registration Certificate', type: 'Business-related Documents' },
  ],
  "Government Schemes & Social Welfare Documents": [
    { id: 25, name: 'Pension Book', type: 'Government Schemes & Social Welfare Documents' },
    { id: 26, name: 'Disability Certificate', type: 'Government Schemes & Social Welfare Documents' },
    { id: 27, name: 'Income Certificate', type: 'Government Schemes & Social Welfare Documents' },
    { id: 28, name: 'Senior Citizen Card', type: 'Government Schemes & Social Welfare Documents' },
  ],
  "Marriage and Family Documents": [
    { id: 29, name: 'Marriage Certificate', type: 'Marriage and Family Documents' },
    { id: 30, name: 'Birth Certificate', type: 'Marriage and Family Documents' },
    { id: 31, name: 'Death Certificate', type: 'Marriage and Family Documents' },
  ],
  "Legal Documents": [
    { id: 32, name: 'Will', type: 'Legal Documents' },
    { id: 33, name: 'Power of Attorney', type: 'Legal Documents' },
    { id: 34, name: 'Court Orders/Judgments', type: 'Legal Documents' },
    { id: 35, name: 'Divorce Decree', type: 'Legal Documents' },
  ],
};

const Dashboard = ({ searchQuery }) => {
  const [selectedTypes, setSelectedTypes] = useState([]); // Stores selected document types
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const openModal = (doc) => {
    setCurrentDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDoc(null);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Unique Identification & Identity Proofs':
        return <FaIdCard />;
      case 'Address Proofs':
        return <FaCalendarAlt />;
      case 'Education-related Documents':
        return <FaClipboardList />;
      case 'Healthcare & Medical Documents':
        return <FaStethoscope />;
      case 'Financial & Legal Documents':
        return <FaDollarSign />;
      case 'Business-related Documents':
        return <FaBuilding />;
      case 'Government Schemes & Social Welfare Documents':
        return <FaFileAlt />;
      case 'Marriage and Family Documents':
        return <FaCertificate />;
      case 'Legal Documents':
        return <FaFileSignature />;
      default:
        return <FaFileAlt />;
    }
  };

  // Handle the checkbox selection logic
  const handleCheckboxChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type)); // Deselect the type if already selected
    } else {
      setSelectedTypes([...selectedTypes, type]); // Select the type
    }
  };

  // Handle the select dropdown logic for mobile
  const handleSelectChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type)); // If selected, remove the type from selected
    } else {
      setSelectedTypes([type]); // If not selected, add it and reset others
    }
  };

  // Function to filter documents based on search query
  const filterDocuments = (docs, query) => {
    if (!query) return docs;
    return docs.filter(doc => doc.name.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="dashboard flex flex-col md:flex-row p-6">
      {/* Left Section */}
      <div className="md:!h-[80vh] left-section flex-none w-full md:w-1/5 mb-6 md:mb-0 overflow-y-auto border-r pr-4">
        <h4 className="text-xl font-semibold mb-4">Document Types</h4>
        {isMobile ? (
          <select
            onChange={(e) => handleSelectChange(e.target.value)}
            className="form-select w-full border p-2 rounded-md text-sm"
            value={selectedTypes[0] || ""}
          >
            <option value="" disabled>Select Document Type</option>
            {Object.keys(documents).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3">
            {Object.keys(documents).map((type) => (
              <div key={type} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                  className="filter-checkboxes appearance-none w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 border-2 border-gray-800 rounded-xs checked:bg-black checked:border-black checked:before:content-['✓'] checked:before:absolute checked:before:text-white checked:before:text-sm checked:before:font-bold checked:before:inset-0 checked:before:flex checked:before:items-center checked:before:justify-center focus:outline-none relative"
                />
                <label htmlFor={type} className="text-sm mx-2">{type}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="right-section flex-1 ml-0 md:ml-6 max-h-[80vh] overflow-y-auto p-2">
        <h4 className="text-xl font-semibold mb-6">Documents</h4>
        <div className="documents-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTypes.length === 0
            ? Object.keys(documents).map((type) =>
                filterDocuments(documents[type], searchQuery).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => openModal(doc)}
                    className="document-item pb-3 mb-4 border rounded-xs shadow-sm hover:shadow-xl cursor-pointer transition duration-300"
                  >
                    <div className="document-preview mb-2">
                      <div className="bg-gray-200 h-40 md:h-70 rounded-xs"></div>
                    </div>
                    <div className="document-info text-center">
                      <span className="font-medium">{doc.name}</span>
                      <div className="action-icons flex justify-center space-x-4 mt-2">
                        <FaShareAlt className="cursor-pointer text-blue-500" title="Share" />
                        <FaDownload className="cursor-pointer text-green-500" title="Download" />
                        <FaCog className="cursor-pointer text-gray-500" title="Manage" />
                      </div>
                    </div>
                  </div>
                ))
              )
            : selectedTypes.map((type) =>
                filterDocuments(documents[type], searchQuery).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => openModal(doc)}
                    className="document-item pb-3 mb-4 border rounded-lg shadow-sm hover:shadow-xl cursor-pointer transition duration-300"
                  >
                    <div className="document-preview mb-2">
                      <div className="bg-gray-200 h-40 md:h-70 rounded-xs"></div>
                    </div>
                    <div className="document-info text-center">
                      <span className="font-medium">{doc.name}</span>
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
      <DocumentModal isOpen={isModalOpen} closeModal={closeModal} document={currentDoc} />
    </div>
  );
};

export default Dashboard;
