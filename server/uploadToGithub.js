// server/uploadToGithub.js
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH = "main",
  GITHUB_PATH_IMAGES = "public/graphics/",
  GITHUB_PATH_MENU = "src/data/menuData.json",
  ADMIN_KEY = "Mahadeva@2025",
} = process.env;

function base64(buf) {
  return buf.toString("base64");
}
function rawUrl(p) {
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${p}`;
}

async function ghGet(p) {
  const r = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${p}?ref=${GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!r.ok) return { ok: false, status: r.status };
  return { ok: true, data: await r.json() };
}
async function ghPut(p, b64, msg, sha) {
  const r = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${p}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: msg, content: b64, branch: GITHUB_BRANCH, sha }),
  });
  return { ok: r.ok, data: await r.json() };
}

router.post("/upload-to-github", upload.single("file"), async (req, res) => {
  try {
    const key = req.headers["x-admin-key"] || req.body.adminKey;
    if (key !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

    const f = req.file;
    const fields = req.body;
    let imgURL = "", vidURL = "";

    if (f) {
      const fname = `${Date.now()}_${f.originalname.replace(/\s+/g, "_")}`;
      const path = `${GITHUB_PATH_IMAGES}${fname}`;
      const encoded = base64(f.buffer);
      const upload = await ghPut(path, encoded, `Upload ${fname}`);
      if (!upload.ok) return res.status(500).json(upload.data);
      const url = rawUrl(path);
      if (f.mimetype.startsWith("video/")) vidURL = url; else imgURL = url;
    }

    // Fetch + update menuData.json
    const m = await ghGet(GITHUB_PATH_MENU);
    let list = [], sha;
    if (m.ok) {
      sha = m.data.sha;
      try { list = JSON.parse(Buffer.from(m.data.content, "base64").toString("utf8")); }
      catch { list = []; }
    }
    const newItem = {
      ID: Date.now().toString(36),
      Category: fields.Category || "",
      Name: fields.Name || "",
      Description: fields.Description || "",
      Price: fields.Price || "0",
      Offer: fields.Offer || "",
      ImageURL: imgURL,
      VideoURL: vidURL,
      Active: fields.Active || "Y",
    };
    list.unshift(newItem);
    const newContent = Buffer.from(JSON.stringify(list, null, 2)).toString("base64");
    const commit = await ghPut(GITHUB_PATH_MENU, newContent, `Add item ${newItem.Name}`, sha);
    if (!commit.ok) return res.status(500).json(commit.data);

    res.json({ success: true, item: newItem });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.use((err, req, res, next) => {
  console.error("🔥 Upload API error:", err);
  res.status(500).json({ error: err.message || "Unknown server error" });
});

export default router;

