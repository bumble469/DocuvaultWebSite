import React, { useEffect, useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import pptxiconpreview from "../../../assets/images/pptxiconpreview.png";

let isScriptLoaded = false;

const FilePreview = ({ base64String, fileType }) => {
  const [docContent, setDocContent] = useState('');
  const [excelContent, setExcelContent] = useState(null);
  const [txtContent, setTxtContent] = useState('');
  const canvasRef = useRef(null);

  const handleDocx = (base64String) => {
    const binaryString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }

    mammoth.convertToHtml({ arrayBuffer })
      .then((result) => {
        setDocContent(result.value);
      })
      .catch((error) => {
        console.error('Error converting docx: ', error);
      });
  };

  const handleXlsx = (base64String) => {
    const binaryString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    const htmlContent = XLSX.utils.sheet_to_html(worksheet);
    setExcelContent(htmlContent);
  };

  const loadPdfJs = async () => {
    return new Promise((resolve, reject) => {
      if (isScriptLoaded || window.pdfjsLib) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = () => {
        isScriptLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    }).then(() => {
      const pdfData = atob(base64String);
      const loadingTask = window.pdfjsLib.getDocument({ data: pdfData });

      loadingTask.promise.then(pdf => {
        pdf.getPage(1).then(page => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          context.clearRect(0, 0, canvas.width, canvas.height);

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          page.render({
            canvasContext: context,
            viewport: viewport
          });
        });
      });
    });
  };

  useEffect(() => {
    if (fileType === "docx") {
      handleDocx(base64String);
    } else if (fileType === "pdf") {
      loadPdfJs();
    } else if (fileType === "xlsx") {
      handleXlsx(base64String);
    } else if (fileType === "txt") {
      const decoded = atob(base64String);
      setTxtContent(decoded);
    }
  }, [base64String, fileType]);

  return (
    <>
      {fileType === "pdf" && (
        <iframe
            src={`data:application/pdf;base64,${base64String}#toolbar=0&scrollbar=0`}
            className="h-40 md:h-70 w-full object-cover rounded-lg"
            title="PDF Preview"
            scrolling="no"
            style={{overflow:'hidden' }}
        />
      )}

      {(fileType === "png" || fileType === "jpg" || fileType === "webp") && (
        <img
          src={`data:image/${fileType};base64,${base64String}`}
          alt="Image Preview"
          className="h-40 md:h-70 w-full object-cover rounded-lg p-4"
        /> 
      )}

      {(fileType === "docx" || fileType === "doc") && (
        <div
          className="doc-preview h-40 md:h-70 w-full object-cover rounded-lg overflow-hidden p-4"
          dangerouslySetInnerHTML={{ __html: docContent }}
        />
      )}

      {(fileType === "xlsx" || fileType === "xls") && excelContent && (
        <div
          className="xlsx-preview h-40 md:h-70 w-full object-cover rounded-lg overflow-hidden p-4"
          dangerouslySetInnerHTML={{ __html: excelContent }}
        />
      )}

      {fileType === "pptx" && (
        <div className="flex items-center justify-center h-40 md:h-70 w-full bg-gray-100 rounded-lg p-4">
          <img
            src={pptxiconpreview}
            alt="PPTX Icon"
            className="h-16 w-16 object-contain"
          />
        </div>
      )}

      {fileType === "txt" && (
        <div className=" h-40 md:h-70 w-full object-cover rounded-lg overflow-hidden p-4">
          {txtContent}
        </div>
      )}
    </>
  );
};

export default FilePreview;
