import React from 'react';

const HtmlPreviewer = ({ htmlContent, previewRef}) => {
  return (
    <div className="w-full flex justify-center overflow-auto">
      <div className="bg-gray-100 flex justify-center">
        <div
          ref={previewRef}
          className="bg-white shadow-lg rounded-sm text-gray-800"
          style={{
            width: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default HtmlPreviewer;
