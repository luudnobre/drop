const dropzone = document.getElementById("dropzone");
const input = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const exportPdf = document.getElementById("exportPdf");
const exportWord = document.getElementById("exportWord");

let images = [];

dropzone.addEventListener("click", () => input.click());

input.addEventListener("change", handleFiles);

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.style.background = "#eef";
});

dropzone.addEventListener("dragleave", () => {
  dropzone.style.background = "#fafafa";
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.style.background = "#fafafa";
  handleFiles({ target: { files: e.dataTransfer.files } });
});

function handleFiles(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewContainer.appendChild(img);
      images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

exportPdf.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = images[i];
    await new Promise(resolve => img.onload = resolve);

    const width = 190;
    const ratio = img.height / img.width;
    const height = width * ratio;

    if (i > 0) pdf.addPage();
    pdf.addImage(img, "PNG", 10, 10, width, height);
  }

  pdf.save("imagens.pdf");
});

exportWord.addEventListener("click", async () => {
  const doc = new window.docx.Document();
  const sections = [];

  for (const src of images) {
    const image = await fetch(src).then(res => res.blob());
    const buffer = await image.arrayBuffer();
    sections.push(new docx.Paragraph(""), new docx.ImageRun({
      data: buffer,
      transformation: { width: 400, height: 300 }
    }));
  }

  doc.addSection({ children: sections });

  const blob = await docx.Packer.toBlob(doc);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "imagens.docx";
  link.click();
});
