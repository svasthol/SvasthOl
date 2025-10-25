
// src/admin/AdminPanel.jsx
import React, { useState } from "react";

//const UPLOAD_API = process.env.REACT_APP_UPLOAD_API || "/api/upload-to-github";
const UPLOAD_API = "/api/upload-to-github";
// If your backend runs on a different domain, set REACT_APP_UPLOAD_API to the full URL in your build/env.

const ADMIN_KEY = "Mahadeva@2025"; // keep same; or pass in header from env at deployment time

export default function AdminPanel() {
  const [form, setForm] = useState({
    Category: "",
    Name: "",
    Description: "",
    Price: "",
    Offer: "",
    Active: "Y",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleFileSelect = (e) => {
    setFile(e.target.files[0] || null);
  };

  const submit = async () => {
    if (!form.Name.trim()) return alert("Please provide item Name");
    setUploading(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append("file", file || new Blob(), file ? file.name : "");
      // append fields
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      // also include an adminKey field for fallback
      fd.append("adminKey", ADMIN_KEY);

      const resp = await fetch(UPLOAD_API, {
        method: "POST",
        body: fd,
        headers: {
          // Prefer header; fallback to form-field adminKey is present
          "x-admin-key": ADMIN_KEY,
        },
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Upload failed");

      setMessage("Uploaded and committed ✅");
      setPreviewItem(data.item || null);
      // reset form for convenience; keep preview
      setForm({
        Category: "",
        Name: "",
        Description: "",
        Price: "",
        Offer: "",
        Active: "Y",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Admin — Add Menu Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Category" value={form.Category} onChange={onChange("Category")} className="p-2 border rounded" />
          <input placeholder="Name *" value={form.Name} onChange={onChange("Name")} className="p-2 border rounded" />
          <input placeholder="Price" value={form.Price} onChange={onChange("Price")} className="p-2 border rounded" />
          <input placeholder="Offer" value={form.Offer} onChange={onChange("Offer")} className="p-2 border rounded" />
          <input placeholder="Image or Video file (optional)" type="file" accept="image/*,video/*" onChange={handleFileSelect} className="p-1 border rounded" />
          <select value={form.Active} onChange={onChange("Active")} className="p-2 border rounded">
            <option value="Y">Active</option>
            <option value="N">Hidden</option>
          </select>
          <textarea placeholder="Description" value={form.Description} onChange={onChange("Description")} className="p-2 border rounded md:col-span-3" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded" disabled={uploading}>
            {uploading ? "Uploading..." : "Save & Publish"}
          </button>
          <div className="text-sm text-gray-600">{message}</div>
        </div>

        {previewItem && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Published Item Preview</h3>
            <div className="border p-3 rounded">
              <div className="flex items-start gap-4">
                {previewItem.ImageURL && previewItem.ImageURL.endsWith(".mp4") === false && (
                  <img src={previewItem.ImageURL} alt={previewItem.Name} className="w-32 h-32 object-cover rounded" />
                )}
                {previewItem.VideoURL && (
                  <video src={previewItem.VideoURL} controls className="w-48 h-32 rounded" />
                )}
                <div>
                  <div className="font-semibold">{previewItem.Name}</div>
                  <div className="text-sm text-gray-500">₹{previewItem.Price}</div>
                  {previewItem.Offer && <div className="text-xs text-amber-700 mt-1">{previewItem.Offer}</div>}
                  <div className="mt-2 text-sm">{previewItem.Description}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
