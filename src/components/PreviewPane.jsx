import React from 'react';

export default function PreviewPane({ file }) {
  if (!file) return null;
  return (
    <section className="max-w-5xl mx-auto px-6 pb-10 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Preview</h2>
        <a
          href={file.url}
          download={file.filename}
          className="text-indigo-300 hover:text-indigo-200 text-sm underline"
        >Download HTML</a>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900">
        <iframe
          title="Flipbook Preview"
          src={file.url}
          className="w-full"
          style={{ height: '80vh' }}
        />
      </div>
    </section>
  );
}
