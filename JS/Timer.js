class Timer{
    /** constructor
     * Parameters:
     *      functions: an array containing function references
     *      minutes: (optional) the number of minutes between intervals
     */
    constructor(functions, minutes = 1){
        this.functions = functions;
        this.MINUTE = 60*1000;
        this.minutes = minutes;
        this.running = false;

        if(!Array.isArray(this.functions) || this.functions.length == 0){
            throw new TypeError("First parameter must be an array with a size greater than 0");
        }
        if(typeof(this.minutes) !== "number" || this.minutes <= 0){
            throw new RangeError("Second parameter must be a float greater than 0");
        }

        this.interval = undefined;
    }

    /** start
     *  Start the timer.
     */
    start(){
        this.running = true;
        this.interval = setInterval(function (functions) {
            for(let i = 0; i < functions.length; i++){
                functions[i]();
            }
        }, this.MINUTE * this.minutes, this.functions);
    }

    /** stop
     * Stop the timer.
     */
    stop(){
        this.running = false;
        clearInterval(this.interval);
    }

    /** restart
     *  Restart the timer.
     */
    restart(){
        this.stop();
        this.start();
    }

    /** addFunction
     * Add a function refernce to the list of functions to be run. Restarts the timer.
     * Parameters:
     *      functionName: refernce to a defined function
     */
    addFunction(functionName){
        if(typeof(functionName) !== "function"){
            throw new TypeError(functionName+" is not a defined function.");
        }

        if(this.functions.includes(functionName)){
            throw new Error(functionName+" is already included in this timer.");
        }

        this.functions.push(functionName);

        this.restart();
    }

    /** removeFunction
     *  Removes a given function reference from the list of functions to be run. Restarts the timer.
     * Parameters:
     *      functionName: refernce to a defined function
     */
    removeFunction(functionName){
        if(typeof(functionName) !== "function"){
            throw new TypeError(functionName+" is not a defined function.");
        }

        if(!this.functions.includes(functionName)){
            throw new Error(functionName+" is not included in this timer.");
        }

        let position = this.functions.indexOf(functionName);
        this.functions.splice(position, 1);

        this.restart();
    }

    /** isRunning
     * Returns boolean dependant on whether or not the tiemr is running.
     */
    isRunning(){
        return this.running;
    }
}
