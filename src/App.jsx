import React, { useState } from 'react';
import Header from './components/Header.jsx';
import PdfUploader from './components/PdfUploader.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import InfoFooter from './components/InfoFooter.jsx';

function App() {
  const [generated, setGenerated] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <PdfUploader onGenerated={setGenerated} />
      <PreviewPane file={generated} />
      <InfoFooter />
    </div>
  );
}

export default App;
