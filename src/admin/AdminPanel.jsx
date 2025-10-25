// src/admin/AdminPanel.jsx
import React, { useState } from "react";

const REPO = "svasthol/SvasthOl";
const BRANCH = "main";
const PATH_IMAGES = "public/graphics/";
const PATH_MENU = "src/data/menuData.json";

const ADMIN_KEY = "Mahadeva@2025";

export default function AdminPanel() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("key");
  const [authorized, setAuthorized] = useState(key === ADMIN_KEY);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Category: "",
    Name: "",
    Price: "",
    Offer: "",
    Description: "",
    Active: "Y",
    Image: null,
  });

  const [status, setStatus] = useState("");

  async function handleUpload() {
    try {
      setLoading(true);
      setStatus("Uploading...");

      // Ask for GitHub token only once (securely per session)
      let token = sessionStorage.getItem("github_pat");
      if (!token) {
        token = prompt("Enter your GitHub Personal Access Token:");
        if (!token) return alert("Upload cancelled.");
        sessionStorage.setItem("github_pat", token);
      }

      // Step 1: Upload Image
      let imgURL = "";
      if (form.Image) {
        const fname = `${Date.now()}_${form.Image.name.replace(/\s+/g, "_")}`;
        const filePath = `${PATH_IMAGES}${fname}`;
        const fileBase64 = await fileToBase64(form.Image);

        const uploadResp = await githubPut(
          filePath,
          fileBase64,
          `Upload ${fname}`,
          token
        );
        if (!uploadResp.ok) throw new Error("Image upload failed.");
        imgURL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${filePath}`;
      }

      // Step 2: Update menuData.json
      const menuResp = await githubGet(PATH_MENU, token);
      if (!menuResp.ok) throw new Error("Failed to fetch menu data");

      const menuData = JSON.parse(
        atob(menuResp.data.content)
      );
      const sha = menuResp.data.sha;

      const newItem = {
        ID: Date.now().toString(36),
        Category: form.Category,
        Name: form.Name,
        Description: form.Description,
        Price: form.Price,
        Offer: form.Offer,
        Active: form.Active,
        ImageURL: imgURL,
      };

      menuData.unshift(newItem);

      const encodedMenu = btoa(JSON.stringify(menuData, null, 2));

      const updateMenu = await githubPut(
        PATH_MENU,
        encodedMenu,
        `Add item ${form.Name}`,
        token,
        sha
      );
      if (!updateMenu.ok) throw new Error("Menu update failed");

      setStatus("✅ Upload successful!");
    } catch (e) {
      console.error(e);
      setStatus("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authorized)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unauthorized — missing key</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">
          Admin — Add Menu Item
        </h2>

        <div className="grid gap-2">
          <input placeholder="Category" onChange={(e) => setForm({ ...form, Category: e.target.value })} />
          <input placeholder="Name" onChange={(e) => setForm({ ...form, Name: e.target.value })} />
          <input placeholder="Price" onChange={(e) => setForm({ ...form, Price: e.target.value })} />
          <input placeholder="Offer" onChange={(e) => setForm({ ...form, Offer: e.target.value })} />
          <textarea placeholder="Description" onChange={(e) => setForm({ ...form, Description: e.target.value })}></textarea>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, Image: e.target.files[0] })
            }
          />

          <select
            onChange={(e) => setForm({ ...form, Active: e.target.value })}
          >
            <option value="Y">Active</option>
            <option value="N">Hidden</option>
          </select>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded w-full"
        >
          {loading ? "Please wait..." : "Save & Publish"}
        </button>

        <div className="mt-3 text-sm text-gray-600">{status}</div>
      </div>
    </div>
  );
}

// ------------------ Helpers ------------------

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result.split(",")[1]); // remove data: prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function githubGet(path, token) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return { ok: res.ok, data };
}

async function githubPut(path, base64, msg, token, sha) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
        content: base64,
        branch: BRANCH,
        sha,
      }),
    }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { ok: res.ok, data };
}
