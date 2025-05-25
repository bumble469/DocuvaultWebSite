import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

export const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userFileStorage, setUserFileStorage] = useState(null);

  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const clearContext = () => {
    setDocuments(null);
    setUserFileStorage(null);
    setLoading(false);
    toast.error("Session expired! Please login again..");
  };

  const getUserStorage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/storage-usage`, {
        withCredentials: true,
      });
      if (response.data.success === true) {
        setUserFileStorage(response.data.totalStorage);
      } else {
        toast.error(`Some problem occurred while retrieving storage: ${response.data.message}`);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        clearContext();
      } else {
        toast.error("Failed to retrieve storage");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/get-documents/`,
        {},
        { withCredentials: true }
      );
      if (response.data.success === true) {
        setDocuments(response.data.documents);
      } else {
        toast.error(`Some problem occurred while retrieving documents: ${response.data.message}`);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        clearContext();
      } else {
        toast.error("Failed to retrieve documents");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentName, onClose) => {
    try {
      const response = await axios.post(
        `${API_URL}/delete-documents/`,
        { document_name: documentName },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        toast.success(response.data.message);
        getUserStorage();
        setDocuments((prevDocs) =>
          prevDocs ? prevDocs.filter(doc => doc.document_name !== documentName) : []
        );
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          clearContext();
        } else if (err.response.data) {
          toast.error(`Delete failed: ${err.response.data.detail}`);
          console.error('Error details:', err.response.data);
        } else {
          toast.error("Delete failed. Please try again.");
          console.error(err);
        }
      } else {
        toast.error("Delete failed. Please try again.");
        console.error(err);
      }
    }
  };

  const refreshData = () => {
    getUserStorage();
    fetchDocuments();
  };

  useEffect(() => {
    const publicRoutes = ['/'];

    if (!documents && !publicRoutes.includes(location.pathname)) {
      getUserStorage();
      fetchDocuments();
    }
  }, [documents, location.pathname]);

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        loading,
        userFileStorage,
        fetchDocuments,
        getUserStorage,
        handleDelete,
        clearContext,
        refreshData,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};
