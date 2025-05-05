import React from 'react';

const HtmlPreviewer = ({ htmlContent, previewRef, isPreview }) => {
  return (
    <div className="w-full flex justify-center overflow-auto px-4">
      <div className="bg-gray-100 flex justify-center">
        <div
          ref={previewRef}
          className="bg-white shadow-lg rounded-md"
          style={{
            width: '794px', // Ensures fixed width similar to A4 size
            padding: '20px', // Adds padding for better readability
            maxWidth: '100%', // Ensures responsiveness on smaller screens
            boxSizing: 'border-box', // Ensures padding doesn't overflow the content
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default HtmlPreviewer;
