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
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${p}?ref=${GITHUB_BRANCH}`;
  console.log("📂 Fetching file from GitHub:", url);

  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!r.ok) {
    console.error("❌ GitHub GET failed:", r.status, await r.text());
    return { ok: false, status: r.status };
  }

  return { ok: true, data: await r.json() };
}

async function ghPut(p, b64, msg, sha) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${p}`;
  console.log("⬆️ Uploading to GitHub:", url, "message:", msg);

  const r = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: msg,
      content: b64,
      branch: GITHUB_BRANCH,
      sha,
    }),
  });

  let data = {};
  try {
    data = await r.json();
  } catch (err) {
    console.error("⚠️ GitHub PUT returned invalid JSON:", err);
  }

  if (!r.ok) {
    console.error("❌ GitHub PUT failed:", r.status, data);
    return { ok: false, data };
  }

  console.log("✅ GitHub PUT success:", data.content?.path || "(no path)");
  return { ok: true, data };
}

// ------------------- Main Upload Endpoint -------------------
router.post("/upload-to-github", upload.single("file"), async (req, res) => {
  console.log("🟢 Upload API hit");

  try {
    const key = req.headers["x-admin-key"] || req.body.adminKey;
    if (key !== ADMIN_KEY) {
      console.warn("🚫 Unauthorized attempt with key:", key);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const f = req.file;
    const fields = req.body;
    console.log("📦 Fields received:", fields);
    if (f) console.log("📸 File received:", f.originalname, f.mimetype, f.size, "bytes");

    let imgURL = "",
      vidURL = "";

    // ---------------- Upload Image/Video ----------------
    if (f) {
      const fname = `${Date.now()}_${f.originalname.replace(/\s+/g, "_")}`;
      const path = `${GITHUB_PATH_IMAGES}${fname}`;
      const encoded = base64(f.buffer);

      console.log("🟠 Uploading file to GitHub:", path);
      const upload = await ghPut(path, encoded, `Upload ${fname}`);

      if (!upload.ok) {
        console.error("❌ GitHub image upload failed:", upload.data);
        return res.status(500).json({
          error: "GitHub image upload failed",
          detail: upload.data,
        });
      }

      const url = rawUrl(path);
      if (f.mimetype.startsWith("video/")) vidURL = url;
      else imgURL = url;
      console.log("✅ Uploaded file URL:", url);
    }

    // ---------------- Update menuData.json ----------------
    console.log("🟢 Fetching current menu file:", GITHUB_PATH_MENU);
    const m = await ghGet(GITHUB_PATH_MENU);

    let list = [],
      sha;
    if (m.ok) {
      sha = m.data.sha;
      try {
        list = JSON.parse(Buffer.from(m.data.content, "base64").toString("utf8"));
        console.log("📘 Existing menu loaded, items:", list.length);
      } catch (err) {
        console.warn("⚠️ Failed to parse existing menu JSON:", err);
        list = [];
      }
    } else {
      console.warn("⚠️ Menu file not found, creating new one.");
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
    console.log("🟢 Updating menu JSON... items:", list.length);

    const commit = await ghPut(GITHUB_PATH_MENU, newContent, `Add item ${newItem.Name}`, sha);
    if (!commit.ok) {
      console.error("❌ Failed to update menu file:", commit.data);
      return res.status(500).json({
        error: "GitHub menu update failed",
        detail: commit.data,
      });
    }

    console.log("✅ Menu updated successfully:", newItem.Name);
    res.json({ success: true, item: newItem });
  } catch (e) {
    console.error("🔥 Upload API error:", e);
    res.status(500).json({ error: e.message || "Unknown server error" });
  }
});

// ------------------- Global Error Middleware -------------------
router.use((err, req, res, next) => {
  console.error("🔥 Global error handler:", err);
  res.status(500).json({ error: err.message || "Unhandled server error" });
});

export default router;
