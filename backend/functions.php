<?php
    function printHeader($title){
        $title = $title ?? "MyHome Backend";

        echo <<<END_HTML
<html>
    <head>
        <title>MyHome Settings</title>
		<link href="/CSS/normalize.css" type="text/css" rel="stylesheet" />
		<link href="/CSS/global.css" type="text/css" rel="stylesheet" />
		<link href="/CSS/backend.css" type="text/css" rel="stylesheet" />
        <script src="\JS\jquery.min.js"></script>
        <script src="\JS\backend.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="navbar" class="float-center">
            <ul class="no-padding">
                <li><a href="/backend/tasks.php">Tasks</a></li>
                <li><a href="/backend/settings.php">Settings</a></li>
            </ul>
        </div>
        <div id="wrapper">
END_HTML;
    }

    function printFooter(){
        echo <<<END_HTML
        </div> <!-- wrapper -->
    </body>
</html>
END_HTML;
    }

    function getSettings(){
        $file = "../JS/settings.json";
        if(!file_exists($file)){
            $file = "../JS/settings.default";
        }

        $settings = file_get_contents($file);
        $settings = preg_replace("/\s/", "", $settings);
        $settingsJSON = json_decode($settings, true);

        if($settingsJSON == false){
            trigger_error("Could not convert \$settings to JSON");
            trigger_error(print_r($settings, true));
            return false;
        }

        return $settingsJSON;
    }

    function writeSettings($settings){
        if(!is_array($settings)){
            trigger_error("\$settings must be an array, not: ".gettype($settings));
            return false;
        }

        $settingsJSON = json_encode($settings);

        if($settingsJSON == false){
            trigger_error("Could not convert \$settings to JSON");
            trigger_error(print_r($settings, true));
            return false;
        }

        $fh = fopen("/JS/settings.json", "w");
        fwrite($fh, $settingsJSON);
        fclose($fh);

        return true;
    }
?>
