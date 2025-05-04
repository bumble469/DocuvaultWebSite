import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { toast } from 'react-toastify';
import { FaRegCopy } from 'react-icons/fa';

const ShareDocumentModal = ({ onClose, doc }) => {
    const [link, setLink] = useState('');
    const [expiry, setExpiry] = useState(10); 

    const API_URL = import.meta.env.VITE_API_URL; 

    const handleGenerateLink = async () => {
        try {
            const response = await axios.post(`${API_URL}/get-link/`, {
                document_name : doc.document_name,
                expiry
            },{
                withCredentials:true
            });

            if (response.data.success == true) {
                setLink(response.data.shareable_link);
            }
        } catch (err) {
            toast.error('Error generating link:', err);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4"
        style={{
          backdropFilter: 'blur(1px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
            <div className="modal-document-sharing bg-white !rounded-md shadow-lg w-11/12 max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 !text-3xl font-bold"
                >
                    &times;
                </button>
                <h4 className="text-2xl font-semibold mb-4">Share link for {doc.document_name}</h4>
                
                {/* Input to set expiry time */}
                <label htmlFor="expiry" className="block text-sm font-semibold">Expiry Time (minutes):</label>
                <input
                    id="expiry"
                    type="number"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full mb-4"
                />
                
                <button
                    onClick={handleGenerateLink}
                    className="bg-blue-500 text-white p-2 rounded-md w-full mb-4 hover:bg-blue-600"
                >
                    Generate Shareable Link
                </button>

                {link && (
                <div>
                    <label className="block text-sm font-semibold mb-2">Your Shareable Link:</label>
                    <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                    />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            toast.success("Copied to clipboard!", {
                                autoClose: 1000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: false,
                              });
                        }}
                        className="text-gray-600 hover:text-gray-900 mb-4"
                        title="Copy to clipboard"
                        >
                        <FaRegCopy size={20} />
                    </button>

                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default ShareDocumentModal;
