<?php
$query = isset($_GET['url']) ? $_GET['url'] : '';

function isValidUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

//Get site title
function getPageTitle($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
    $html = curl_exec($ch);
    curl_close($ch);

    preg_match('/<title>(.*?)<\/title>/i', $html, $matches);
    return isset($matches[1]) ? $matches[1] : 'Proxy Frame';
}

if (isValidUrl($query)) {
    $pageTitle = getPageTitle($query);
    $iframeUrl = urlencode($query);
} else {
    $pageTitle = htmlspecialchars($query, ENT_QUOTES, 'UTF-8');
    $iframeUrl = urlencode("https://start.duckduckgo.com/?q=" . $query);
}

$faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" . parse_url($query, PHP_URL_HOST);

if (!isValidUrl($query)) {
    $faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com";
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <link rel="icon" type="image/png" href="<?php echo $faviconUrl; ?>">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="https://yixboost.dev/static/?sm=<?php echo $iframeUrl; ?>"></iframe>
</body>
</html>
