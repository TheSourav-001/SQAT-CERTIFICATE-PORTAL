(function () {
  "use strict";

  const result = document.querySelector("#verification-result");
  const certificateIndex = window.certificateIndex || [];

  function getCertificateId(certificate) {
    const index = certificateIndex.indexOf(certificate);
    return `SQAT-2026-${String(index + 1).padStart(3, "0")}`;
  }

  function renderInvalidState() {
    result.classList.add("verification-error");
    result.innerHTML = `
      <div class="verified-heading"><span class="verified-mark">&#10005;</span><h1>Certificate not found</h1></div>
      <p>This verification link does not match an official SQAT certificate.</p>
      <div class="verification-actions"><a href="index.html#find">Search certificate</a></div>`;
  }

  const certificateId = new URLSearchParams(window.location.search).get("certificate");
  const certificate = certificateIndex.find(function (entry) {
    return getCertificateId(entry).toLowerCase() === String(certificateId).toLowerCase();
  });

  if (!certificate) {
    renderInvalidState();
    return;
  }

  result.innerHTML = `
    <div class="verified-heading"><span class="verified-mark">&#10003;</span><h1>Certificate verified</h1></div>
    <p>This is an official participation certificate issued by SQAT.</p>
    <dl class="verified-details">
      <div><dt>Participant name</dt><dd>${certificate.name}</dd></div>
      <div><dt>Programme</dt><dd>AI Augmented Software Testing</dd></div>
      <div><dt>Certificate ID</dt><dd>${getCertificateId(certificate)}</dd></div>
      <div><dt>Issued by</dt><dd>Software Quality Assurance &amp; Testing Club, DIU</dd></div>
    </dl>
    <div class="verification-actions">
      <a href="${certificate.file}" target="_blank" rel="noopener">View certificate</a>
      <a class="secondary" href="index.html#find">Back to portal</a>
    </div>`;
})();
