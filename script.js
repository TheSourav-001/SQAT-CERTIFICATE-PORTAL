(function () {
  "use strict";

  const form = document.querySelector("#certificate-form");
  const input = document.querySelector("#name-input");
  const result = document.querySelector("#result");
  const downloadCount = document.querySelector("#download-count");
  const certificateIndex = window.certificateIndex || [];
  const downloadStorageKey = "sqat-certificate-downloads";

  function getDownloadCount() {
    const storedCount = Number.parseInt(window.localStorage.getItem(downloadStorageKey), 10);
    return Number.isFinite(storedCount) && storedCount >= 0 ? storedCount : 0;
  }

  function updateDownloadCount() {
    downloadCount.textContent = getDownloadCount().toLocaleString();
  }

  function recordDownload() {
    const nextCount = getDownloadCount() + 1;
    window.localStorage.setItem(downloadStorageKey, String(nextCount));
    downloadCount.textContent = nextCount.toLocaleString();
  }

  function normalizeName(value) {
    return value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[._-]+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getCertificateId(certificate) {
    const certificateIndexPosition = certificateIndex.indexOf(certificate);
    const sequenceNumber = certificateIndexPosition >= 0 ? certificateIndexPosition + 1 : 0;
    return `SQAT-2026-${String(sequenceNumber).padStart(3, "0")}`;
  }

  function getVerificationUrl(certificateId) {
    const publicPortalUrl = "https://sqat-certificate-portal.vercel.app/";
    return `${publicPortalUrl}verification.html?certificate=${encodeURIComponent(certificateId)}`;
  }

  function renderQrCode(certificateId) {
    const qrTarget = document.querySelector("#certificate-qr");
    if (!qrTarget || !window.QRCode) {
      return;
    }
    new window.QRCode(qrTarget, {
      text: getVerificationUrl(certificateId),
      width: 112,
      height: 112,
      colorDark: "#0c1d36",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });
  }

  function showMessage(type, title, message) {
    const icon = type === "success" ? "&#10003;" : type === "ambiguous" ? "!" : "&#10005;";
    result.innerHTML = `
      <div class="result-card ${type === "success" ? "" : type}" role="status">
        <div class="result-heading"><span class="result-icon">${icon}</span><h3>${title}</h3></div>
        <p>${message}</p>
      </div>`;
  }

  function renderMobilePreview(file) {
    const canvas = document.querySelector("#mobile-preview-canvas");
    const loading = document.querySelector("#preview-loading");
    if (!canvas || !loading || !window.pdfjsLib) {
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    loading.textContent = "Loading certificate preview...";
    window.pdfjsLib.getDocument(file).promise
      .then(function (pdf) {
        return pdf.getPage(1);
      })
      .then(function (page) {
        const containerWidth = canvas.parentElement.clientWidth;
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: containerWidth / baseViewport.width });
        const outputScale = window.devicePixelRatio || 1;
        const context = canvas.getContext("2d");
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        return page.render({
          canvasContext: context,
          viewport: viewport,
          transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null
        }).promise;
      })
      .then(function () {
        loading.hidden = true;
      })
      .catch(function () {
        loading.textContent = "Preview unavailable. Open the certificate to view it.";
      });
  }

  function showCertificate(certificate) {
    const certificateId = getCertificateId(certificate);
    result.innerHTML = `
      <div class="result-card" role="status">
        <div class="result-heading"><span class="result-icon">&#10003;</span><h3>Certificate found</h3></div>
        <p>Your official participation certificate is ready.</p>
        <div class="certificate-preview">
          <iframe src="${certificate.file}#toolbar=0&navpanes=0&scrollbar=0" title="Preview of ${certificate.name}'s certificate"></iframe>
          <div class="mobile-certificate-preview" aria-label="Certificate preview">
            <div class="mobile-preview-stage">
              <canvas id="mobile-preview-canvas" aria-label="First page of certificate preview"></canvas>
              <span id="preview-loading">Loading certificate preview...</span>
            </div>
          </div>
        </div>
        <dl class="result-details">
          <div><dt>Participant name</dt><dd>${certificate.name}</dd></div>
          <div><dt>Programme</dt><dd>AI Augmented Software Testing</dd></div>
        </dl>
        <div class="verification-panel">
          <div class="verification-copy">
            <span class="verification-label">Digital verification</span>
            <strong>Scan to verify this certificate</strong>
            <span>Certificate ID: ${certificateId}</span>
          </div>
          <div id="certificate-qr" class="certificate-qr" aria-label="QR code for certificate verification"></div>
        </div>
        <div class="result-actions">
          <a class="action-button primary" href="${certificate.file}" target="_blank" rel="noopener">View certificate</a>
          <a class="action-button secondary" href="${certificate.file}" download>Download certificate</a>
        </div>
      </div>`;
    renderMobilePreview(certificate.file);
    renderQrCode(certificateId);
  }

  function showCertificateFromUrl() {
    const certificateId = new URLSearchParams(window.location.search).get("certificate");
    if (!certificateId) {
      return;
    }
    const certificate = certificateIndex.find(function (entry) {
      return getCertificateId(entry).toLowerCase() === certificateId.toLowerCase();
    });
    if (certificate) {
      input.value = certificate.name;
      showCertificate(certificate);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      showMessage("error", "Certificate not found", "This verification link does not match an official certificate.");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const normalizedInput = normalizeName(input.value);
    result.innerHTML = "";
    if (!normalizedInput) {
      showMessage("error", "Enter a participant name", "Please enter the full name printed on your certificate.");
      input.focus();
      return;
    }

    showMessage("ambiguous", "Searching for your certificate...", "Checking the official participant list.");
    window.setTimeout(function () {
      const matches = certificateIndex.filter(function (certificate) {
        return certificate.normalizedName === normalizedInput;
      });
      if (matches.length >= 1) {
        showCertificate(matches[0]);
      } else {
        showMessage("error", "Certificate not found", "We couldn't find a certificate matching the name you entered. Please check the spelling and try again.");
      }
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 220);
  });

  result.addEventListener("click", function (event) {
    const downloadLink = event.target.closest("a[download]");
    if (downloadLink) {
      recordDownload();
    }
  });

  updateDownloadCount();
  showCertificateFromUrl();
})();