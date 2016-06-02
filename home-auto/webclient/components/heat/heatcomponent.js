/*
 *  Heat Component
 *
 */


var heatcomponent = components['heat'] =
{
    /*  The heat component needs a data object to hold more information because it has to store the current temperature and the temperature to set
     */
    data:{},
    
    /*  Minimum and maximum temperature, and a variable to control setInterval
     */
    MINTEMPERATURE:30,
    MAXTEMPERATURE:120,
    temperatureInterval:0,
    
    /*  Initializes the component with a pageID and the configuration object
     */
    initialize:function(pageID,configPage) {
        this.data[pageID] = {};
        this.data[pageID].setTemperature = 70;
        this.data[pageID].currentTemperature = 70;
        this.data[pageID].unit = "farenheit";
        this.addHeatStyles();
    },
    
    /*  Setup the style and font for the ui elements
     */
    addHeatStyles : function() {
        var $style = $("<style>",{'id':"heat_style"})
        .html("@font-face { font-family: digital7; src:  url('components/heat/font/digital-7.ttf'); }\n"+
            ".digital { font-family: 'digital7'; }\n"+
            ".heat-btn { outline-width: 0px !important; border: none !important; }"
        );
        $("head").append($style);
    },
    
    /*  Called to let the component modify the $content and display ui elements. This is called during the creation of the component
     */
    updateContent:function($content,pageID) {
        //  create the background panel
        $content.append(
            $("<img>",{
              'src':"components/heat/asset/panel.jpg",
              'width':250,
              'height':261,
              'alt':"Panel"
            })
        );
        
        //  create a digital display showing the current temperature and the temperature to set
        var $digitalDisplay = $("<div>",{
              'style':"position: relative; margin-top:-225px; height:250px; left:0"
            }
        )
        .addClass('digital')
        .appendTo($content);
        
        $digitalDisplay
        .append($("<p>")
            .append($("<span>").text("temperature:"))
            .append($("<span>",{id:pageID+"-currentTemperatureLabel"}).text("70"))
            .append($("<br>"))
            .append($("<span>",{id:pageID+"-temperatureLabel",style:"font-size:4em;"}).text("70"))
        )
        
        //  produces two buttons to increase/decrease the temperature
        $digitalDisplay
        .append($("<br>"))
        .append($("<img>",{
            'id':pageID+"-up",
            'src':"components/heat/asset/heat-up.png",
            'width':32,
            'height':32,
            'alt':"Heat up"
        }))
        .append("&nbsp;&nbsp;&nbsp;")
        .append($("<img>",{
            id:pageID+"-down",
            src:"components/heat/asset/heat-down.png",
            'width':32,
            'height':32,
            'alt':"Heat down"
        }));
    },
    
    /*  This function is called after the component was rendered by JQuery mobile
     */
    onPageRendered : function(pageID) {
        this.setupHeatControl(pageID)
    },
    
    /*  Prepare the interactions of the ui elements
     */
    setupHeatControl : function(pageID) {
        var self = this;
        $("#"+pageID+"-up").mousedown(function (e) {
            self.increaseHeat(pageID);
        });
        $("#"+pageID+"-down").mousedown(function (e) {
            self.decreaseHeat(pageID);
        });
        $("#"+pageID+"-up").mouseup(function (e) {
            self.setTemperature(self.data[pageID].setTemperature,pageID);
        });
        $("#"+pageID+"-down").mouseup(function (e) {
            self.setTemperature(self.data[pageID].setTemperature,pageID);
        });
        this.updateTemperatureDisplay(pageID);
    },
    
    /*  The temperature increases by one
     */
    increaseHeatStep: function (pageID) {
        heatcomponent.data[pageID].setTemperature = Math.min(heatcomponent.data[pageID].setTemperature+1,heatcomponent.MAXTEMPERATURE);
        heatcomponent.autoSendCommand(pageID);
        heatcomponent.updateTemperatureDisplay(pageID);
    },
    
    /*  The temperature decreases by one
     */
    decreaseHeatStep: function (pageID) {
        heatcomponent.data[pageID].setTemperature = Math.max(heatcomponent.data[pageID].setTemperature-1,heatcomponent.MINTEMPERATURE);
        heatcomponent.autoSendCommand(pageID);
        heatcomponent.updateTemperatureDisplay(pageID);
    },
    
    /*  Increase the heat until interrupted
     */
    increaseHeat: function (pageID) {
        clearInterval(this.temperatureInterval);
        this.temperatureInterval = setInterval(this.increaseHeatStep,200,pageID);
        this.increaseHeatStep(pageID);
    },
    
    /*  Decrease the heat until interrupted
     */
    decreaseHeat: function (pageID) {
        clearInterval(this.temperatureInterval);
        this.temperatureInterval = setInterval(this.decreaseHeatStep,200,pageID);
        this.decreaseHeatStep(pageID);
    },
    
    /*  Set the temperature
     */
    setTemperature: function (value,pageID) {
        clearInterval(this.temperatureInterval);
        this.data[pageID].setTemperature = value;
        this.autoSendCommand(pageID);
        this.updateTemperatureDisplay(pageID);
    },
    
    /*  Sends a command to the controller to set the temperature
     */
    autoSendCommand: function(pageID) {
        sendCommand("heat",pageID,"setTemperature",this.data[pageID].setTemperature);
    },
    
    /*  Display the current temperature and the temperature to set
     */
    updateTemperatureDisplay: function (pageID) {
        $("#"+pageID+"-temperatureLabel").html(this.data[pageID].setTemperature+"&#176;");
        $("#"+pageID+"-currentTemperatureLabel").html(this.data[pageID].currentTemperature+"&#176;"+this.data[pageID].unit.charAt(0));
    },
    
    /*  Update the display of the UI component when the server has returned its status
     */
    onStatus : function(status,pageID) {
        if(status.temperature)
            this.data[pageID].currentTemperature = status.temperature;
        if(status.setTemperature)
            this.data[pageID].setTemperature = status.setTemperature;
        if(status.unit)
            this.data[pageID].unit = status.unit;
        this.updateTemperatureDisplay(pageID);
    },
    
    /* the URL to the icon shown in the navigation bar for this component
     */
    icon:"components/heat/asset/Farm-Fresh_temperature_5.png"
}