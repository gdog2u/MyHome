<?php
    function getSettings(){
        $file = "../JS/settings.json";
        if(!file_exists($file)){
            $file = "../JS/settings.default";
        }

        $settings = file_get_contents($file);
        $settingsJSON = json_decode($settings, true);

        if($settingsJSON == false){
            trigger_error("Could not convert \$settings to JSON");
            trigger_error(print_r($settingsJSON, true));
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
