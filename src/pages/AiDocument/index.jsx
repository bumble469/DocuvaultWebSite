import React, { useState } from 'react';
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
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';
import ResumeTemplate from './templates/resumes/resume.jsx';

const AIDocument = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [documentContent, setDocumentContent] = useState('');

  const handleApiCall = async (option) => {
    const apiUrl = 'http://localhost:8000/generate/';
    const data = { task: option, content: input };

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const generatedText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';

      setDocumentContent(generatedText);
      setMessages((prev) => [...prev, { sender: 'bot', text: generatedText }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: `Error: ${error.message}` }]);
    }
  };

  const handleSend = () => {
    if (input.trim() === '' || !selectedOption) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    handleApiCall(selectedOption);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'generated_document.txt');
  };

  const handleDownloadDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun(documentContent)],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'generated_document.docx');
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(documentContent, 180);
    doc.text(lines, 10, 10);
    doc.save('generated_document.pdf');
  };

  const sidebarOptions = [
    { text: 'Create New Document', icon: <PlusIcon className="h-4 w-4 text-blue-600" /> },
    { text: 'Modify Existing Doc', icon: <PencilSquareIcon className="h-4 w-4 text-green-600" /> },
    { text: 'Create Resume', icon: <BriefcaseIcon className="h-4 w-4 text-purple-600" /> },
    { text: 'Create Offer Letters', icon: <DocumentTextIcon className="h-4 w-4 text-pink-600" /> },
    { text: 'Create Business Letters', icon: <EnvelopeIcon className="h-4 w-4 text-indigo-600" /> },
    { text: 'Research Paper Format', icon: <AcademicCapIcon className="h-4 w-4 text-yellow-600" /> },
    { text: 'Cover Letters', icon: <EnvelopeIcon className="h-4 w-4 text-teal-600" /> },
    { text: 'Reports', icon: <ClipboardDocumentIcon className="h-4 w-4 text-red-600" /> },
  ];

  return (
    <div className="flex justify-start items-start bg-gray-100 p-6 gap-6 font-sans h-screen">
      
      {/* Sidebar */}
      <div className="w-[20%] h-full bg-white shadow-lg rounded-xl px-3 py-6 flex flex-col justify-between overflow-y-auto">
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

      {/* Center: Scrollable Document Area */}
      <div className="w-[50%] h-full bg-white rounded-xl shadow-md flex flex-col p-6 overflow-y-auto border">
        <h5 className="text-xl font-bold mb-4">Your Document</h5>
        <div className="w-full h-full overflow-y-auto">
            <ResumeTemplate content={documentContent} />
        </div>


        {documentContent && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDownloadTxt}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded"
            >
              Download .txt
            </button>
            <button
              onClick={handleDownloadDocx}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded"
            >
              Download .docx
            </button>
            <button
              onClick={handleDownloadPdf}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded"
            >
              Download .pdf
            </button>
          </div>
        )}
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
