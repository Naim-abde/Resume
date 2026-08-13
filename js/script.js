var photoDataUrl = null;
var accentColor = "#b5512e";
var resumeLang = "en";
var idCounter = 0;
var jobs = [];
var educations = [];

var LANG = {
  en: {
    summary: "Professional Summary",
    work: "Work Experience",
    edu: "Education",
    skills: "Skills",
    projects: "Projects",
    languages: "Languages",
    certs: "Certifications"
  },
  fr: {
    summary: "Profil professionnel",
    work: "Exp\u00e9rience professionnelle",
    edu: "Formation",
    skills: "Comp\u00e9tences",
    projects: "Projets",
    languages: "Langues",
    certs: "Certifications"
  }
};

function tr(key) {
  return LANG[resumeLang][key];
}

function setResumeLang(lang) {
  resumeLang = lang;
  var map = {
    pvSecSummary: tr("summary"),
    pvSecJobs: tr("work"),
    pvSecEdu: tr("edu"),
    pvSecSkills: tr("skills"),
    pvSecProjects: tr("projects"),
    pvSecLanguages: tr("languages"),
    pvSecCerts: tr("certs")
  };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<span class="sec-marker"></span>' + map[id];
  });
}

function setupLangSwitch() {
  var segment = document.getElementById("langSegmented");
  if (!segment) return;
  segment.querySelectorAll(".seg-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      segment.querySelectorAll(".seg-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      setResumeLang(btn.getAttribute("data-lang"));
    });
  });
}

/* ---------------- helpers ---------------- */

function esc(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function nextId() {
  idCounter += 1;
  return idCounter;
}

function emptyJob() {
  return { id: nextId(), title: "", company: "", start: "", end: "", desc: "" };
}

function emptyEdu() {
  return { id: nextId(), degree: "", school: "", year: "" };
}

function jobHasContent(j) {
  return j.title.trim() || j.company.trim() || j.desc.trim();
}

function eduHasContent(e) {
  return e.degree.trim() || e.school.trim() || e.year.trim();
}

function hexToRgb(hex) {
  var h = hex.replace("#", "");
  if (h.length === 3) {
    h = h.split("").map(function (c) { return c + c; }).join("");
  }
  var int = parseInt(h, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
}

/* ---------------- accent color ---------------- */

function applyAccentColor(color) {
  var preview = document.getElementById("resumePreview");
  if (!preview) return;
  accentColor = color;
  preview.style.setProperty("--accent", color);
}

function setupAccentPicker() {
  var colorInput = document.getElementById("accentColor");
  var swatches = document.getElementById("swatches");
  if (!colorInput) return;

  function activateSwatch(hex) {
    var buttons = swatches ? swatches.querySelectorAll(".swatch") : [];
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-color").toLowerCase() === hex.toLowerCase());
    });
  }

  colorInput.addEventListener("input", function () {
    applyAccentColor(colorInput.value);
    activateSwatch(colorInput.value);
  });

  if (swatches) {
    swatches.querySelectorAll(".swatch").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var color = btn.getAttribute("data-color");
        colorInput.value = color;
        applyAccentColor(color);
        activateSwatch(color);
      });
    });
    activateSwatch(colorInput.value);
  }

  applyAccentColor(colorInput.value);
}

/* ---------------- dynamic entries (jobs / education) ---------------- */

function renderJobs() {
  var container = document.getElementById("jobsContainer");
  if (!container) return;
  container.innerHTML = "";

  if (jobs.length === 0) {
    var empty = document.createElement("p");
    empty.className = "section-hint";
    empty.textContent = "No jobs added yet.";
    container.appendChild(empty);
    return;
  }

  jobs.forEach(function (job, index) {
    var entry = document.createElement("div");
    entry.className = "entry";
    entry.innerHTML =
      '<div class="entry-head"><span class="entry-label">Job ' + (index + 1) + '</span>' +
      '<button type="button" class="entry-remove" data-action="remove" title="Remove">&#10005;</button></div>' +
      '<div class="field"><label>Job Title</label><input type="text" class="j-title" placeholder="Frontend Developer" /></div>' +
      '<div class="field"><label>Company</label><input type="text" class="j-company" placeholder="Acme Corp" /></div>' +
      '<div class="field-row">' +
      '<div class="field"><label>Start Date</label><input type="text" class="j-start" placeholder="Jan 2022" /></div>' +
      '<div class="field"><label>End Date</label><input type="text" class="j-end" placeholder="Present" /></div>' +
      '</div>' +
      '<div class="field"><label>Description</label><textarea rows="3" class="j-desc" placeholder="Key responsibilities and achievements..."></textarea></div>';

    entry.querySelector(".j-title").value = job.title;
    entry.querySelector(".j-company").value = job.company;
    entry.querySelector(".j-start").value = job.start;
    entry.querySelector(".j-end").value = job.end;
    entry.querySelector(".j-desc").value = job.desc;

    entry.querySelector(".j-title").addEventListener("input", function () { job.title = this.value; updatePreview(); });
    entry.querySelector(".j-company").addEventListener("input", function () { job.company = this.value; updatePreview(); });
    entry.querySelector(".j-start").addEventListener("input", function () { job.start = this.value; updatePreview(); });
    entry.querySelector(".j-end").addEventListener("input", function () { job.end = this.value; updatePreview(); });
    entry.querySelector(".j-desc").addEventListener("input", function () { job.desc = this.value; updatePreview(); });

    entry.querySelector("[data-action='remove']").addEventListener("click", function () {
      jobs.splice(index, 1);
      renderJobs();
      updatePreview();
    });

    container.appendChild(entry);
  });
}

function renderEducation() {
  var container = document.getElementById("eduContainer");
  if (!container) return;
  container.innerHTML = "";

  if (educations.length === 0) {
    var empty = document.createElement("p");
    empty.className = "section-hint";
    empty.textContent = "No education added yet.";
    container.appendChild(empty);
    return;
  }

  educations.forEach(function (edu, index) {
    var entry = document.createElement("div");
    entry.className = "entry";
    entry.innerHTML =
      '<div class="entry-head"><span class="entry-label">Education ' + (index + 1) + '</span>' +
      '<button type="button" class="entry-remove" data-action="remove" title="Remove">&#10005;</button></div>' +
      '<div class="field"><label>Degree</label><input type="text" class="e-degree" placeholder="BSc Computer Science" /></div>' +
      '<div class="field"><label>School / University</label><input type="text" class="e-school" placeholder="State University" /></div>' +
      '<div class="field"><label>Year</label><input type="text" class="e-year" placeholder="2018 - 2022" /></div>';

    entry.querySelector(".e-degree").value = edu.degree;
    entry.querySelector(".e-school").value = edu.school;
    entry.querySelector(".e-year").value = edu.year;

    entry.querySelector(".e-degree").addEventListener("input", function () { edu.degree = this.value; updatePreview(); });
    entry.querySelector(".e-school").addEventListener("input", function () { edu.school = this.value; updatePreview(); });
    entry.querySelector(".e-year").addEventListener("input", function () { edu.year = this.value; updatePreview(); });

    entry.querySelector("[data-action='remove']").addEventListener("click", function () {
      educations.splice(index, 1);
      renderEducation();
      updatePreview();
    });

    container.appendChild(entry);
  });
}

/* ---------------- tags (skills / languages) ---------------- */

function updateSkills() {
  updateTagsFromCommaField("skills", "pvSkills", "Skill");
}

function updateTagsFromCommaField(inputId, containerId, placeholderText) {
  var input = document.getElementById(inputId);
  var container = document.getElementById(containerId);
  if (!input || !container) return;
  container.innerHTML = "";
  var list = input.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  if (list.length === 0) {
    var span = document.createElement("span");
    span.textContent = placeholderText;
    container.appendChild(span);
    return;
  }
  list.forEach(function (item) {
    var span = document.createElement("span");
    span.textContent = item;
    container.appendChild(span);
  });
}

/* ---------------- preview ---------------- */

function renderPreviewJobs() {
  var container = document.getElementById("pvJobs");
  var section = document.getElementById("pvJobsSection");
  var list = jobs.filter(jobHasContent);
  if (!container || !section) return;

  if (list.length === 0) {
    section.style.display = "none";
    container.innerHTML = "";
    return;
  }
  section.style.display = "";
  container.innerHTML = list.map(function (j) {
    var dates = [j.start.trim(), j.end.trim()].filter(Boolean).join(" - ");
    return '<div class="resume-item">' +
      '<div class="resume-item-head"><h3>' + esc(j.title || "Job Title") + '</h3>' +
      (dates ? '<span class="resume-dates">' + esc(dates) + '</span>' : "") + '</div>' +
      (j.company.trim() ? '<p class="resume-company">' + esc(j.company) + '</p>' : "") +
      (j.desc.trim() ? '<p class="resume-desc">' + esc(j.desc) + '</p>' : "") +
      '</div>';
  }).join("");
}

function renderPreviewEducation() {
  var container = document.getElementById("pvEdu");
  var section = document.getElementById("pvEduSection");
  var list = educations.filter(eduHasContent);
  if (!container || !section) return;

  if (list.length === 0) {
    section.style.display = "none";
    container.innerHTML = "";
    return;
  }
  section.style.display = "";
  container.innerHTML = list.map(function (e) {
    return '<div class="resume-item">' +
      (e.degree.trim() ? '<h3>' + esc(e.degree) + '</h3>' : "") +
      (e.school.trim() ? '<p class="resume-company">' + esc(e.school) + '</p>' : "") +
      (e.year.trim() ? '<p class="resume-desc">' + esc(e.year) + '</p>' : "") +
      '</div>';
  }).join("");
}

function updatePreview() {
  var placeholders = {
    fullName: "Your Name",
    jobTitle: "Job Title",
    email: "email@example.com",
    phone: "phone number",
    address: "address",
    summary: "Your summary goes here...",
    proj1Title: "Project Name",
    proj1Link: "project link",
    proj1Desc: "Description...",
    cert1Name: "Certificate Name",
    cert1Year: "Year"
  };

  var pairs = {
    fullName: "pvName",
    email: "pvEmail",
    phone: "pvPhone",
    address: "pvAddress",
    summary: "pvSummary",
    proj1Title: "pvProjTitle",
    proj1Link: "pvProjLink",
    proj1Desc: "pvProjDesc",
    cert1Name: "pvCertName",
    cert1Year: "pvCertYear"
  };

  Object.keys(pairs).forEach(function (key) {
    var input = document.getElementById(key);
    var target = document.getElementById(pairs[key]);
    if (!input || !target) return;
    var val = input.value.trim();
    target.textContent = val || placeholders[key];
  });

  var jobTitleInput = document.getElementById("jobTitle");
  var pvJobTitle = document.getElementById("pvJobTitle");
  pvJobTitle.textContent = (jobTitleInput.value.trim()) || "Job Title";

  renderPreviewJobs();
  renderPreviewEducation();
  updateSkills();
  updateTagsFromCommaField("languages", "pvLanguages", "Language");
}

/* ---------------- photo ---------------- */

function handlePhoto() {
  var input = document.getElementById("photo");
  var img = document.getElementById("pvPhoto");
  if (!input || !img) return;
  input.addEventListener("change", function () {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      photoDataUrl = e.target.result;
      img.src = photoDataUrl;
      img.classList.remove("hidden");
      var btn = document.querySelector(".file-btn");
      if (btn) btn.innerHTML = "Photo selected — click to change";
    };
    reader.readAsDataURL(file);
  });
}

/* ---------------- PDF helpers ---------------- */

function makeCircularImage(dataUrl, size) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      var scale = Math.max(size / img.width, size / img.height);
      var w = img.width * scale;
      var h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = function () {
      reject(new Error("Could not read the photo. Please upload another image."));
    };
    img.src = dataUrl;
  });
}

function pdfText(doc, text, x, y, maxWidth) {
  var lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return lines.length;
}

function pdfLineHeight(fontSize) {
  return fontSize * 0.3528 * 1.15;
}

function pdfSection(doc, y, title, accent) {
  var pageWidth = doc.internal.pageSize.getWidth();
  var margin = 18;
  var pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - margin) {
    doc.addPage();
    y = margin + 5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(accent.r, accent.g, accent.b);
  doc.text(title.toUpperCase(), margin + 3, y);
  doc.setFillColor(accent.r, accent.g, accent.b);
  doc.rect(margin, y - 4.4, 1.6, 5.2, "F");
  doc.setDrawColor(227, 218, 201);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  return y + 9;
}

function pdfJobEntry(doc, y, job, margin, contentWidth, accent) {
  if (job.title.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(38, 33, 27);
    var headLines = pdfText(doc, job.title.trim(), margin + 3, y, contentWidth - 45);
    y += headLines * pdfLineHeight(12);
  }
  if (job.start.trim() || job.end.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(122, 112, 99);
    doc.text([job.start.trim(), job.end.trim()].filter(Boolean).join(" - "), 192, y, { align: "right" });
  }
  if (job.company.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(job.company.trim(), margin + 3, y);
  }
  y += 5;
  if (job.desc.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(74, 67, 58);
    var dLines = pdfText(doc, job.desc.trim(), margin + 3, y, contentWidth - 3);
    y += dLines * pdfLineHeight(11);
  }
  return y + 5;
}

function pdfEduEntry(doc, y, edu, margin, accent) {
  if (edu.degree.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(38, 33, 27);
    doc.text(edu.degree.trim(), margin + 3, y);
    y += 5.5;
  }
  if (edu.school.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(edu.school.trim(), margin + 3, y);
    y += 5.5;
  }
  if (edu.year.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(122, 112, 99);
    doc.text(edu.year.trim(), margin + 3, y);
    y += 5.5;
  }
  return y + 3;
}

/* ---------------- PDF generation ---------------- */

async function downloadPDF() {
  var status = document.getElementById("downloadStatus");
  var name = (document.getElementById("fullName").value.trim() || "resume")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  status.className = "status";
  status.textContent = "Generating your PDF...";
  status.classList.remove("hidden");

  setTimeout(async function () {
    try {
      var circularPhoto = null;
      if (photoDataUrl) {
        circularPhoto = await makeCircularImage(photoDataUrl, 400);
      }
    } catch (err) {
      status.className = "status error";
      status.textContent = err.message;
      return;
    }

    try {
      var doc = new jspdf.jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      var accent = hexToRgb(accentColor);
      var pageWidth = doc.internal.pageSize.getWidth();
      var margin = 18;
      var contentWidth = pageWidth - margin * 2;
      var y = margin + 6;

      // Accent bar at top
      doc.setFillColor(accent.r, accent.g, accent.b);
      doc.rect(0, 0, pageWidth, 5, "F");

      var photoSize = 30;
      var textWidth = contentWidth;
      if (circularPhoto) {
        textWidth = contentWidth - photoSize - 8;
      }

      // Name block (left)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(23);
      doc.setTextColor(38, 33, 27);
      var nameVal = document.getElementById("fullName").value.trim() || "Your Name";
      var nameLines = pdfText(doc, nameVal, margin, y + 3, textWidth);
      y += nameLines * pdfLineHeight(23);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(accent.r, accent.g, accent.b);
      var titleVal = document.getElementById("jobTitle").value.trim() || "Job Title";
      var titleLines = pdfText(doc, titleVal, margin, y, textWidth);
      y += titleLines * pdfLineHeight(13);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(122, 112, 99);
      var contact = [
        document.getElementById("email").value.trim(),
        document.getElementById("phone").value.trim(),
        document.getElementById("address").value.trim()
      ].filter(Boolean).join("  |  ");
      if (contact) {
        var contactLines = pdfText(doc, contact, margin, y + 2, textWidth);
        y += contactLines * pdfLineHeight(10) + 2;
      }

      // Round photo on the right, centered vertically in the header.
      // The divider line always keeps a comfortable bottom margin below the photo.
      var contentBottom = y + 6;
      var headerBottom = contentBottom;
      var photoBottomGap = 10;

      if (circularPhoto) {
        var headerTop = margin;
        var minPhotoY = margin + 4;

        // The photo must fit above the line with a gap; if there isn't room,
        // extend the header so the photo has enough space.
        var maxPhotoY = contentBottom - photoSize - photoBottomGap;
        if (maxPhotoY < minPhotoY) {
          headerBottom = minPhotoY + photoSize + photoBottomGap;
          maxPhotoY = minPhotoY;
        }

        var centeredY = headerTop + (contentBottom - headerTop - photoSize) / 2;
        var photoY = Math.max(minPhotoY, Math.min(centeredY, maxPhotoY));
        headerBottom = Math.max(contentBottom, photoY + photoSize + photoBottomGap);

        doc.addImage(circularPhoto, "JPEG", pageWidth - margin - photoSize, photoY, photoSize, photoSize);
      }

      // Header divider + bottom margin for the image area
      doc.setDrawColor(38, 33, 27);
      doc.setLineWidth(1);
      doc.line(margin, headerBottom, pageWidth - margin, headerBottom);
      y = headerBottom + 12;

      var summary = document.getElementById("summary").value.trim();
      if (summary) {
        y = pdfSection(doc, y, tr("summary"), accent);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(74, 67, 58);
        var sLines = pdfText(doc, summary, margin + 3, y, contentWidth - 3);
        y += sLines * pdfLineHeight(11) + 6;
      }

      var jobList = jobs.filter(jobHasContent);
      if (jobList.length) {
        y = pdfSection(doc, y, tr("work"), accent);
        jobList.forEach(function (j) {
          y = pdfJobEntry(doc, y, j, margin, contentWidth, accent);
        });
        y += 3;
      }

      var eduList = educations.filter(eduHasContent);
      if (eduList.length) {
        y = pdfSection(doc, y, tr("edu"), accent);
        eduList.forEach(function (e) {
          y = pdfEduEntry(doc, y, e, margin, accent);
        });
        y += 3;
      }

      var skills = document.getElementById("skills").value.split(",")
        .map(function (s) { return s.trim(); }).filter(Boolean);
      if (skills.length) {
        y = pdfSection(doc, y, tr("skills"), accent);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(74, 67, 58);
        var skillLines = pdfText(doc, skills.join("  •  "), margin + 3, y, contentWidth - 3);
        y += skillLines * pdfLineHeight(11) + 4;
      }

      var projTitle = document.getElementById("proj1Title").value.trim();
      var projLink = document.getElementById("proj1Link").value.trim();
      var projDesc = document.getElementById("proj1Desc").value.trim();
      if (projTitle || projLink || projDesc) {
        y = pdfSection(doc, y, tr("projects"), accent);
        if (projTitle) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(38, 33, 27);
          doc.text(projTitle, margin + 3, y);
          y += 5.5;
        }
        if (projLink) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(accent.r, accent.g, accent.b);
          doc.text(projLink, margin + 3, y);
          y += 5;
        }
        if (projDesc) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(74, 67, 58);
          var projLines = pdfText(doc, projDesc, margin + 3, y, contentWidth - 3);
          y += projLines * pdfLineHeight(11);
        }
        y += 6;
      }

      var languages = document.getElementById("languages").value.split(",")
        .map(function (s) { return s.trim(); }).filter(Boolean);
      if (languages.length) {
        y = pdfSection(doc, y, tr("languages"), accent);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(74, 67, 58);
        var langLines = pdfText(doc, languages.join("  •  "), margin + 3, y, contentWidth - 3);
        y += langLines * pdfLineHeight(11) + 4;
      }

      var certName = document.getElementById("cert1Name").value.trim();
      var certYear = document.getElementById("cert1Year").value.trim();
      if (certName || certYear) {
        y = pdfSection(doc, y, tr("certs"), accent);
        if (certName) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(38, 33, 27);
          var certHeadW = certYear ? contentWidth - 25 : contentWidth - 3;
          var certHeadLines = pdfText(doc, certName, margin + 3, y, certHeadW);
          y += certHeadLines * pdfLineHeight(12);
        }
        if (certYear) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(122, 112, 99);
          doc.text(certYear, pageWidth - margin, y, { align: "right" });
        }
        y += 4;
      }

      doc.save(name + ".pdf");
      status.className = "status success";
      status.textContent = "PDF downloaded successfully!";
    } catch (err) {
      status.className = "status error";
      status.textContent = "Something went wrong: " + err.message;
    }
  }, 100);
}

/* ---------------- init ---------------- */

document.addEventListener("DOMContentLoaded", function () {
  jobs.push(emptyJob());
  educations.push(emptyEdu());

  var formFields = [
    "fullName", "jobTitle", "email", "phone", "address", "summary",
    "skills", "proj1Title", "proj1Link", "proj1Desc", "languages",
    "cert1Name", "cert1Year"
  ];

  formFields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", updatePreview);
  });

  handlePhoto();
  setupAccentPicker();
  setupLangSwitch();
  setResumeLang("en");
  renderJobs();
  renderEducation();

  var addJobBtn = document.getElementById("addJobBtn");
  if (addJobBtn) addJobBtn.addEventListener("click", function () {
    jobs.push(emptyJob());
    renderJobs();
    updatePreview();
  });

  var addEduBtn = document.getElementById("addEduBtn");
  if (addEduBtn) addEduBtn.addEventListener("click", function () {
    educations.push(emptyEdu());
    renderEducation();
    updatePreview();
  });

  var downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadPDF);

  updatePreview();
});

