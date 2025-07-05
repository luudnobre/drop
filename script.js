const dropzone = document.getElementById("dropzone");
const previewContainer = document.getElementById("previewContainer");

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const files = Array.from(e.dataTransfer.files).slice(0, 20);

  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const container = document.createElement("div");
        container.appendChild(canvas);

        const download = document.createElement("button");
        download.textContent = "📥 Baixar";
        download.classList.add("download-button");
        download.onclick = () => {
          const link = document.createElement("a");
          link.download = "sticker.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        };

        container.appendChild(download);
        previewContainer.appendChild(container);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
});
