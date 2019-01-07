<?php
    include_once("functions.php");
    $settings = getSettings();

    $activeDoW = array(
        in_array(0, $settings["general"]["active"]["days"]),
        in_array(1, $settings["general"]["active"]["days"]),
        in_array(2, $settings["general"]["active"]["days"]),
        in_array(3, $settings["general"]["active"]["days"]),
        in_array(4, $settings["general"]["active"]["days"]),
        in_array(5, $settings["general"]["active"]["days"]),
        in_array(6, $settings["general"]["active"]["days"])
    );

    printHeader("MyHome Settings");
?>

        <div id="settings">
            <form action="" method="POST">
            <h1>Settings</h1>
            <!-- General settings -->
            <div id="general">
                <h2>General</h2>
                <!-- Active settings -->
                <div id="active">
                    <h3>Active Times</h3>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Active Days of the Week</th>
                        </tr>
                        <tr>
                            <td>These checkboxes represent the days of the week MyHome will refresh its content. On any unchecked days, content will still load when the page is refreshed, but the auto-update timers will not run.</td>
                            <td>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_sun" <?=$activeDoW[0] ? "checked='checked'" : "" ?> /><br/>Sun</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_mon" <?=$activeDoW[1] ? "checked='checked'" : "" ?> /><br/>Mon</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_tue" <?=$activeDoW[2] ? "checked='checked'" : "" ?> /><br/>Tue</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_wed" <?=$activeDoW[3] ? "checked='checked'" : "" ?> /><br/>Wed</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_thu" <?=$activeDoW[4] ? "checked='checked'" : "" ?> /><br/>Thu</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_fri" <?=$activeDoW[5] ? "checked='checked'" : "" ?> /><br/>Fri</label>
                                <label class="activeDoW"><input type="checkbox" name="active_dow_sat" <?=$activeDoW[6] ? "checked='checked'" : "" ?> /><br/>Sat</label>
                            </td>
                        </tr>
                    </table>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Active Times of the Day</th>
                        </tr>
                        <tr>
                            <td>Here you can set the hours during the day you'd like MyHome to update its weather, stock, and task information. Outside of these hours, content will still load when the page is refreshed, but the auto-update timers will not run.</td>
                            <td>
                                <input type="time" value="<?=sprintf("%'02d", $settings["general"]["active"]["hours"][0]) ?>:00"step="3600" /> TO <input type="time" value="<?=sprintf("%'02d", $settings["general"]["active"]["hours"][1]) ?>:00" step="3600" />
                            </td>
                        </tr>
                    </table>
                </div>
                <!-- CSS settings -->
                <div id="css">
                    <h3>Appearance</h3>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Background</th>
                        </tr>
                        <tr>
                            <td>MyHome allows you to customize its appearence, including a different background color, or even an image. For images, you may upload your own, or use a previously uploaded one.</td>
                            <td>
                                <input type="color" name="css_background" value="<?=$settings["general"]["css"]["background"] ?>" onchange="updateColorInput(this)" />
                                <input type="text" name="css_background" value="<?=$settings["general"]["css"]["background"] ?>" />
                                <br />OR<br />
                                <input type="file" name="css_background_image" accept="image/*" />
                            </td>
                        </tr>
                    </table>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Text Color</th>
                        </tr>
                        <tr>
                            <td>If you find the text to be hard to read, you may change the color of the text for clearer reading.</td>
                            <td>
                                <input type="color" name="css_color" value="<?=$settings["general"]["css"]["color"] ?>" onchange="updateColorInput(this)" />
                                <input type="text" name="css_color" value="<?=$settings["general"]["css"]["color"] ?>" />
                            </td>
                        </tr>
                    </table>
                </div>
                <!-- Database settings -->
                <div id="database">
                    <h3>Database Values</h3>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Database Options</th>
                        </tr>
                        <tr>
                            <td colspan="2">MyHome uses a MySQL database to manage its task system. In order for that system to work, the following information must be correct. <span class="settings-note">These options should be during initialization.</span></td>
                        </tr>
                        <tr>
                            <td><strong>Database Name</strong></td>
                            <td>
                                <input type="text" name="db_name" value="<?=$settings["general"]["database"]["name"] ?>" />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Database User<strong/></td>
                            <td>
                                <input type="text" name="db_user" value="<?=$settings["general"]["database"]["user"] ?>" />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Database Password</strong></td>
                            <td>
                                <input type="password" name="db_pass" value="<?=$settings["general"]["database"]["password"] ?>" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- Task settings -->
            <div id="tasks">
                <h2>Tasks</h2>
                <div>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Refresh Rate</th>
                        </tr>
                        <tr>
                            <td>This is the amount of time, in minutes, that MyHome will wait before requesting an update on its task list</td>
                            <td>
                                <input type="number" name="task_rate" value="<?=$settings["tasks"]["refreshRate"] ?>" min="1" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- Weather settings -->
            <div id="weather">
                <h2>Weather</h2>
                <div>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Weather Options</th>
                        </tr>
                        <tr>
                            <td colspan="2">In order to provide its weather details, MyHome uses the <a href="https://openweathermap.org/" target="_blank">OpenWeatherMap</a> API to provide accurate information. Below are some settings to manage the use of this API.</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>API Key</strong><br/>
                                <span class="settings-note">This must be requested from <a href="https://openweathermap.org/appid" target="_blank">OpenWeatherMap.org</a>, and can be free to obtain.</span>
                            </td>
                            <td>
                                <input type="text" name="weather_api" value="<?=$settings["weather"]["api"] ?>" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>City ID</strong><br/>
                                <span class="settings-note">Again, must be found at <a href="https://openweathermap.org/current#cityid" target="_blank">OpenWeatherMap.org</a>. Follow the guide to find your city ID, then enter it here.</span>
                            </td>
                            <td>
                                <input type="text" name="weather_city" value="<?=$settings["weather"]["city"] ?>" />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Refresh Rate</strong></td>
                            <td>
                                <input type="number" name="weather_rate" value="<?=$settings["weather"]["refreshRate"] ?>" min="1" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- Stocks settings -->
            <div id="stocks">
                <h2>Stocks</h2>
                <div>
                    <table class="settings-table">
                        <tr>
                            <th colspan="2">Stock Options</th>
                        </tr>
                        <tr>
                            <td colspan="2">In order to provide its financial details, MyHome uses the <a href="https://worldtradingdata.com/register" target="_blank">WorldTradingData</a> API to provide accurate information. Below are some settings to manage the use of this API.</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>API Key</strong><br/>
                                <span class="settings-note">This must be requested from <a href="https://WorldTradingData.com/register" target="_blank">WorldTradingData.com</a>, and can be free to obtain.</span>
                            </td>
                            <td>
                                <input type="text" name="stocks_api" value="<?=$settings["stocks"]["api"] ?>" />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Refresh Rate</strong></td>
                            <td>
                                <input type="number" name="stocks_rate" value="<?=$settings["stocks"]["refreshRate"] ?>" min="1" />
                            </td>
                        </tr>
                    </table>
                    <p>
                        <label>
                                Watched Stocks
                                <?php
                                /*
                                    foreach ($settings["stocks"]["watching"] as $ticker) {
                                        echo <<<END_HTML
                                <span>$ticker</span><br>
END_HTML;
                                    }
                                */
                                ?>
                        </label>
                    </p>
                </div>
                <input type="submit" name="submit" value="Save" />
            </div>
        </form>
        </div>

<?php
    printFooter();
