<?php
    include_once("functions.php");
    $settings = getSettings();
    // echo "<pre>";
    // print_r($settings);
    // echo "</pre>";
?>

<html>
    <head>
        <title>MyHome Settings</title>
    </head>
    <body>
        <div id="settings">
            <h1>Settings</h1>
            <!-- General settings -->
            <div id="general">
                <h2>General</h2>
                <!-- Active settings -->
                <div id="active">
                    <h3>Active Times</h3>
                    <p>
                        <label>
                                Active Days of the Week
                                <input type="text">
                        </label>
                    </p>
                </div>
                <!-- CSS settings -->
                <div id="css">
                    <h3>Appearance</h3>
                    <p>
                        <label>
                                Background
                                <input type="text" name="css_background" value="<?=$settings["general"]["css"]["background"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Text Color
                                <input type="text" name="css_color" value="<?=$settings["general"]["css"]["color"] ?>" />
                        </label>
                    </p>
                </div>
                <!-- Database settings -->
                <div id="database">
                    <h3>Database Values</h3>
                    <p>
                        <label>
                                Database Name
                                <input type="text" name="db_name" value="<?=$settings["general"]["database"]["name"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Database User
                                <input type="text" name="db_user" value="<?=$settings["general"]["database"]["user"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Database Password
                                <input type="text" name="db_pass" value="<?=$settings["general"]["database"]["password"] ?>" />
                        </label>
                    </p>
                </div>
            </div>
            <!-- Task settings -->
            <div id="tasks">
                <h2>Tasks</h2>
                <div>
                    <p>
                        <label>
                                Refresh Rate
                                <input type="number" name="task_rate" value="<?=$settings["tasks"]["refreshRate"] ?>" />
                        </label>
                    </p>
                </div>
            </div>
            <!-- Weather settings -->
            <div id="weather">
                <h2>Weather</h2>
                <div>
                    <p>
                        <label>
                                API Key
                                <input type="text" name="weather_api" value="<?=$settings["weather"]["api"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                City ID
                                <input type="text" name="weather_city" value="<?=$settings["weather"]["city"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Refresh Rate
                                <input type="number" name="weather_rate" value="<?=$settings["weather"]["refreshRate"] ?>" />
                        </label>
                    </p>
                </div>
            </div>
            <!-- Stocks settings -->
            <div id="stocks">
                <h2>Stocks</h2>
                <div>
                    <p>
                        <label>
                                API Key
                                <input type="text" name="stocks_api" value="<?=$settings["stocks"]["api"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Watched Stocks
                                <input type="text" name="stocks_watch" value="<?=$settings["stocks"]["refreshRate"] ?>" />
                        </label>
                    </p>
                    <p>
                        <label>
                                Refresh Rate
                                <input type="number" name="stocks_rate" value="<?=$settings["stocks"]["refreshRate"] ?>" />
                        </label>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
