/*
 *  Curtains Controller
 *
 *  Unlike the heat controller, the curtain controller needs to be immediately responsive. When we press on the close/open curtain, the server must be notified immediately so that the curtain starts to move. Releasing the button sends another interaction to stop the curtain at a certain position
 */


var curtainscontroller = controllers['curtains'] =
{
    /*  This function is called when a command is received from the user interface component
     */
    handleCommand: function(hookID,action,value) {
        switch(action) {
            case "open":
                updateServer(hookID,{action:"open_curtains"});
                break;
            case "close":
                updateServer(hookID,{action:"close_curtains"});
                break;
            case "set":
                updateServer(hookID,{action:"set_curtains",value:value});
                break;
        }
    }
}