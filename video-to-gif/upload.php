<?php
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo "<p class='error-message'>❌ No video uploaded or error occurred.</p>";
    exit;
}

$inputVideo = $_FILES['video']['tmp_name'];
$basename = uniqid("gif_", true);
$outputGif = "outputs/{$basename}.gif";

// Ensure outputs directory exists
if (!file_exists("outputs")) {
    mkdir("outputs", 0777, true);
}

// Build FFmpeg command
/* $cmd = "ffmpeg -i {$inputVideo} -vf \
  "select='gt(scene,0.4)',scale=480:-1,fps=12" \
  -t 3 -y {$outputGif}"; */
$ffmpeg = '/home/sdbgdes/ffmpeg-git-20180203-amd64-static/ffmpeg';
$cmd = "$ffmpeg -i {$inputVideo} -vf \"select='gt(scene,0.4)',scale=480:-1,fps=12\" -t 3 -y {$outputGif}";
  
exec($cmd, $output, $return_var);

if ($return_var === 0 && file_exists($outputGif)) {
    echo "<h2>✅ GIF Created!</h2><img src='{$outputGif}' alt='Generated GIF' class='generated-gif'><br>";
    echo "<a href='{$outputGif}' download class='button-main'>Download GIF</a>";
} else {
    echo "<p class='error-message'>❌ Error generating GIF.</p>";
}
?>
