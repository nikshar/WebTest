/*
 *  Curtains Component
 *
 */


var curtainscomponent = components['curtains'] =
{
    curtainInterval:0,
    
    /*  Initializes the component with a pageID and the configuration object
     */
    initialize:function(pageID,configPage) {
    },
    
    /*  The curtain value (in the UI) is between 1 and 100. It's the same value as the JQuery slider
     */
    getCurtainValue:function(pageID) {
        return parseInt($("#"+pageID+"-slider").val());
    },
    
    setCurtainValue:function(value,pageID) {
        $("#"+pageID+"-slider").val(parseInt(value));
    },
    
    /*  Called to let the component modify the $content and display ui elements. This is called during the creation of the component
     */
    updateContent:function($content,pageID) {
        $content
        .append($("<br>"));
        
        //  produces a slider, with icons on the left and right showing a closed curtain and an opened curtain
        $p = $("<p>")
        .append($("<table>")
            .append($("<tr>")
                .append($("<td>")
                    .append($("<img>",{
                        'src':"components/curtains/asset/closed-curtain-icon.png",
                        'width':32,
                        'height':32,
                        'alt':"Closed curtains"
                        })
                    )
                )
                .append($("<td>",{'width':"100%"})
                    .append($("<div>",{'data-role':"fieldcontains"})
                        .append($("<input>",{
                               'type':"range",
                               'id':pageID+"-slider",
                               'value':60,
                               'min':0,
                               'max':100,
                               'data-highlight':true
                            })
                            .addClass("ui-hidden-accessible")
                        )
                    )
                )
                .append($("<td>")
                    .append($("<img>",{
                        'src':"components/curtains/asset/opened-curtain-icon.png",
                        'width':32,
                        'height':32,
                        'alt':"Opened curtains"
                        })
                    )
                )
            )
        );
        
        //  produces two buttons, one for closing and one for opening the curtains
        $content
        .append($p)
        .append("<br>")
        .append("<br>")
        .append(
            $("<a>",{
                  id:pageID+"-close-curtains",
                  'data-role':"button",
                  'data-theme':"none",
                  'data-corners':false,
                  'data-shadow':false,
                  'data-inline':true,
                  'href':"#",
                  'rel':"external"
                  }).append(
                            $("<img>",{
                              'src':"components/curtains/asset/close-curtains.png",
                              'width':67,
                              'height':64,
                              'alt':"Close curtains"
                              })
                            )
                )
        .append(
                $("<a>",{
                  id:pageID+"-open-curtains",
                  'data-role':"button",
                  'data-theme':"none",
                  'data-corners':false,
                  'data-shadow':false,
                  'data-inline':true,
                  'href':"#",
                  'rel':"external"
                  }).append(
                            $("<img>",{
                              'src':"components/curtains/asset/open-curtains.png",
                              'width':67,
                              'height':64,
                              'alt':"Open curtains"
                              })
                            )
        );
    },
    
    /*  Setup the interaction of the UI elements
     */
    setupCurtains : function(pageID) {
        var self = this;
        $("#"+pageID+"-close-curtains").mousedown(function(e) {
            self.closeCurtains(pageID);
        });
        $("#"+pageID+"-open-curtains").mousedown(function(e) {
            self.openCurtains(pageID);
        });
        $("#"+pageID+"-close-curtains").mouseup(function(e) {
            self.setCurtain(self.getCurtainValue(pageID),pageID);
        });
        $("#"+pageID+"-open-curtains").mouseup(function(e) {
            self.setCurtain(self.getCurtainValue(pageID),pageID);
        });
        $("#"+pageID+"-slider").on('slidestop',function(e) {
            self.setCurtain(self.getCurtainValue(pageID),pageID);
        });
        self.updateCurtainDisplay(pageID);
    },

    /*  Refresh the slider to reflect the curtain's position
     */
    updateCurtainDisplay: function (pageID) {
        $("#"+pageID+"-slider").slider('refresh');
    },

    /*  Opens the curtain continuously until interrupted
     */
    openCurtains: function (pageID) {
        var self = this;
        clearInterval(this.curtainInterval);
        this.curtainInterval = setInterval(
            function(pageID) {
                self.setCurtainValue(Math.min(self.getCurtainValue(pageID)+1,100),pageID);
                self.updateCurtainDisplay(pageID);
            },30,pageID
        );
        sendCommand("curtains",pageID,"open");
    },
    
    /*  Closes the curtain continuously until interrupted
     */
    closeCurtains: function (pageID) {
        var self = this;
        clearInterval(this.curtainInterval);
        this.curtainInterval = setInterval(
            function(pageID) {
                self.setCurtainValue(Math.max(self.getCurtainValue(pageID)-1,0),pageID);
                self.updateCurtainDisplay(pageID);
            },30,pageID
        );
        sendCommand("curtains",pageID,"close");
    },
    
    /*  Set the position of the curtain at a value between 1 and 100
     */
    setCurtain: function (value,pageID) {
        clearInterval(this.curtainInterval);
        this.setCurtainValue(value,pageID);
        sendCommand("curtains",pageID,"set",value/100);
        this.updateCurtainDisplay(pageID);
    },
    
    /*  This function is called after the component was rendered by JQuery mobile
     */
    onPageRendered : function(pageID) {
        this.setupCurtains(pageID);
    },
    
    /*  Update the display of the UI component when the server has returned its status
     */
    onStatus : function(status,pageID) {
        if(status.status) {
            this.setCurtainValue(status.status*100,pageID);
            this.updateCurtainDisplay(pageID);
        }
    },
    
    /* the URL to the icon shown in the navigation bar for this component
     */
    icon:"components/curtains/asset/curtains-icon.jpg"
}