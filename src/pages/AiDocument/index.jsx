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
import axios from 'axios';
import HtmlPreviewer from './components/previewer.jsx';

const AIDocument = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [collapsed, setCollapsed] = useState(false);


  const handleApiCall = async (finalInput) => {
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
        
        {/* Small Screens: Responsive Stacked Layout */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center space-x-4 ai-options p-2 !rounded-md">
            <ArrowLeftIcon onClick={() => window.history.back()} title="go back" height={25} width={25} className="transition duration-200 hover:cursor-pointer hover:scale-104" />
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 transition-transform duration-300 hover:scale-105 hover:brightness-90 cursor-pointer"
            />
            <div>
              <h6 className="text-gray-800 font-semibold text-base leading-tight mb-1">
                Explore AI-Powered Generation
              </h6>
              <span className="text-xs text-gray-500 block mb-2">Best for Custom Document generation</span>
            </div>
          </div>
          <hr className="border-gray-500 border-[1.5px]" />
          {/* Sidebar as select */}
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-white shadow ai-options-mobile"
          >
            <option disabled value="">
              Select a document option
            </option>
            {sidebarOptions.map((item, idx) => (
              <option key={idx} value={item.text}>
                {item.text}
              </option>
            ))}
          </select>
    
          {/* Center: Document Preview */}
          <div className="bg-white rounded-xl shadow-md p-4 ai-document-container">
            <h5 className="text-xl font-bold mb-4">Your Document</h5>
            {loading && (
              <div className="animate-pulse bg-gray-300 px-4 py-2 rounded-2xl text-sm mb-4 w-fit">
                Generating...
              </div>
            )}
            {documentContent ? (
              <HtmlPreviewer htmlContent={documentContent} previewRef={previewRef} />
            ) : (
              <p className="text-sm text-gray-500">No content to display.</p>
            )}
          </div>
    
          {/* Bottom: Chat Input */}
          <div className="bg-white rounded-xl shadow-md p-4 ai-document-chatsection">
            <div className="flex flex-col gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!selectedOption}
                className={`w-full px-4 py-2 text-sm border rounded-lg resize-none ${
                  !selectedOption ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-300'
                }`}
                placeholder={
                  !selectedOption
                    ? 'Select a document option first...'
                    : 'Type your message...'
                }
                rows="4"
              />
              <button
                onClick={handleSend}
                disabled={!selectedOption}
                className={`w-full px-4 py-2 text-sm !rounded-lg ${
                  selectedOption ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600'
                }`}
              >
                <PaperAirplaneIcon className="h-5 w-5 inline-block mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
    
        {/* Medium and Larger Screens: Original Layout */}
        <div className="hidden md:flex justify-start items-start gap-3 h-full">
          
          {/* Sidebar */}
          <div className={`ai-options transition-all duration-300 ${collapsed ? 'w-[80px]' : 'w-[30%]'} h-full bg-white shadow-lg rounded-xl px-3 py-4 flex flex-col justify-between overflow-y-auto`}>
            <div>
              <div className={`flex items-center justify-between ${collapsed ? 'mb-4' : ''}`}>
                <ArrowLeftIcon onClick={() => window.history.back()} title="go back" height={20} width={20} className="transition duration-200 hover:cursor-pointer hover:scale-104" />
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-auto transition-transform duration-300 hover:scale-105 hover:brightness-90 cursor-pointer"
                  onClick={() => setCollapsed(!collapsed)}
                />
                {!collapsed ? (
                  <button onClick={() => setCollapsed(true)} className="text-gray-500 hover:text-gray-800 text-xl">
                    ❮
                  </button>
                ) : (
                  <button onClick={() => setCollapsed(false)} className="text-gray-500 hover:text-gray-800 text-xl">
                    ❯
                  </button>
                )}
              </div>
    
              {!collapsed && (
                <>
                  <h6 className="text-gray-800 font-semibold text-base leading-tight mb-1">
                    Explore AI-Powered Generation
                  </h6>
                  <span className="text-xs text-gray-500 block mb-2">Best for Custom Document generation</span>
                  <hr className="border-black border-[1.5px] my-2" />
                </>
              )}
    
              <div className="flex flex-col gap-y-2">
                {sidebarOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(item.text)}
                    className={`flex gap-x-2 border px-3 py-2 w-full text-sm text-gray-800 text-left !rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all ${
                      selectedOption === item.text ? 'bg-blue-500' : ''
                    }`}
                  >
                    {/* Icon on the left */}
                    <div className="w-6 flex items-center justify-center">
                      {item.icon}
                    </div>

                    {/* Centered text (only when sidebar is expanded) */}
                    {!collapsed && (
                      <div className="flex-">
                        {item.text}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
    
            {!collapsed && (
              <div className="text-xs text-gray-400 text-center pt-4">
                Powered by Google Gemini | Built for Efficiency
              </div>
            )}
          </div>
    
          {/* Document Preview */}
          <div className="w-[80%] h-full bg-white rounded-xl shadow-md flex flex-col p-4 overflow-auto ai-document-container">
            <div className="flex justify-between items-center mb-4">
              <h6 className="text-xl font-bold">Your generated document will appear here</h6>
              {documentContent && (
                <div className="flex gap-x-2">
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
                <HtmlPreviewer htmlContent={documentContent} previewRef={previewRef} />
              ) : (
                <div className="flex justify-center items-center p-8 ">
                  <Lottie animationData={aidocumentanimation} className="m-8 h-30 w-autotie" />
                </div>
              )}
            </div>
          </div>
          {/* Chatbox */}
          <div className="w-[25%] h-full bg-white rounded-xl shadow-xl flex flex-col relative ai-document-chatsection">
            <div className="flex-1 overflow-y-auto p-4 relative">
              {messages.map((msg, idx) => (
                <div
                key={idx}
                className={`max-w-[90%] px-4 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap overflow-hidden
                  ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white self-end ml-auto mb-4'
                      : 'bg-gray-200 text-black self-start mr-auto bot-msg'
                  }`}
              >
                {msg.text}
              </div>              
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-center border-t p-2 gap-2 ai-document-chatinput">
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
                    : `Explain about the features of the ${selectedOption}`
                }
                rows="10"
              />
              <button
                onClick={handleSend}
                disabled={!selectedOption}
                className={`flex items-center justify-center px-6 py-3 text-sm !rounded-lg transition ${
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
      </div>
    );
    
};

export default AIDocument;
