<?php

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        header('Content-Type: application/json');
        /*
        TODO: remove test data
        */
        $response = array(
            "responseCode" => 200,
            "responseData" => "" //array( // Test data
                // "tasks" => array(
                //     array(
                //         "id" => 1,
                //         "parent" => -1,
                //         "task" => "Buy mushrooms"
                //     ),
                //     array(
                //     	"id" => 2,
                //         "parent" => -1,
                //         "task" => "Give David his gift"
                //     ),
                //     array(
                //         "id" => 3,
                //         "parent" => -1,
                //         "task" => "2019 IT Tasks"
                //     ),
                //     array(
                //         "id" => 4,
                //         "parent" => 3,
                //         "task" => "Ask about Better Health Club"
                //     ),
                //     array(
                //         "id" => 5,
                //         "parent" => 3,
                //         "task" => "Ask about associate tests"
                //     ),
                //     array(
                //         "id" => 7,
                //         "parent" => -1,
                //         "task" => "Buy mum a present"
                //     )
                // )
            // )
        );

        $func = $_POST["func"];

        /**
         * Get current Tasks
         * Ignores completed and deleted tasks
         */
        if($func == "getTasks"){

            $result = getDBTasks();
            if(is_string($result)){
                $response["responseCode"] = 101;
                $response["responseData"] = $result;
            }else{
                $response["responseData"] = array("tasks"=>$result);

                // include hash of tasks to compare in js
                $hashArray = hashArray($response["responseData"]);
                $response["responseData"]["hash"] = $hashArray;
            }

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

    function getDBTasks(){
        $return = array();
        $conn = new PDO("mysql:host=localhost;dbname=MyHome", "root", "Henri2u2");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        try{
            $result = $conn->query("
                SELECT DISTINCT Task.TaskID, Task.ParentID, Task.Task, Task.DueDate, Task.Completed
                FROM Tasks AS Task
                    LEFT JOIN Tasks AS Parent ON Parent.TaskID = Task.ParentID
                WHERE Task.Deleted = 0 AND (Task.Completed=0 AND IFNULL(Parent.Completed, 0) = 0)
                ORDER BY DueDate ASC;
            ");

            while($task = $result->fetch(PDO::FETCH_ASSOC)){
                array_push($return, $task);
            }
        }catch(PDOException $e){
            $result = $e->getMessage();
        }

        return $return;
    }
?>
