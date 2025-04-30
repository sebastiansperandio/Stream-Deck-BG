document.getElementById('upload-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const status = document.getElementById('status');
  const preview = document.getElementById('preview');

  status.innerHTML = '⏳ Processing...';
  preview.innerHTML = '';

  fetch('upload.php', {
    method: 'POST',
    body: data
  })
  .then(response => response.text())
  .then(html => {
    status.innerHTML = '';
    preview.innerHTML = html;
  })
  .catch(() => {
    status.innerHTML = '<p class="error-message">❌ Failed to upload or process.</p>';
  });
});
