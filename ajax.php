<?php
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        header('Content-Type: application/json');
        /*
        TODO: remove test data
        */
        $response = array(
            "responseCode" => 200,
            "responseData" => array( // Test data
                "tasks" => array(
                    array(
                        "id" => 1,
                        "parent" => -1,
                        "task" => "Buy mushrooms"
                    ),
                    array(
                    	"id" => 2,
                        "parent" => -1,
                        "task" => "Give David his gift"
                    ),
                    array(
                        "id" => 3,
                        "parent" => -1,
                        "task" => "2019 IT Tasks"
                    ),
                    array(
                        "id" => 4,
                        "parent" => 3,
                        "task" => "Ask about Better Health Club"
                    ),
                    array(
                        "id" => 5,
                        "parent" => 3,
                        "task" => "Ask about associate tests"
                    ),
                    array(
                        "id" => 7,
                        "parent" => -1,
                        "task" => "Buy mum a present"
                    )
                )
            )
        );

        $func = $_POST["func"];

        /**
         * Get current Tasks
         * Ignores completed and deleted tasks
         */
        if($func == "getTasks"){

            /*
            TODO: figure out mysql call
            */

            // include hash of tasks to compare in js
            $hashArray = hashArray($response["responseData"]);
            $response["responseData"]["hash"] = $hashArray;

            echo json_encode($response);
        }
        /**
         * Unknown function requested
         */
        else{
            $response["responseData"] = "Hello, World!";
            echo json_encode($response);
        }
    }

    function hashArray($array){
        $jsonString = json_encode($array);
        return md5($jsonString);
    }
?>
