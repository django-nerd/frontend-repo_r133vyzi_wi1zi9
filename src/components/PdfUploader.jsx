import React, { useMemo, useState } from 'react';

function computeBackendBase() {
  // 1) Explicit env var wins
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string') return envUrl.replace(/\/$/, '');
  // 2) Heuristic for sandbox: replace -3000 with -8000 in the subdomain
  try {
    const url = new URL(window.location.href);
    const host = url.host; // e.g., ta-...-3000.wo-...modal.host
    const heuristic = host.replace('-3000.', '-8000.');
    return `${url.protocol}//${heuristic}`;
  } catch (_) {
    // 3) Fallback to same-origin (useful in local dev with proxy)
    return '';
  }
}

export default function PdfUploader({ onGenerated }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('My Flipbook');
  const [dpi, setDpi] = useState(180);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backend = useMemo(() => computeBackendBase(), []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file) { setError('Please select a PDF file.'); return; }
    if (!password) { setError('Please set a password to protect the flipbook.'); return; }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('pdf', file);
      fd.append('password', password);
      fd.append('title', title);
      fd.append('dpi', String(dpi));

      const endpoint = `${backend}/convert`;
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = (file.name?.replace(/\.pdf$/i, '') || 'flipbook') + '_flipbook.html';
      onGenerated({ url, blob, filename });
    } catch (err) {
      const msg = err?.message || String(err) || 'Network error';
      setError(`Failed to convert: ${msg}. Check backend URL: ${backend}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur text-white">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">Flipbook Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-md px-3 py-2 outline-none"
              placeholder="Enter a password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-md px-3 py-2 outline-none"
              placeholder="My Flipbook"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">Render Quality (DPI)</label>
            <input
              type="number"
              min={96}
              max={300}
              step={12}
              value={dpi}
              onChange={(e) => setDpi(parseInt(e.target.value || '180', 10))}
              className="bg-slate-900 border border-white/10 rounded-md px-3 py-2 outline-none"
            />
          </div>
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? 'Converting…' : 'Generate Flipbook'}
          </button>
          <span className="text-slate-400 text-sm">Single-file HTML with swipe-only navigation, copy/print disabled.</span>
        </div>
        <div className="mt-3 text-xs text-slate-500">Using backend: <code className="text-slate-300">{backend || '(same origin)'}</code></div>
      </form>
    </section>
  );
}
