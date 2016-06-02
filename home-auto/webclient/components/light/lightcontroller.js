/*
 *  Light Controller
 *
 *  Each flick of the light switch will send a server request to turn the light on or off.
 */


var lightcontroller = controllers['light'] =
{
    /*  This function is called when a command is received from the user interface component
     */
    handleCommand: function(hookID,action,value) {
        updateServer(hookID,{turn_light:value});
    }
}