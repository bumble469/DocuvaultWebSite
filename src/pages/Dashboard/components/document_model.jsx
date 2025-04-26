import React from 'react';

const documentModal = ({ isOpen, closeModal, document }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{document.name}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="document-content">
          <p className="text-gray-700">Content for the document: {document.name}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Close</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Action</button>
        </div>
      </div>
    </div>
  );
};

export default documentModal;
