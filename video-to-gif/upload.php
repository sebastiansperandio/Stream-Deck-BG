<?php
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo "<p class='error-message'>❌ No video uploaded or an error occurred. Please try again.</p>";
    exit;
}

$use_scene_detection = isset($_POST['use_scene']) && $_POST['use_scene'] === '1';

$inputVideo = $_FILES['video']['tmp_name'];
$basename = uniqid("gif_", true);
$outputGif = "outputs/{$basename}.gif";

if (!file_exists("outputs")) {
    mkdir("outputs", 0777, true);
}

$ffmpeg = '/home/sdbgdes/ffmpeg-git-20180203-amd64-static/ffmpeg';

// Commands
$cmd1 = "$ffmpeg -i {$inputVideo} -vf \"select='gt(scene,0.4)',scale=480:-1,fps=12\" -t 3 -y {$outputGif}";
$cmd2 = "$ffmpeg -i {$inputVideo} -vf \"scale=480:-1,fps=12\" -t 3 -y {$outputGif}";

$output = [];
$return_var = 1;

if ($use_scene_detection) {
    exec($cmd1 . " 2>&1", $output1, $return1);
    if (!file_exists($outputGif) || filesize($outputGif) === 0) {
        exec($cmd2 . " 2>&1", $output2, $return2);
        $output = array_merge($output1, ["\nFallback without scene detection:"], $output2);
        $return_var = $return2;
    } else {
        $output = $output1;
        $return_var = $return1;
    }
} else {
    exec($cmd2 . " 2>&1", $output2, $return2);
    $output = $output2;
    $return_var = $return2;
}

if ($return_var === 0 && file_exists($outputGif) && filesize($outputGif) > 0) {
    echo "<h2>✅ GIF Created!</h2><img src='{$outputGif}' alt='Generated GIF' class='generated-gif'><br>";
    echo "<a href='{$outputGif}' download class='button-main'>Download GIF</a>";
} else {
    echo "<p class='error-message'>❌ Failed to generate the GIF.</p>";
    echo "<p class='error-message'>This might happen if the video is too short or has too little motion.</p>";
    echo "<p class='error-message'>Please try again with a longer or more dynamic video.</p>";
    echo "<pre><code>" . htmlspecialchars(implode("\n", $output)) . "</code></pre>";
}
?>
