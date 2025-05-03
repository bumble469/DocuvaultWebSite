import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import Lottie from 'lottie-react'
import fileloading from '../../../assets/images/filepreviewloading.json'

const DocumentModal = ({ doc, closeModal }) => {
  const [documentContent, setDocumentContent] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOfficeFile, setIsOfficeFile] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!doc) return null;

  const decodeBase64 = (base64Data) => {
    const binaryString = atob(base64Data);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  useEffect(() => {
    if (!doc || !doc.upload_data) return;
      
    const fileBuffer = decodeBase64(doc.upload_data);
  
    if (doc.document_extension === 'docx') {
      mammoth.convertToHtml({ arrayBuffer: fileBuffer })
        .then(result => {
          setDocumentContent(result.value);
          setIsOfficeFile(true);
        })
        .catch(() => {
          setIsError(true);
          setDocumentContent('Error processing DOCX file.');
        })
        .finally(() => {
          setLoading(false); // Set loading to false when done
        });
    } else if (doc.document_extension === 'xlsx' || doc.document_extension === 'xls' || doc.document_extension === 'csv') {
      try {
        const workbook = XLSX.read(fileBuffer, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const sheetData = sheetNames.map((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const html = generateTable(rows);
          return { sheetName, html };
        });
  
        const organizedHtml = sheetData.map((sheet) => {
          return `
            <div class="sheet-container">
              <h2>${sheet.sheetName}</h2>
              <div class="sheet-content">${sheet.html}</div>
            </div>
          `;
        }).join('');
  
        setDocumentContent(organizedHtml);
        setIsOfficeFile(true);
      } catch (error) {
        setIsError(true);
        setDocumentContent('Error processing file.');
      } finally {
        setLoading(false); // Set loading to false when done
      }
    } else if (doc.document_extension === 'pptx') {
      setDocumentContent(`<iframe src="https://docs.google.com/gview?url=http://localhost:8000/preview-document/${doc.document_name}&embedded=true" width="100%" height="100%" frameborder="0"></iframe>`);
      setIsOfficeFile(true);
      setLoading(false); // Set loading to false after setting content
    } else {
      setIsError(true);
      setDocumentContent('Unsupported file type.');
      setLoading(false); // Set loading to false for unsupported file types
    }
  }, [doc]);
  

  const generateTable = (rows) => {
    let tableHtml = '<table class="document-large-preview-tables table-auto w-full border-collapse border border-gray-300">';
    rows.forEach((row, rowIndex) => {
      tableHtml += `<tr class="${rowIndex % 2 === 0 ? 'bg-gray-100' : ''}">`;
      row.forEach((cell, cellIndex) => {
        tableHtml += `<td class="l1 border px-4 py-2">${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    return tableHtml;
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 px-4"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="document-large-preview relative w-full max-w-4xl h-95vh bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-lg text-gray-400 font-bold transition duration-200 hover:scale-110"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Optional Title */}
        <div>
          <h4 className="px-6 pt-6 pb-4 border-b text-xl font-semibold text-gray-800">
            {!loading ? 'Content Viewer' : 'Loading content...'}
          </h4>
        </div>

        {/* Object viewer with scrollable container */}
          <div className="p-4 overflow-auto flex-1">
            {isOfficeFile ? (
              <div 
                className='w-full h-[70vh]'
                dangerouslySetInnerHTML={{ __html: documentContent }} 
              />
            ) : (
              <object
                data={`http://localhost:8000/preview-document/${doc.document_name}`}
                type="application/pdf"
                width="100%"
                height="100%"
                className="w-full h-[70vh] rounded border border-gray-300"
              >
                <p>Your browser does not support inline PDFs. You can download the file <a href={`http://localhost:8000/preview-document/${doc.document_name}`}>here</a>.</p>
              </object>
            )}
          </div>
        </div>
    </div>
  );
};

export default DocumentModal;