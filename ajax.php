<?php
    // ini_set()
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        header('Content-Type: application/json');
        /*
        TODO: remove test data
        */
        $response = array(
            "responseCode" => 200,
            "responseData" => ""
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
        elseif($func == "completeTask"){
            $result = markTaskAs($_POST["taskID"], 1);
            $response["responseCode"] = $result["code"];
            $response["responseData"] = $result["message"];

            echo json_encode($response);
        }
        elseif($func == "deleteTask"){
            $result = markTaskAs($_POST["taskID"], 2);
            $response["responseCode"] = $result["code"];
            $response["responseData"] = $result["message"];

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
                ORDER BY IFNULL(Task.DueDate, '2099-01-01 00:00:00') ASC
                LIMIT 8;
            ");

            while($task = $result->fetch(PDO::FETCH_ASSOC)){
                array_push($return, $task);
            }
        }catch(PDOException $e){
            $result = $e->getMessage();
        }

        return $return;
    }

    /**
     * Mark a task task either Completed or deleted
     * Also recursively marks a task's children as the same status
     */
    function markTaskAs($taskID, $markAs, $recursed=0){
        // Param checking
        if(preg_match("/^\d+/", $taskID) != 1 ){
            return array("code"=>-1,"message"=>"\$taskID must be an integer");
        }
        if(preg_match("/[12]/", $markAs) != 1){
            return array("code"=>-1,"message"=>"\$markAs must be 1 if completed or 2 if deleted");
        }

        // DB Connection
        $conn = new PDO("mysql:host=localhost;dbname=MyHome", "root", "Henri2u2");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Set the string for which field we're changing
        $field = "";
        if($markAs == 1){
            $field = "Completed";
        }else{
            $field = "Deleted";
        }

        try{
            // Prepare update statement
            $update = $conn->prepare("
                UPDATE tasks
                SET $field=1
                WHERE TaskID=:taskID
            ");
            $update->bindParam(":taskID", $taskID);

            $update->execute();

            // Find any tasks that have $taskID as their parent
            $findChildren = $conn->prepare("
                SELECT TaskID
                FROM Tasks
                WHERE ParentID=:parentID
            ");
            $findChildren->bindParam(":parentID", $taskID);

            $findChildren->execute();

            // Loop over children, marking them the same as the initial call
            while($task = $findChildren->fetch(PDO::FETCH_ASSOC)){
                markTaskAs($task["TaskID"], $markAs, 1);
            }
        }catch(PDOException $e){
            return array("code"=>-2, "message"=>$e->getMessage());
        }

        if(!$recursed){
            return array("code"=>1,"message"=>"success");
        }
    }
?>
