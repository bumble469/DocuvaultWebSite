import React, { useState,useRef } from 'react';
import logo from '../../assets/images/logo1.png';
import {
  DocumentTextIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ClipboardDocumentIcon,
  ClipboardIcon,
  PencilIcon,
  BookOpenIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import aidocumentanimation from '../../assets/images/aidocumentanimation.json';
import Lottie from 'lottie-react';
import refreshApi from '../../utils/refreshApi.js';
import HtmlPreviewer from './components/previewer.jsx';
import html2pdf from 'html2pdf.js'

const AIDocument = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [collapsed, setCollapsed] = useState(false);


  const handleApiCall = async (finalInput) => {
    const data = { task: selectedOption, content: finalInput };
    setLoading(true);
    try {
      const response = await refreshApi('/generate/', {
        method: "POST",
        data, 
        headers: {
            "Content-Type": "application/json",
        },
      });
  
      const generatedText =
        response.data?.html || 'No content generated.';
  
      setDocumentContent(generatedText);
      setMessages((prev) => [...prev, { sender: 'bot', text: generatedText }]);
    } catch (error) {
      const detail = error.response?.data?.detail || '';
      let errorMessage = 'Something went wrong. Please try again.';
      if (detail.includes('503') || detail.includes('UNAVAILABLE') || detail.includes('high demand')) {
        errorMessage = 'AI service is currently busy. Please try again in a moment.';
      } else if (detail.includes('429') || detail.includes('quota') || detail.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = 'AI quota exceeded. Please try again later.';
      } else if (detail.includes('401')) {
        errorMessage = 'Session expired. Please log in again.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
      setCollapsed(true)
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
    handleApiCall(selectedInput + '\n' + input); 
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
    },
    {
      text: 'Meeting Minutes (MoM)',
      icon: <ClipboardIcon className="h-4 w-4 text-blue-700" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No extra comments. Generate a structured Minutes of Meeting (MoM) document including date, attendees, agenda, and discussion summary.'
    },
    {
      text: 'Letter of Recommendation',
      icon: <PencilIcon className="h-4 w-4 text-purple-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. No other text. Generate a formal letter of recommendation for a student or employee based on provided achievements and skills.'
    },
    {
      text: 'Project Report Format',
      icon: <BookOpenIcon className="h-4 w-4 text-cyan-600" />,
      input: 'Provide only the HTML code from <!DOCTYPE html> to </html>, styled with Tailwind CSS. Don’t add extra text. Create a project report format with sections like Objectives, Technologies Used, Implementation, Results, and Conclusion.'
    }
  ];

    const previewRef = useRef();

    const handleDownloadPDF = () => {
      const element = previewRef.current;
    
      if (element) {
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: 'preview.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true
          },
          jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
          }
        };
    
        html2pdf().set(opt).from(element).save();
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
      <div className="aipage h-screen bg-gray-100 font-sans p-4 overflow-y-auto">

        {/* Small Screens */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center space-x-4 ai-options !rounded-xl p-3 shadow-sm border border-gray-200 bg-white">
            <ArrowLeftIcon
              onClick={() => window.history.back()}
              title="go back"
              height={22}
              width={22}
              className="text-gray-500 transition duration-200 hover:cursor-pointer hover:text-blue-600 hover:scale-110"
            />
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 transition-transform duration-300 hover:scale-105 hover:brightness-90 cursor-pointer rounded-lg"
            />
            <div>
              <h6 className="text-gray-800 font-semibold text-sm leading-tight">
                AI-Powered Document Generation
              </h6>
              <span className="text-xs text-gray-400 block mt-0.5">Custom docs in seconds</span>
            </div>
          </div>

          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ai-options-mobile"
          >
            <option disabled value="">
              Select a document type...
            </option>
            {sidebarOptions.map((item, idx) => (
              <option key={idx} value={item.text}>
                {item.text}
              </option>
            ))}
          </select>

          {/* Document Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ai-document-container">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-semibold text-gray-800">Your Document</h5>
              {documentContent && (
                <div className="flex gap-x-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-600 transition font-medium"
                  >
                    PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-600 transition font-medium"
                  >
                    Word
                  </button>
                </div>
              )}
            </div>
            {loading && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-sm mb-4 w-fit animate-pulse">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating your document...
              </div>
            )}
            {documentContent ? (
              <HtmlPreviewer htmlContent={documentContent} previewRef={previewRef} />
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No content to display yet.</p>
            )}
          </div>

          {/* Chat Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ai-document-chatsection">
            <div className="flex flex-col gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!selectedOption}
                className={`w-full px-4 py-3 text-sm border rounded-xl resize-none transition ${
                  !selectedOption
                    ? 'bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                }`}
                placeholder={
                  !selectedOption
                    ? 'Select a document type first...'
                    : 'Describe what you need...'
                }
                rows="4"
              />
              <button
                onClick={handleSend}
                disabled={!selectedOption}
                className={`w-full px-4 py-2.5 text-sm font-medium !rounded-xl transition flex items-center justify-center gap-2 ${
                  selectedOption
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Medium and Larger Screens */}
        <div className="hidden md:flex justify-start items-start gap-3 h-full">

          {/* Sidebar */}
          <div className={`ai-options transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[28%]'} h-full bg-white shadow-sm border border-gray-100 rounded-2xl px-3 py-4 flex flex-col justify-between overflow-y-auto`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <ArrowLeftIcon
                  onClick={() => window.history.back()}
                  title="go back"
                  height={18}
                  width={18}
                  className="text-gray-400 transition duration-200 hover:cursor-pointer hover:text-blue-600 hover:scale-110"
                />
                <img
                  src={logo}
                  alt="Logo"
                  className="h-9 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer rounded-lg"
                  onClick={() => setCollapsed(!collapsed)}
                />
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-gray-400 hover:text-gray-700 text-sm font-bold transition"
                >
                  {collapsed ? '❯' : '❮'}
                </button>
              </div>

              {!collapsed && (
                <>
                  <h6 className="text-gray-800 font-semibold text-sm leading-tight mb-0.5">
                    AI Document Generator
                  </h6>
                  <span className="text-xs text-gray-400 block mb-3">Powered by Google Gemini</span>
                  <hr className="border-gray-100 mb-3" />
                </>
              )}

              <div className="flex flex-col gap-y-1.5">
                {sidebarOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(item.text)}
                    title={collapsed ? item.text : undefined}
                    className={`flex items-center gap-x-2.5 border px-3 py-2.5 w-full text-sm text-gray-700 text-left !rounded-xl transition-all duration-150 ${
                      selectedOption === item.text
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm'
                        : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="w-5 flex-shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span className="truncate">{item.text}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!collapsed && (
              <div className="text-xs text-gray-300 text-center pt-4 border-t border-gray-50 mt-4">
                Built for Efficiency
              </div>
            )}
          </div>

          {/* Document Preview */}
          <div className="w-[80%] h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-5 overflow-auto ai-document-container">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h6 className="text-base font-semibold text-gray-800">
                  {documentContent ? 'Generated Document' : 'Your document will appear here'}
                </h6>
                {selectedOption && !documentContent && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ready to generate: <span className="text-blue-500 font-medium">{selectedOption}</span>
                  </p>
                )}
              </div>
              {documentContent && (
                <div className="flex gap-x-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition font-medium"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="bg-blue-500 text-white text-xs px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition font-medium"
                  >
                    Download Word
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-sm w-fit mb-4 animate-pulse">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating your document...
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              {documentContent ? (
                <HtmlPreviewer htmlContent={documentContent} previewRef={previewRef} />
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-center p-8">
                  <Lottie animationData={aidocumentanimation} className="h-48 w-auto mb-4 opacity-80" />
                  <p className="text-sm text-gray-400">Select a document type and describe your needs</p>
                </div>
              )}
            </div>
          </div>

          {/* Chatbox */}
          <div className="w-[25%] h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col ai-document-chatsection">
            <div className="px-4 py-3 border-b border-gray-50">
              <h6 className="text-sm font-semibold text-gray-700">Chat</h6>
              <p className="text-xs text-gray-400">Describe your document needs</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                  <PaperAirplaneIcon className="h-8 w-8 text-gray-200" />
                  <p className="text-xs text-gray-300">Your conversation will appear here</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs break-words whitespace-pre-wrap leading-relaxed shadow-sm
                    ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white self-end ml-auto rounded-br-sm'
                        : 'bg-gray-100 text-gray-700 self-start mr-auto rounded-bl-sm bot-msg'
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-100 p-3 flex items-end gap-2 ai-document-chatinput">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!selectedOption}
                className={`flex-1 px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none resize-none transition ${
                  !selectedOption
                    ? 'bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100'
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder={
                  !selectedOption
                    ? 'Select a document type first...'
                    : `Describe your ${selectedOption.toLowerCase()}...`
                }
                rows="6"
              />
              <button
                onClick={handleSend}
                disabled={!selectedOption}
                className={`flex items-center justify-center p-2.5 !rounded-xl transition flex-shrink-0 ${
                  selectedOption
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
};

export default AIDocument;
