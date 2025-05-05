import React, { useState,useRef } from 'react';
import logo from '../../assets/images/logo1.png';
import {
  PlusIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import aidocumentanimation from '../../assets/images/aidocumentanimation.json';
import Lottie from 'lottie-react';
import axios from 'axios';
import HtmlPreviewer from './components/previewer.jsx';
import html2pdf from 'html2pdf.js';

const AIDocument = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [preview, setPreview] = useState(true);

  const handleApiCall = async (finalInput) => {
    setPreview(false)
    const apiUrl = `${API_URL}/generate/`;
    const data = { task: selectedOption, content: finalInput };
    setLoading(true);
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      const generatedText =
        response.data?.html || 'No content generated.';
  
      setDocumentContent(generatedText);
      setMessages((prev) => [...prev, { sender: 'bot', text: generatedText }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: `Error: ${error.message}` }]);
    }finally {
      setLoading(false); // Stop loading
      setPreview(true)
    }
  };
  

  const handleSend = () => {
    if (input.trim() === '' || !selectedOption) return;
  
    const selectedInput = sidebarOptions.find(item => item.text === selectedOption)?.input || '';
  
    const newMessages = [
      ...messages,
      { sender: 'user', text: input }
    ];
    setMessages(newMessages);
    setInput('');
    handleApiCall(selectedInput + '\n' + input); // still sends both to API
  };

  const sidebarOptions = [
    {
      text: 'Create Offer Letters',
      icon: <DocumentTextIcon className="h-4 w-4 text-pink-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No extra text or explanation. Generate a formal job offer letter based on the given job and candidate information.'
    },
    {
      text: 'Create Business Letters',
      icon: <EnvelopeIcon className="h-4 w-4 text-indigo-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No extra text or explanation. Generate a professional business letter using the provided purpose and recipient details.'
    },
    {
      text: 'Research Paper Format',
      icon: <AcademicCapIcon className="h-4 w-4 text-yellow-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No additional explanation. Format a research paper with sections like Abstract, Introduction, Methodology, etc.'
    },
    {
      text: 'Cover Letters',
      icon: <EnvelopeIcon className="h-4 w-4 text-teal-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No extra text. Generate a professional cover letter based on the job description and candidate profile.'
    },
    {
      text: 'Reports',
      icon: <ClipboardDocumentIcon className="h-4 w-4 text-red-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No extra text or explanation. Create a professional report template with sections, headings, and tables.'
    }
  ];  

    const previewRef = useRef();

    const handleDownloadPDF = () => {
      const element = previewRef.current;
  
      // Check if the element exists
      if (element) {
        const opt = {
          margin: 0.5, // Adjust margin to your preference
          filename: 'preview.pdf', // Name of the generated PDF
          image: { type: 'jpeg', quality: 0.98 }, // Adjust image quality if needed
          html2canvas: { scale: 2 }, // For better rendering quality
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } // A4 page format
        };
  
        // Generate and download the PDF
        html2pdf().from(element).set(opt).save();
      } else {
        console.error('Preview ref element not found!');
      }
    };         
       
    const handleDownloadWord = () => {
      const element = previewRef.current;
      if (element) {
        const content = element.innerHTML;
    
        const html = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:w="urn:schemas-microsoft-com:office:word"
                xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="utf-8">
            <title>Document</title>
            <style>
              @page {
                size: A4;
                margin: 0cm;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .page {
                width: 100%;
                margin: 0;
                padding-top: -10px;
                padding-left: -5px;
                padding-right: -5px;
                background: white;
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            <div class="page">
              ${content}
            </div>
          </body>
        </html>
        `;
    
        const blob = new Blob(['\ufeff', html], {
          type: 'application/docx',
        });
    
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };    

  return (
    <div className="flex justify-start items-start bg-gray-100 p-4 gap-3 font-sans h-screen">
      
      {/* Sidebar */}
      <div className="w-[25%] h-full bg-white shadow-lg rounded-xl px-3 py-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center gap-x-3 mb-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105 hover:brightness-90 cursor-pointer"
            />
            <div>
              <h6 className="!text-gray-800 font-semibold text-base leading-tight">
                Explore AI-Powered Customization
              </h6>
            </div>
          </div>
          <span className="text-xs text-gray-500">Best for Document Modifications</span>
          <hr className="border-black border-[1.5px] my-2" />
          <div className="flex flex-col gap-y-2">
            {sidebarOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(item.text)}
                className={`flex items-center gap-2 px-3 py-2 w-full text-sm font-medium text-gray-800 border rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all ${
                  selectedOption === item.text ? 'bg-blue-100' : ''
                }`}
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center pt-4">
          Powered by Google Gemini | Built for Efficiency
        </div>
      </div>

      <div className="w-[60%] h-full bg-white rounded-xl shadow-md flex flex-col p-4 overflow-auto border">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold">Your Document</h5>
          {documentContent && (
           <div className='flex gap-x-2'>
             <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Download PDF
            </button>
            <button
                onClick={handleDownloadWord}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                Download Word
              </button>
           </div>
          )}
        </div>

        {loading && (
          <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-gray-300 text-gray-800 self-start mr-auto animate-pulse mb-4">
            Generating...
          </div>
        )}

        <div className="overflow-y-auto">
          {documentContent ? (
            <HtmlPreviewer htmlContent={documentContent} previewRef={previewRef} isPreview={preview} />
          ) : (
            <p className="text-sm text-gray-500">No content to display.</p>
          )}
        </div>
      </div>

      {/* Right: Chatbox */}
      <div className="w-[25%] h-full bg-white rounded-xl shadow-xl flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {!selectedOption && (
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <Lottie animationData={aidocumentanimation} className="h-30 w-auto text-gray-300" />
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white self-end ml-auto'
                  : 'bg-gray-200 text-black self-start mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex items-start border-t p-2 gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!selectedOption}
            className={`flex-1 px-6 py-3 text-sm border rounded-lg focus:outline-none resize-none ${
              !selectedOption ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-300'
            }`}
            placeholder={
              !selectedOption
                ? 'Select a document option from the sidebar first...'
                : 'Type your message...'
            }
            rows="4"
          />
          <button
            onClick={handleSend}
            disabled={!selectedOption}
            className={`flex items-center justify-center px-6 py-3 text-sm rounded-lg transition ${
              selectedOption
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDocument;
