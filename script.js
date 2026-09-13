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

  function showMessage(type, title, message) {
    const icon = type === "success" ? "&#10003;" : type === "ambiguous" ? "!" : "&#10005;";
    result.innerHTML = `
      <div class="result-card ${type === "success" ? "" : type}" role="status">
        <div class="result-heading"><span class="result-icon">${icon}</span><h3>${title}</h3></div>
        <p>${message}</p>
      </div>`;
  }

  function showCertificate(certificate) {
    result.innerHTML = `
      <div class="result-card" role="status">
        <div class="result-heading"><span class="result-icon">&#10003;</span><h3>Certificate found</h3></div>
        <p>Your official participation certificate is ready.</p>
        <div class="certificate-preview">
          <iframe src="${certificate.file}#toolbar=0&navpanes=0&scrollbar=0" title="Preview of ${certificate.name}'s certificate"></iframe>
        </div>
        <dl class="result-details">
          <div><dt>Participant name</dt><dd>${certificate.name}</dd></div>
          <div><dt>Programme</dt><dd>AI Augmented Software Testing</dd></div>
        </dl>
        <div class="result-actions">
          <a class="action-button primary" href="${certificate.file}" target="_blank" rel="noopener">View certificate</a>
          <a class="action-button secondary" href="${certificate.file}" download>Download certificate</a>
        </div>
      </div>`;
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
})();