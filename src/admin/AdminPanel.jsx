import React, { useEffect, useState } from "react";

/**
 * AdminPanel_Diamond_Static.jsx
 * Single-file static-compatible admin for SvasthOl.
 * Works purely client-side using GitHub REST API (requires a PAT with repo contents permission).
 * Features implemented:
 *  - Items: add / edit / delete / out-of-stock toggle / price update
 *  - Categories: add / rename / delete (reassign items to Other)
 *  - List all live items (search + filter)
 *  - Offers management (src/data/offers.json)
 *  - Videos management (public/videos/ + src/data/videos.json)
 *  - Image/Video uploads to public folders (public/graphics/ and public/videos/)
 *  - Uses sessionStorage for token so you don't re-enter on every action
 *
 * Paste this file to src/admin/AdminPanel.jsx and deploy as a static page.
 */

// ----------------------- CONFIG -----------------------
const REPO = "svasthol/SvasthOl"; // update if different
const BRANCH = "main";
const PATH_MENU = "src/data/menuData.json";
const PATH_OFFERS = "src/data/offers.json";
const PATH_VIDEOS = "src/data/videos.json";
const PATH_IMAGES = "public/graphics/";
const PATH_VIDEOS_DIR = "public/videos/";

export default function AdminPanel() {
  // auth/token
  const [token, setToken] = useState(() => sessionStorage.getItem("github_pat") || "");
  const [status, setStatus] = useState("Enter token to start");
  const [loading, setLoading] = useState(false);

  // data states
  const [menuData, setMenuData] = useState([]);
  const [menuSha, setMenuSha] = useState(null);
  const [offersData, setOffersData] = useState([]);
  const [offersSha, setOffersSha] = useState(null);
  const [videosData, setVideosData] = useState([]);
  const [videosSha, setVideosSha] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState("items");
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState("");
  const [query, setQuery] = useState("");

  // forms
  const emptyForm = { Category: "", Name: "", Price: "0", Offer: "", Description: "", Active: "Y", Image: null, OutOfStock: false };
  const [itemForm, setItemForm] = useState({ ...emptyForm });
  const [editingItem, setEditingItem] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Offer form
  const emptyOffer = { id: null, title: "", subtitle: "", image: null, validTill: "", animation: "fade" };
  const [offerForm, setOfferForm] = useState({ ...emptyOffer });
  const [editingOffer, setEditingOffer] = useState(null);

  // Video form
  const emptyVideo = { id: null, title: "", caption: "", file: null, thumb: null, place: "home" };
  const [videoForm, setVideoForm] = useState({ ...emptyVideo });
  const [editingVideo, setEditingVideo] = useState(null);

  // ---------- Helpers: GitHub API ----------
  async function ensureToken() {
    if (token) return token;
    const t = prompt("Enter your GitHub Personal Access Token (with repo contents scope):");
    if (!t) throw new Error("Token required");
    sessionStorage.setItem("github_pat", t);
    setToken(t);
    return t;
  }

  function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function base64Decode(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  async function githubGet(path) {
    const t = await ensureToken();
    setStatus(`Fetching ${path}...`);
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  }

  // ✅ Safe PUT with SHA check and retry (auto-fix for missing or invalid SHA)
async function githubPut(path, contentB64, message, sha) {
  const t = await ensureToken();

  async function attempt(currentSha, retry = false) {
    setStatus(`Committing ${path}...${retry ? " (retrying with fresh SHA)" : ""}`);

    // ✅ Build body dynamically — omit sha if invalid
    const body = {
      message: message + (retry ? " (retry)" : ""),
      content: contentB64,
      branch: BRANCH,
    };

    if (currentSha && typeof currentSha === "string") {
      body.sha = currentSha; // include only if valid
    }

    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${t}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    // ✅ Success case
    if (res.ok) {
      console.log("✅ GitHub PUT success:", path);
      return { ok: true, data };
    }

    // ⚠️ SHA mismatch case
    if (
      !retry &&
      (data?.message?.includes("does not match") ||
        data?.message?.includes("sha does not match"))
    ) {
      console.warn("⚠️ SHA mismatch detected, refetching latest SHA...");

      const refetch = await githubGet(path);
      if (refetch?.ok && refetch?.data?.sha) {
        console.log("🔁 Retrying commit with fresh SHA:", refetch.data.sha);
        return await attempt(refetch.data.sha, true);
      }
    }

    // ❌ Hard fail
    console.error("❌ GitHub PUT failed:", data);
    setStatus(`Commit failed for ${path}: ${data?.message || "Unknown error"}`);
    return { ok: false, data };
  }

  return await attempt(sha);
}



  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ---------- Load all data ----------
  useEffect(() => {
    if (!token) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadAll() {
    try {
      setLoading(true);
      setStatus("Loading menu, offers and videos...");

      // menu
      const m = await githubGet(PATH_MENU);
      if (m.ok) {
        const content = base64Decode(m.data.content);
        const parsed = JSON.parse(content || "[]");
        setMenuData(parsed);
        setMenuSha(m.data.sha);
        setStatus("Loaded menuData.json");
      } else {
        setMenuData([]);
        setMenuSha(null);
      }

      // offers
      const o = await githubGet(PATH_OFFERS);
      if (o.ok) {
        const content = base64Decode(o.data.content);
        setOffersData(JSON.parse(content || "[]"));
        setOffersSha(o.data.sha);
      } else {
        setOffersData([]);
        setOffersSha(null);
      }

      // videos
      const v = await githubGet(PATH_VIDEOS);
      if (v.ok) {
        const content = base64Decode(v.data.content);
        setVideosData(JSON.parse(content || "[]"));
        setVideosSha(v.data.sha);
      } else {
        setVideosData([]);
        setVideosSha(null);
      }

      setStatus("All data loaded");
    } catch (e) {
      console.error(e);
      setStatus("Error loading data: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  // ---------- Derived state ----------
  useEffect(() => {
    const cats = [...new Set(menuData.map((i) => i.Category || "Other"))];
    setCategories(cats.filter(Boolean));
  }, [menuData]);

  // ---------- Utility: Commit menuData ----------
  async function commitMenu(newMenu, msg) {
    try {
      setLoading(true);
      const encoded = base64Encode(JSON.stringify(newMenu, null, 2));
      const res = await githubPut(PATH_MENU, encoded, msg, menuSha);
      if (!res.ok) throw new Error(res.data && res.data.message ? res.data.message : "Failed to commit menu");
      // update sha and local state
      if (res.data && res.data.content) setMenuSha(res.data.content.sha || res.data.content.node_id);
      setMenuData(newMenu);
      setStatus("Menu updated ✔️");
      return true;
    } catch (e) {
      setStatus("Commit failed: " + e.message);
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ---------- Category Actions ----------
  async function addCategory(catName) {
    if (!catName) return alert("Enter category name");
    // Option: create a placeholder item with Active=N so category appears
    const placeholder = {
      ID: Date.now().toString(36),
      Category: catName,
      Name: `__CATEGORY_PLACEHOLDER__${catName}`,
      Description: "",
      Price: "0",
      Offer: "",
      Active: "N",
      OutOfStock: true,
      ImageURL: "",
    };
    const updated = [placeholder, ...menuData];
    const ok = await commitMenu(updated, `Add category ${catName}`);
    if (ok) setNewCategoryName("");
  }

  async function renameCategory(oldName, newName) {
    if (!newName) return;
    const updated = menuData.map((it) => (it.Category === oldName ? { ...it, Category: newName } : it));
    const ok = await commitMenu(updated, `Rename category ${oldName} → ${newName}`);
    if (ok) setStatus(`Renamed ${oldName} → ${newName}`);
  }

  async function deleteCategory(catName) {
    if (!window.confirm(`Delete category ${catName}? Items will be moved to 'Other'`)) return;
    const updated = menuData.map((it) => (it.Category === catName ? { ...it, Category: "Other" } : it));
    await commitMenu(updated, `Delete category ${catName}`);
  }

  // ---------- Item CRUD ----------
  async function handleAddOrUpdateItem() {
    try {
      setLoading(true);
      setStatus("Processing item...");
      let imageUrl = "";

      if (itemForm.Image && itemForm.Image instanceof File) {
        const fname = `${Date.now()}_${itemForm.Image.name.replace(/\s+/g, "_")}`;
        const path = `${PATH_IMAGES}${fname}`;
        const b64 = await fileToBase64(itemForm.Image);
        const upload = await githubPut(path, b64, `Upload ${fname}`);
        if (!upload.ok) throw new Error("Image upload failed");
        imageUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
      }

      if (editingItem) {
        // update
        const updated = menuData.map((it) =>
          it.ID === editingItem.ID
            ? { ...it, ...editingItem, ...itemForm, ImageURL: imageUrl || editingItem.ImageURL }
            : it
        );
        const ok = await commitMenu(updated, `Update item ${editingItem.Name}`);
        if (ok) {
          setEditingItem(null);
          setItemForm({ ...emptyForm });
        }
      } else {
        // add
        const newItem = {
          ID: Date.now().toString(36),
          Category: itemForm.Category || (categories[0] || "Other"),
          Name: itemForm.Name || "Untitled",
          Description: itemForm.Description || "",
          Price: itemForm.Price || "0",
          Offer: itemForm.Offer || "",
          Active: itemForm.Active || "Y",
          OutOfStock: !!itemForm.OutOfStock,
          ImageURL: imageUrl,
        };
        const updated = [newItem, ...menuData];
        const ok = await commitMenu(updated, `Add item ${newItem.Name}`);
        if (ok) setItemForm({ ...emptyForm });
      }
    } catch (e) {
      console.error(e);
      setStatus("Item action failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditItem(item) {
    setEditingItem(item);
    setItemForm({ ...item, Image: null });
    setActiveTab("items");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteItem(id) {
    if (!window.confirm("Delete this item?")) return;
    const updated = menuData.filter((it) => it.ID !== id);
    await commitMenu(updated, `Delete item ${id}`);
  }

  async function toggleOutOfStock(id) {
    const updated = menuData.map((it) => (it.ID === id ? { ...it, OutOfStock: !it.OutOfStock } : it));
    await commitMenu(updated, `Toggle out-of-stock ${id}`);
  }

  async function updatePrice(id, price) {
    const updated = menuData.map((it) => (it.ID === id ? { ...it, Price: price } : it));
    await commitMenu(updated, `Update price ${id} → ${price}`);
  }

  // ---------- Offers CRUD (offers.json) ----------
async function commitOffers(newOffers, msg) {
  try {
    setLoading(true);
    const encoded = base64Encode(JSON.stringify(newOffers, null, 2));

    // ✅ Only send SHA if valid
    const shaToUse = offersSha && typeof offersSha === "string" ? offersSha : undefined;

    const res = await githubPut(PATH_OFFERS, encoded, msg, shaToUse);
    if (!res.ok) throw new Error(res.data?.message || "Failed to commit offers");

    // ✅ Save new SHA if file was just created
    if (res.data?.content?.sha) {
      setOffersSha(res.data.content.sha);
    }

    setOffersData(newOffers);
    setStatus("Offers updated ✔️");
    return true;
  } catch (e) {
    setStatus("Offers commit failed: " + e.message);
    console.error("💥 Offers commit error:", e);
    return false;
  } finally {
    setLoading(false);
  }
}



  async function addOrUpdateOffer() {
    try {
      setLoading(true);
      setStatus("Saving offer...");
      let imgUrl = "";
      if (offerForm.image && offerForm.image instanceof File) {
        const fname = `${Date.now()}_${offerForm.image.name.replace(/\s+/g, "_")}`;
        const path = `${PATH_IMAGES}${fname}`;
        const b64 = await fileToBase64(offerForm.image);
        const upload = await githubPut(path, b64, `Upload offer image ${fname}`);
        if (!upload.ok) throw new Error("Offer image upload failed");
        imgUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
      }

      if (editingOffer) {
        const updated = offersData.map((o) => (o.id === editingOffer.id ? { ...editingOffer, ...offerForm, image: imgUrl || editingOffer.image } : o));
        const ok = await commitOffers(updated, `Update offer ${editingOffer.title}`);
        if (ok) { setEditingOffer(null); setOfferForm({ ...emptyOffer }); }
      } else {
        const newOffer = { id: Date.now().toString(36), title: offerForm.title, subtitle: offerForm.subtitle, image: imgUrl, validTill: offerForm.validTill || null, animation: offerForm.animation || "fade" };
        const updated = [newOffer, ...offersData];
        const ok = await commitOffers(updated, `Add offer ${newOffer.title}`);
        if (ok) setOfferForm({ ...emptyOffer });
      }
    } catch (e) {
      console.error(e);
      setStatus("Offer save failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOffer(id) {
    if (!window.confirm("Delete this offer?")) return;
    const updated = offersData.filter((o) => o.id !== id);
    await commitOffers(updated, `Delete offer ${id}`);
  }

  // ---------- Videos CRUD (videos.json + uploads to public/videos) ----------
  async function commitVideos(newVideos, msg) {
    try {
      setLoading(true);
      const encoded = base64Encode(JSON.stringify(newVideos, null, 2));
      const res = await githubPut(PATH_VIDEOS, encoded, msg, videosSha);
      if (!res.ok) throw new Error(res.data?.message || "Failed to commit videos");
      if (res.data?.content) setVideosSha(res.data.content.sha || videosSha);
      setVideosData(newVideos);
      setStatus("Videos updated ✔️");
      return true;
    } catch (e) {
      setStatus("Videos commit failed: " + e.message);
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function addOrUpdateVideo() {
    try {
      setLoading(true);
      setStatus("Uploading video (may take a while)...");
      let vidUrl = "";
      let thumbUrl = "";

      if (videoForm.file && videoForm.file instanceof File) {
        const fname = `${Date.now()}_${videoForm.file.name.replace(/\s+/g, "_")}`;
        const path = `${PATH_VIDEOS_DIR}${fname}`;
        const b64 = await fileToBase64(videoForm.file);
        const upload = await githubPut(path, b64, `Upload video ${fname}`);
        if (!upload.ok) throw new Error("Video upload failed");
        vidUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
      }

      if (videoForm.thumb && videoForm.thumb instanceof File) {
        const fname = `${Date.now()}_${videoForm.thumb.name.replace(/\s+/g, "_")}`;
        const path = `${PATH_IMAGES}${fname}`;
        const b64 = await fileToBase64(videoForm.thumb);
        const upload = await githubPut(path, b64, `Upload video thumb ${fname}`);
        if (!upload.ok) throw new Error("Video thumb upload failed");
        thumbUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
      }

      if (editingVideo) {
        const updated = videosData.map((v) => (v.id === editingVideo.id ? { ...editingVideo, ...videoForm, file: vidUrl || editingVideo.file, thumb: thumbUrl || editingVideo.thumb } : v));
        const ok = await commitVideos(updated, `Update video ${editingVideo.title}`);
        if (ok) { setEditingVideo(null); setVideoForm({ ...emptyVideo }); }
      } else {
        const newVideo = { id: Date.now().toString(36), title: videoForm.title, caption: videoForm.caption, file: vidUrl, thumb: thumbUrl, place: videoForm.place || "home" };
        const updated = [newVideo, ...videosData];
        const ok = await commitVideos(updated, `Add video ${newVideo.title}`);
        if (ok) setVideoForm({ ...emptyVideo });
      }
    } catch (e) {
      console.error(e);
      setStatus("Video upload failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteVideo(id) {
    if (!window.confirm("Delete this video?")) return;
    const updated = videosData.filter((v) => v.id !== id);
    await commitVideos(updated, `Delete video ${id}`);
  }

  // ---------- UI Helpers ----------
  function resetToken() {
    sessionStorage.removeItem("github_pat");
    setToken("");
    setStatus("Token cleared");
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen p-6 bg-amber-50 text-emerald-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Svasth Òl — Diamond Admin (Static)</h1>
          <div className="flex items-center gap-2">
            <input
              value={token}
              onChange={(e) => { setToken(e.target.value); sessionStorage.setItem("github_pat", e.target.value); }}
              placeholder="GitHub PAT"
              className="px-3 py-2 border rounded"
            />
            <button onClick={() => { sessionStorage.setItem("github_pat", token); loadAll(); }} className="px-3 py-2 bg-emerald-600 text-white rounded">Load</button>
            <button onClick={resetToken} className="px-3 py-2 border rounded">Clear Token</button>
          </div>
        </header>

        <div className="mb-4 text-sm text-gray-700">{status} {loading && '⏳'}</div>

        {/* Tabs */}
        <nav className="flex gap-2 mb-6">
          <Tab label="Items" active={activeTab === "items"} onClick={() => setActiveTab("items")} />
          <Tab label="Categories" active={activeTab === "categories"} onClick={() => setActiveTab("categories")} />
          <Tab label="Offers" active={activeTab === "offers"} onClick={() => setActiveTab("offers")} />
          <Tab label="Videos" active={activeTab === "videos"} onClick={() => setActiveTab("videos")} />
        </nav>

        {/* Content area */}
        <div className="bg-white rounded-2xl p-6 shadow">
          {activeTab === "items" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Add / Edit form */}
                <div className="col-span-1 md:col-span-1">
                  <h2 className="font-semibold mb-2">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                  <div className="space-y-2">
                    <select className="w-full border px-2 py-1 rounded" value={itemForm.Category} onChange={(e) => setItemForm({ ...itemForm, Category: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <input className="w-full border px-2 py-1 rounded" placeholder="Name" value={itemForm.Name} onChange={(e) => setItemForm({ ...itemForm, Name: e.target.value })} />
                    <input className="w-full border px-2 py-1 rounded" placeholder="Price" value={itemForm.Price} onChange={(e) => setItemForm({ ...itemForm, Price: e.target.value })} />
                    <input className="w-full border px-2 py-1 rounded" placeholder="Offer" value={itemForm.Offer} onChange={(e) => setItemForm({ ...itemForm, Offer: e.target.value })} />
                    <textarea className="w-full border px-2 py-1 rounded" placeholder="Description" value={itemForm.Description} onChange={(e) => setItemForm({ ...itemForm, Description: e.target.value })} />
                    <div>
                      <label className="block text-sm">Image (optional)</label>
                      <input type="file" accept="image/*" onChange={(e) => setItemForm({ ...itemForm, Image: e.target.files[0] })} />
                    </div>
                    <div className="flex gap-2">
                      <select value={itemForm.Active} onChange={(e) => setItemForm({ ...itemForm, Active: e.target.value })} className="border px-2 py-1 rounded">
                        <option value="Y">Active</option>
                        <option value="N">Hidden</option>
                      </select>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!itemForm.OutOfStock} onChange={(e) => setItemForm({ ...itemForm, OutOfStock: e.target.checked })} /> Out of stock
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddOrUpdateItem} className="px-3 py-2 bg-emerald-600 text-white rounded flex-1">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                      <button onClick={() => { setEditingItem(null); setItemForm({ ...emptyForm }); }} className="px-3 py-2 border rounded">Reset</button>
                    </div>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex gap-2 mb-4">
                    <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="border px-2 py-1 rounded">
                      <option value="">All Categories</option>
                      {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <input placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 border px-2 py-1 rounded" />
                    <button onClick={() => { setQuery(""); setFilterCat(""); }} className="px-3 py-1 border rounded">Clear</button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto border rounded">
                    {menuData.filter((it) => (filterCat ? it.Category === filterCat : true)).filter((it) => (query ? it.Name.toLowerCase().includes(query.toLowerCase()) : true)).map((it) => (
                      <div key={it.ID} className="flex items-center justify-between gap-4 p-3 border-b">
                        <div className="flex items-center gap-3">
                          <img src={it.ImageURL || 'https://via.placeholder.com/80?text=No+Img'} alt={it.Name} className="w-20 h-20 object-cover rounded" />
                          <div>
                            <div className="font-semibold">{it.Name}</div>
                            <div className="text-sm text-gray-600">{it.Category} • {it.Description}</div>
                            <div className="text-emerald-700 font-bold">{it.Price}</div>
                            {it.Offer && <div className="text-sm text-amber-600">Offer: {it.Offer}</div>}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <button onClick={() => startEditItem(it)} className="px-2 py-1 border rounded">Edit</button>
                            <button onClick={() => deleteItem(it.ID)} className="px-2 py-1 border text-red-600 rounded">Delete</button>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button onClick={() => toggleOutOfStock(it.ID)} className={`px-2 py-1 rounded ${it.OutOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{it.OutOfStock ? 'Out of stock' : 'In stock'}</button>
                            <input value={it.Price} onChange={(e) => updatePrice(it.ID, e.target.value)} className="px-2 py-1 border rounded text-sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              <h2 className="font-semibold mb-2">Manage Categories</h2>
              <div className="flex gap-2 mb-4">
                <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category" className="flex-1 border px-2 py-1 rounded" />
                <button onClick={() => addCategory(newCategoryName)} className="px-3 py-2 bg-emerald-600 text-white rounded">Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((c) => (
                  <div key={c} className="p-3 border rounded flex items-center justify-between">
                    <div className="font-semibold">{c}</div>
                    <div className="flex gap-2">
                      <button onClick={() => { const name = prompt('Rename category', c); if (name) renameCategory(c, name); }} className="px-2 py-1 border rounded">Rename</button>
                      <button onClick={() => deleteCategory(c)} className="px-2 py-1 border text-red-600 rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "offers" && (
            <div>
              <h2 className="font-semibold mb-3">Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="mb-2 font-semibold">{editingOffer ? 'Edit Offer' : 'Add Offer'}</div>
                  <input placeholder="Title" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} className="w-full border px-2 py-1 rounded mb-2" />
                  <input placeholder="Subtitle" value={offerForm.subtitle} onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })} className="w-full border px-2 py-1 rounded mb-2" />
                  <input type="date" value={offerForm.validTill} onChange={(e) => setOfferForm({ ...offerForm, validTill: e.target.value })} className="w-full border px-2 py-1 rounded mb-2" />
                  <select value={offerForm.animation} onChange={(e) => setOfferForm({ ...offerForm, animation: e.target.value })} className="w-full border px-2 py-1 rounded mb-2">
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="pulse">Pulse</option>
                  </select>
                  <div>
                    <label className="block text-sm">Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setOfferForm({ ...offerForm, image: e.target.files[0] })} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={addOrUpdateOffer} className="px-3 py-2 bg-emerald-600 text-white rounded">Save Offer</button>
                    <button onClick={() => { setOfferForm({ ...emptyOffer }); setEditingOffer(null); }} className="px-3 py-2 border rounded">Reset</button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="max-h-[60vh] overflow-y-auto border rounded">
                    {offersData.map((o) => (
                      <div key={o.id} className="flex items-center justify-between gap-4 p-3 border-b">
                        <div className="flex items-center gap-3">
                          <img src={o.image || 'https://via.placeholder.com/100?text=No+Img'} alt={o.title} className="w-24 h-16 object-cover rounded" />
                          <div>
                            <div className="font-semibold">{o.title}</div>
                            <div className="text-sm text-gray-600">{o.subtitle}</div>
                            <div className="text-xs text-gray-500">Valid till: {o.validTill || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingOffer(o); setOfferForm({ ...o, image: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-2 py-1 border rounded">Edit</button>
                          <button onClick={() => deleteOffer(o.id)} className="px-2 py-1 border text-red-600 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <h2 className="font-semibold mb-3">Preparation Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="mb-2 font-semibold">{editingVideo ? 'Edit Video' : 'Add Video'}</div>
                  <input placeholder="Title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} className="w-full border px-2 py-1 rounded mb-2" />
                  <textarea placeholder="Caption" value={videoForm.caption} onChange={(e) => setVideoForm({ ...videoForm, caption: e.target.value })} className="w-full border px-2 py-1 rounded mb-2" />
                  <div className="mb-2">
                    <label className="block text-sm">Video file</label>
                    <input type="file" accept="video/*" onChange={(e) => setVideoForm({ ...videoForm, file: e.target.files[0] })} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Thumbnail (optional)</label>
                    <input type="file" accept="image/*" onChange={(e) => setVideoForm({ ...videoForm, thumb: e.target.files[0] })} />
                  </div>
                  <select value={videoForm.place} onChange={(e) => setVideoForm({ ...videoForm, place: e.target.value })} className="w-full border px-2 py-1 rounded mb-2">
                    <option value="home">Home</option>
                    <option value="gallery">Gallery</option>
                    <option value="about">About</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={addOrUpdateVideo} className="px-3 py-2 bg-emerald-600 text-white rounded">Upload</button>
                    <button onClick={() => { setVideoForm({ ...emptyVideo }); setEditingVideo(null); }} className="px-3 py-2 border rounded">Reset</button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="max-h-[60vh] overflow-y-auto border rounded">
                    {videosData.map((v) => (
                      <div key={v.id} className="flex items-center justify-between gap-4 p-3 border-b">
                        <div className="flex items-center gap-3">
                          <img src={v.thumb || 'https://via.placeholder.com/120x80?text=No+Thumb'} alt={v.title} className="w-32 h-20 object-cover rounded" />
                          <div>
                            <div className="font-semibold">{v.title}</div>
                            <div className="text-sm text-gray-600">{v.caption}</div>
                            <div className="text-xs text-gray-500">Place: {v.place}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingVideo(v); setVideoForm({ ...v, file: null, thumb: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-2 py-1 border rounded">Edit</button>
                          <button onClick={() => deleteVideo(v.id)} className="px-2 py-1 border text-red-600 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        <footer className="mt-6 text-sm text-gray-700">Diamond Admin • Client-only (static) • Changes commit to GitHub (make sure your PAT has repo:contents)</footer>
      </div>
    </div>
  );
}

// ----------------------- Small UI components -----------------------
function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded ${active ? 'bg-emerald-600 text-white' : 'border'}`}>
      {label}
    </button>
  );
}
