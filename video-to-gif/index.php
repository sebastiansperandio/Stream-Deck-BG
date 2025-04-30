<?php
$page_title = "Video to GIF AI";
//include_once("../includes/header.php");
?>

<div class="tool-box">
  <h1 class="tool-title">🎬 Video to GIF (AI-powered)</h1>
  <p class="tool-description">
    Upload a video file, and our AI will automatically detect the best moment and convert it into a high-quality GIF.
  </p>

  <form id="upload-form" action="upload.php" method="POST" enctype="multipart/form-data" class="tool-form">
    <div class="form-group">
      <label>
        <input type="checkbox" name="use_scene" value="1" checked>
        Use smart scene detection (AI-light)
      </label>
      <p class="field-hint">Recommended for dynamic videos. For short or static videos, try unchecking this option.</p>
    </div>

    <div class="form-group">
      <input type="file" name="video" id="video-input" accept="video/*" required class="input-file">
    </div>

    <div class="form-group">
      <button type="submit" class="button-main">Convert to GIF</button>
    </div>
  </form>

  <div id="status" class="tool-status"></div>
  <div id="preview" class="tool-preview"></div>
</div>

<script src="assets/script.js"></script>

<?php //include_once("../includes/footer.php"); ?>
