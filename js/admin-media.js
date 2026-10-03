// NEXVION AI ACADEMY - Admin Media & Video Management Suite
// Handles: Uploading Photos & Videos, File-to-Base64 Conversion, YouTube/Embed Parsing,
//          Media Grid Rendering, Lightbox & Video Player Modals, and LocalStorage / Cloud sync.

const AdminMedia = {
  currentFilter: "ALL",
  currentSearch: "",
  activeMedia: null,
  uploadedDataUrl: null,

  init: function () {
    this.render();
    this.updateBadge();
    console.log("📷 Admin Media & Video Suite initialized.");
  },

  updateBadge: function () {
    const list = StorageService.getMedia ? StorageService.getMedia() : [];
    const badge = document.getElementById("badgeMediaCount");
    if (badge) badge.textContent = list.length;
  },

  render: function () {
    let list = StorageService.getMedia ? StorageService.getMedia() : [];

    // Filter by type
    if (this.currentFilter === "PHOTO") {
      list = list.filter((m) => m.type === "photo");
    } else if (this.currentFilter === "VIDEO") {
      list = list.filter((m) => m.type === "video");
    } else if (this.currentFilter === "CAMPUS") {
      list = list.filter((m) => m.category && m.category.includes("Campus"));
    } else if (this.currentFilter === "LECTURE") {
      list = list.filter((m) => m.category && (m.category.includes("Lecture") || m.category.includes("Demo")));
    }

    // Search filter
    if (this.currentSearch.trim()) {
      const q = this.currentSearch.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.caption && m.caption.toLowerCase().includes(q)) ||
          (m.track && m.track.toLowerCase().includes(q))
      );
    }

    // Render Stats
    const totalMedia = (StorageService.getMedia ? StorageService.getMedia() : []).length;
    const allItems = StorageService.getMedia ? StorageService.getMedia() : [];
    const photoCount = allItems.filter((m) => m.type === "photo").length;
    const videoCount = allItems.filter((m) => m.type === "video").length;

    const elTotal = document.getElementById("statMediaTotal");
    const elPhotos = document.getElementById("statMediaPhotos");
    const elVideos = document.getElementById("statMediaVideos");

    if (elTotal) elTotal.textContent = totalMedia;
    if (elPhotos) elPhotos.textContent = photoCount;
    if (elVideos) elVideos.textContent = videoCount;

    // Render Grid
    const container = document.getElementById("adminMediaGridContainer");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 60px 20px; background:#ffffff; border:1px dashed #cbd5e1; border-radius:14px;">
          <div style="font-size:2.5rem; color:#94a3b8; margin-bottom:12px;"><i class="fas fa-photo-film"></i></div>
          <h4 style="margin:0 0 6px 0; color:#0f172a; font-weight:700;">No Media Assets Found</h4>
          <p style="margin:0 0 16px 0; color:#64748b; font-size:0.85rem;">Click the "+ Upload Photo / Video" button above to add course media, lecture screencasts, or campus photos.</p>
          <button class="btn btn-primary btn-sm" onclick="AdminMedia.openUploadModal()"><i class="fas fa-plus"></i> Upload Media</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list
      .map((item) => {
        const isVideo = item.type === "video";
        const thumbnailSrc = isVideo
          ? item.url.includes("youtube.com/embed/")
            ? `https://img.youtube.com/vi/${item.url.split("/embed/")[1].split("?")[0]}/hqdefault.jpg`
            : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
          : item.url;

        return `
          <div class="card" style="border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; display:flex; flex-direction:column; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.02); transition:transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.06)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.02)';">
            <div style="position:relative; width:100%; height:180px; background:#0f172a; overflow:hidden; cursor:pointer;" onclick="AdminMedia.openPlayerModal('${item.id}')">
              <img src="${thumbnailSrc}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.9; transition:opacity 0.2s;" onerror="this.src='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'">
              
              <div style="position:absolute; top:10px; left:10px;">
                <span class="badge" style="background:${isVideo ? "rgba(220, 38, 38, 0.9)" : "rgba(14, 165, 233, 0.9)"}; color:#fff; font-weight:800; font-size:0.7rem; letter-spacing:0.04em;">
                  <i class="fas ${isVideo ? "fa-video" : "fa-camera"}"></i> ${isVideo ? "VIDEO" : "PHOTO"}
                </span>
              </div>

              ${
                isVideo
                  ? `
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
                  <div style="width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,0.9); color:#dc2626; display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 4px 15px rgba(0,0,0,0.3); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.15)';" onmouseout="this.style.transform='scale(1)';">
                    <i class="fas fa-play" style="margin-left:3px;"></i>
                  </div>
                </div>
              `
                  : ""
              }

              <div style="position:absolute; bottom:8px; right:10px; background:rgba(0,0,0,0.7); color:#fff; font-size:0.68rem; font-weight:700; padding:2px 6px; border-radius:4px;">
                ${item.size || "1080p"}
              </div>
            </div>

            <div style="padding:16px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                  <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">${item.category || "General"}</span>
                  <span style="font-size:0.72rem; color:#94a3b8;"><i class="fas fa-calendar-alt"></i> ${item.date || "2026-10-03"}</span>
                </div>
                <h4 style="margin:0 0 6px 0; font-size:0.95rem; font-weight:800; color:#0f172a; line-height:1.3;">${item.title}</h4>
                <p style="margin:0 0 12px 0; font-size:0.8rem; color:#64748b; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.caption || "No description provided."}</p>
                <div style="font-size:0.72rem; color:#0284c7; font-weight:600;"><i class="fas fa-graduation-cap"></i> ${item.track || "All Tracks"}</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; pt:12px; border-top:1px solid #f1f5f9;">
                <button class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:4px 8px;" onclick="AdminMedia.copyMediaUrl('${item.id}')" title="Copy URL">
                  <i class="fas fa-link"></i> Copy Link
                </button>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:4px 8px;" onclick="AdminMedia.openPlayerModal('${item.id}')" title="View / Play">
                    <i class="fas fa-eye"></i> View
                  </button>
                  <button class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:4px 8px; color:#ef4444;" onclick="AdminMedia.deleteMedia('${item.id}')" title="Delete Asset">
                    <i class="fas fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  },

  setFilter: function (type, element) {
    this.currentFilter = type;
    document.querySelectorAll(".media-filter-chip").forEach((el) => el.classList.remove("active"));
    if (element) element.classList.add("active");
    this.render();
  },

  handleSearch: function (val) {
    this.currentSearch = val;
    this.render();
  },

  openUploadModal: function () {
    const modal = document.getElementById("adminMediaUploadModal");
    if (!modal) return;
    this.uploadedDataUrl = null;
    document.getElementById("mediaUploadForm").reset();
    document.getElementById("mediaLivePreviewBox").innerHTML = `
      <div style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:40px 10px;">
        <i class="fas fa-cloud-arrow-up" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
        Select a local photo/video file or paste an external link to preview
      </div>
    `;
    modal.classList.add("active");
    if (typeof SoundFX !== "undefined") SoundFX.playOpen();
  },

  closeUploadModal: function () {
    const modal = document.getElementById("adminMediaUploadModal");
    if (modal) {
      modal.classList.remove("active");
      if (typeof SoundFX !== "undefined") SoundFX.playClose();
    }
  },

  handleFileUpload: function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    // Auto set type dropdown
    const typeSelect = document.getElementById("mediaInputType");
    if (typeSelect) {
      typeSelect.value = isVideo ? "video" : "photo";
    }

    const previewBox = document.getElementById("mediaLivePreviewBox");
    const reader = new FileReader();

    reader.onload = (e) => {
      this.uploadedDataUrl = e.target.result;
      if (isImage) {
        previewBox.innerHTML = `
          <img src="${e.target.result}" alt="Preview" style="max-width:100%; max-height:220px; border-radius:8px; object-fit:contain; display:block; margin:0 auto;">
          <div style="margin-top:8px; font-size:0.75rem; color:#64748b; text-align:center;">${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)</div>
        `;
      } else if (isVideo) {
        previewBox.innerHTML = `
          <video controls autoplay muted style="max-width:100%; max-height:220px; border-radius:8px; display:block; margin:0 auto;">
            <source src="${e.target.result}" type="${file.type}">
            Your browser does not support HTML5 video.
          </video>
          <div style="margin-top:8px; font-size:0.75rem; color:#64748b; text-align:center;">${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)</div>
        `;
      }
    };

    reader.readAsDataURL(file);
  },

  handleUrlChange: function () {
    const urlInput = document.getElementById("mediaInputUrl");
    if (!urlInput) return;
    let url = urlInput.value.trim();
    if (!url) return;

    const typeSelect = document.getElementById("mediaInputType");
    const previewBox = document.getElementById("mediaLivePreviewBox");

    // Detect YouTube URL
    if (url.includes("youtube.com/watch?v=")) {
      const vidId = url.split("v=")[1].split("&")[0];
      url = `https://www.youtube.com/embed/${vidId}`;
      urlInput.value = url;
      if (typeSelect) typeSelect.value = "video";
    } else if (url.includes("youtu.be/")) {
      const vidId = url.split("youtu.be/")[1].split("?")[0];
      url = `https://www.youtube.com/embed/${vidId}`;
      urlInput.value = url;
      if (typeSelect) typeSelect.value = "video";
    }

    const type = typeSelect ? typeSelect.value : "photo";

    if (type === "video") {
      if (url.includes("youtube.com/embed/")) {
        previewBox.innerHTML = `
          <iframe src="${url}" style="width:100%; height:200px; border:0; border-radius:8px;" allowfullscreen></iframe>
        `;
      } else {
        previewBox.innerHTML = `
          <video controls autoplay muted style="max-width:100%; max-height:220px; border-radius:8px; display:block; margin:0 auto;">
            <source src="${url}">
          </video>
        `;
      }
    } else {
      previewBox.innerHTML = `
        <img src="${url}" alt="Preview" style="max-width:100%; max-height:220px; border-radius:8px; object-fit:contain; display:block; margin:0 auto;" onerror="this.src='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'">
      `;
    }
  },

  submitMedia: function () {
    const titleInput = document.getElementById("mediaInputTitle");
    const typeSelect = document.getElementById("mediaInputType");
    const urlInput = document.getElementById("mediaInputUrl");
    const categorySelect = document.getElementById("mediaInputCategory");
    const trackSelect = document.getElementById("mediaInputTrack");
    const captionInput = document.getElementById("mediaInputCaption");

    if (!titleInput || !titleInput.value.trim()) {
      alert("Please provide a title for this media asset.");
      if (titleInput) titleInput.focus();
      return;
    }

    const mediaUrl = this.uploadedDataUrl || (urlInput ? urlInput.value.trim() : "");
    if (!mediaUrl) {
      alert("Please either select a local file or paste an image/video URL.");
      return;
    }

    const type = typeSelect ? typeSelect.value : "photo";
    const newMedia = {
      id: `med-${Date.now()}`,
      title: titleInput.value.trim(),
      type: type,
      url: mediaUrl,
      category: categorySelect ? categorySelect.value : "General",
      track: trackSelect ? trackSelect.value : "All Tracks",
      caption: captionInput ? captionInput.value.trim() : "",
      date: new Date().toISOString().slice(0, 10),
      size: this.uploadedDataUrl ? "Local Upload" : "Web Asset"
    };

    if (StorageService.saveMediaItem) {
      StorageService.saveMediaItem(newMedia);
    }

    this.closeUploadModal();
    this.render();
    this.updateBadge();

    if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
    alert(`Success: "${newMedia.title}" has been saved to the Media Library.`);
  },

  openPlayerModal: function (mediaId) {
    const list = StorageService.getMedia ? StorageService.getMedia() : [];
    const item = list.find((m) => m.id === mediaId);
    if (!item) return;

    this.activeMedia = item;
    const modal = document.getElementById("adminMediaPlayerModal");
    if (!modal) return;

    const titleEl = document.getElementById("playerMediaTitle");
    const subtitleEl = document.getElementById("playerMediaSubtitle");
    const stageEl = document.getElementById("playerMediaStage");
    const captionEl = document.getElementById("playerMediaCaption");

    if (titleEl) titleEl.textContent = item.title;
    if (subtitleEl) subtitleEl.textContent = `${item.type.toUpperCase()} • ${item.category} • ${item.track} • ${item.date}`;
    if (captionEl) captionEl.textContent = item.caption || "No additional description available.";

    if (stageEl) {
      if (item.type === "video") {
        if (item.url.includes("youtube.com/embed/")) {
          stageEl.innerHTML = `
            <iframe src="${item.url}?autoplay=1" style="width:100%; height:420px; border:0; border-radius:12px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `;
        } else {
          stageEl.innerHTML = `
            <video controls autoplay style="width:100%; max-height:450px; border-radius:12px; background:#000;">
              <source src="${item.url}">
              Your browser does not support HTML5 video.
            </video>
          `;
        }
      } else {
        stageEl.innerHTML = `
          <img src="${item.url}" alt="${item.title}" style="max-width:100%; max-height:480px; object-fit:contain; border-radius:12px; display:block; margin:0 auto; box-shadow:0 8px 30px rgba(0,0,0,0.25);">
        `;
      }
    }

    modal.classList.add("active");
    if (typeof SoundFX !== "undefined") SoundFX.playOpen();
  },

  closePlayerModal: function () {
    const modal = document.getElementById("adminMediaPlayerModal");
    if (modal) {
      modal.classList.remove("active");
      const stageEl = document.getElementById("playerMediaStage");
      if (stageEl) stageEl.innerHTML = ""; // Stop audio/video playing
      if (typeof SoundFX !== "undefined") SoundFX.playClose();
    }
  },

  copyMediaUrl: function (mediaId) {
    const list = StorageService.getMedia ? StorageService.getMedia() : [];
    const item = list.find((m) => m.id === mediaId);
    if (!item) return;

    navigator.clipboard.writeText(item.url);
    if (typeof SoundFX !== "undefined") SoundFX.playChime(600);
    alert(`Media URL copied to clipboard:\n${item.url.slice(0, 80)}...`);
  },

  deleteMedia: function (mediaId) {
    const list = StorageService.getMedia ? StorageService.getMedia() : [];
    const item = list.find((m) => m.id === mediaId);
    if (!item) return;

    if (confirm(`Are you sure you want to delete "${item.title}" from the media library?`)) {
      if (StorageService.deleteMediaItem) {
        StorageService.deleteMediaItem(mediaId);
      }
      this.render();
      this.updateBadge();
      if (typeof SoundFX !== "undefined") SoundFX.playReset();
    }
  }
};

// Initialize when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AdminMedia.init());
} else {
  AdminMedia.init();
}
