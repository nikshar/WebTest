/*
 *  Remote Control Object
 *
 *  This class handles server communication, configuration of the remote and high level styling of the page
 *
 */





var remote = {
    
    /*  This URL will get set through config.json. The serverURL is used to send status.json and update.json calls
     */
    serverURL:null,
    
    /*  Initializes the remote once the document is loaded
     */
    initialize:function() {
        this.initialized = true;
        this.addStyle();
        this.configure();
        updateServerFunction = this.updateServer
    },
    
    /*  Add a standard style for each content to center elements
     */
    addStyle:function() {
        var $style = $("<style>",{'id':"content-style"})
            .html(".ui-content { text-align: center; }");
        $("head").append($style);
    
    },
    
    /*  Configures the remote through the config.json file
     */
    configure:function() {
        $.ajax({
            dataType: "json",
            url:"config.json",
            success: this.onConfigure
        })
        .error(function() {
            showError("Error 1005: missing configuration file 'config.json'");
        });
    },
    
    /*  Returned once config.json is fetched
     */
    onConfigure:function(data) {
        var $firstPage = null;
        var types = {};
        for(var i=0;i<data.controls.length;i++) {
            var config = data.controls[i];
            if(!verifyComponent(config.type))
                continue;
            $page = addPage(config);
            if(!$firstPage) {
                $firstPage = $page;
            }
            types[config.type] = true;
        }
        
        for(var type in components) {
            var component = components[type];
            remote.addIconStyle(type,component.icon);
        }
        remote.serverURL = data.url;
        remote.checkStatus();
        $.mobile.changePage( $firstPage, { transition: "slideup", changeHash: false });
    },
    
    /*  Call status.json to check the status of the components in the house (light/heat/curtains)
     */
    checkStatus:function() {
        console.log("GET",this.serverURL+"/status.json");
        $.get(this.serverURL + "/status.json",this.onStatus,"json")
        .error(networkError);
    },
    
    /*  If the status.json call was succesful, we update the visual components on the remote with the result
     */
    onStatus:function(data) {
        if(data.result!="success") {
            networkError();
        }
        else {
            for(var i in data.controls) {
                var status = data.controls[i];
                var pageID = hooks[status.id];
                components[status.type].onStatus(status,pageID);
            }
        }
    },
    
    /*  Make a update.json POST to control the light/heat or curtains
     */
    updateServer:function(object) {
        console.log("POST",remote.serverURL+"/update.json",object);
        $.post(remote.serverURL+"/update.json", remote.onUpdateSuccess,"json")
        .error(networkError);
    },

    /*  The callback ensures our server call was successful
     */
    onUpdateSuccess: function (data) {
        if(data.result!="success") {
            networkError();
        }
    },

    /*  Sets the images of the icon for each component
     */
    addIconStyle:function(type,icon) {
        var $style = $("<style>",{id:'style_'+type+'_icon'})
            .html(".ui-"+type+"-icon:after { background:  url("+icon+") 50% 50% no-repeat; background-size: 24px 22px; };");
        $("head").append($style);
    }
};


