import * as React from 'react';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const MyPdfViewer = ({fileUrl}) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js">
            <div
                style={{
                    height: '700px',
                    width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <Viewer renderError={(error)=>{
                    return 'File not found'
                }} fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]}  />
            </div>
        </Worker>
    );
};

export default MyPdfViewer;