/*
 *  Heat Controller
 *
 *  The heat controller could continuously receive commands to change the temperature, but it doesn't need to immediately request the server, because the change of temperature doesn't need to be immediate. Therefore, the controller lets the user decide on the temperature, wait for one second of idle time, and send the request to the server
 */


var heatcontroller = controllers['heat'] =
{
    timeouts:{},
    
    /*  This function is called when a command is received from the user interface component
     */
    handleCommand: function(hookID,action,value) {
        clearTimeout(this.timeouts[hookID]);
        this.timeouts[hookID] = setTimeout(
            function() {
                updateServer(hookID,{"setTemperature":value});
            },1000
        );
    }
}