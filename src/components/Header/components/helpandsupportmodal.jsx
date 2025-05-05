import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const HelpandSupportModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="helpandsupport-modal bg-white rounded-md shadow-lg w-11/12 max-w-3xl p-6 relative overflow-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 !text-3xl font-bold"
        >
          &times;
        </button>
        <h4 className="text-2xl !font-bold mb-4 text-black flex items-center">
          <FaQuestionCircle className="text-blue-600 mr-2" />
          Help & Support
        </h4>

        <div className="text-gray-800 space-y-4">
          <div>
            <h5 className="font-semibold text-lg">📄 How to Upload Documents?</h5>
            <p>
              Click on the 'Upload' button from the dashboard, select your file, and hit 'Submit'. Supported formats: PDF, DOCX, XLSX, TXT, JPG, PNG, WEBP.
              The system supports a total document limit of <strong>100MB</strong> for uploading and storing documents. 
              Don’t worry, that's more than enough because we compress your files before storage, significantly reducing their size. 
              <strong> Thanks to compression, you have plenty of space to store your documents efficiently.</strong>
            </p>        
          </div>
          <div>
            <h5 className="font-semibold text-lg">⚡ Large Files and Performance</h5>
            <p>While we aim to provide a seamless preview experience, uploading very large files may slow down document previews, especially for images or PDFs. This is due to the nature of rendering large files directly on our platform. However, rest assured that your documents are kept safely stored, and you can access them anytime without worrying about physical storage or dependencies.</p>
          </div>
          <div>
            <h5 className="font-semibold text-lg">🔐 Is My Data Secure?</h5>
            <p>Yes, we use industry-standard encryption and follow strict data privacy practices to keep your documents safe.</p>
          </div>
          <div>
            <h5 className="font-semibold text-lg">🔁 Forgot Your Password?</h5>
            <p>Use the 'Forgot Password' link on the login page to reset your password via your registered email.</p>
          </div>
          <div>
            <h5 className="font-semibold text-lg">🧠 AI Document Assistance</h5>
            <p>
              Our integrated AI feature allows you to interact with your documents using intelligent prompts, summaries, and suggestions. Each user is allowed up to <strong>30 AI prompts per day</strong>.
            </p>
            <p className="mt-2">
              You can also generate new documents by selecting from various AI-powered templates such as letters, reports, or summaries. Once generated, these documents can be reviewed and <strong>downloaded as needed</strong>.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-lg">📬 Need More Help?</h5>
            <p>Contact us at <a href="mailto:support@edocument.com" className="text-blue-600 underline">support@edocument.com</a> or use the feedback form on the site.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpandSupportModal;
