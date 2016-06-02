/*
 *  Light Component
 *
 */


var lightcomponent = components['light'] =
{
    /*  Initializes the component with a pageID and the configuration object
     */
    initialize:function(pageID,configPage) {
    
    },
    
    /*  Called to let the component modify the $content and display ui elements. This is called during the creation of the component
     */
    updateContent:function($content,pageID) {
        //  create two buttons that will alternate to show a switch being on or off
        $content
        .append(
            $("<a>",{
              id:pageID+"-switch-on",
              'data-role':"button",
              'data-theme':"none",
              'data-corners':false,
              'data-shadow':false,
              'data-inline':true,
              'href':"#",
              'rel':"external"
            }).append(
                $("<img>",{
                  'src':"components/light/asset/lightswitch.jpg",
                  'width':166,
                  'height':258,
                  'alt':"Switch light"
                })
            )
        )
        .append(
            $("<a>",{
              id:pageID+"-switch-off",
              'data-role':"button",
              'data-theme':"none",
              'data-corners':false,
              'data-shadow':false,
              'data-inline':true,
              'href':"#",
              'rel':"external"
              }).append(
                $("<img>",{
                  'src':"components/light/asset/lightswitchoff.jpg",
                  'width':166,
                  'height':258,
                  'alt':"Switch light"
                })
              )
        );
    },
    
    /*  Initialize interactions of the component
     */
    setupLightSwitch: function (pageID) {
        
        var onSwitcher = "#"+pageID+"-switch-on";
        var offSwitcher = "#"+pageID+"-switch-off";
        var self = this;
        $(onSwitcher).click(function (e) {
            self.turnLight(false,pageID);
        });
        $(offSwitcher).click(function (e) {
            self.turnLight(true,pageID);
        });
        this.turnLight(true,pageID,true);
    },
    
    /*  Performs the action of turning the light on/off
     */
    turnLight: function (value,pageID,dontSendCommand) {
        var onSwitcher = "#"+pageID+"-switch-on";
        var offSwitcher = "#"+pageID+"-switch-off";
        if(value) {
            $(offSwitcher).hide();
            $(onSwitcher).show();
        }
        else {
            $(onSwitcher).hide();
            $(offSwitcher).show();
        }
        if(!dontSendCommand)
            sendCommand("light",pageID,"turn",value);
    },
    
    /*  This function is called after the component was rendered by JQuery mobile
     */
    onPageRendered : function(pageID) {
        this.setupLightSwitch(pageID);
    },
    
    /*  Update the display of the UI component when the server has returned its status
     */
    onStatus : function(status,pageID) {
        if(status.status) {
            this.turnLight(status.status,pageID,true);
        }
    },
    
    /* the URL to the icon shown in the navigation bar for this component
     */
    icon : "components/light/asset/Light_bulb_icon.png"
    
}