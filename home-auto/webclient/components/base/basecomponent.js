/*
 *  Components Initializer
 *
 *  This file contains several common function for handling components.
 */



var controllers = {};   //  dictionary of all controllers (controllers decide how to interpret commands and send requests to the server)
var components = {};    //  dictionary of all components (user interface components receive input from the user and send commands)
var hooks = {};         //  mapping from pageID (user interface) to hookID (server IDs)
var reverseHooks = {};  //  reverse mapping for hooks
var updateServerFunction = null;    //  function to be called when sending an update to the server


/*  CONTROLLER_TEMPLATE
 *  When implementing a new controller, the following interface must be followed
 */
var controller_template = {
    
    /*  This function is called when a command is received from the user interface component
     */
    handleCommand: function(hookID,action,value) {
    
    }
};

/*  COMPONENT_TEMPLATE
 *  When implementing a new component, the following interface must be followed
 */
var component_template = {
    
    /*  Initializes the component with a pageID and the configuration object
     */
    initialize:function(pageID,configPage) {
    },
    
    /*  Called to let the component modify the $content and display ui elements. This is called during the creation of the component
     */
    updateContent:function($content,pageID) {
    },
    
    /*  This function is called after the component was rendered by JQuery mobile
     */
    onPageRendered : function(pageID) {
    },
    
    /*  Update the display of the UI component when the server has returned its status
     */
    onStatus : function(status, pageID) {
        
    },

    /* the URL to the icon shown in the navigation bar for this component
     */
    icon:""
};



/*  navbarHandler
 *  code adapted from: http://www.gajotres.net/jquery-mobile-and-how-to-enhance-the-markup-of-dynamically-added-content/
 *  This adds an icon in the navigation bar. This function works after the page was rendered
 */
var navbarHandler = {
  addNewNavBarElement:function(pageID, type, title) {
    var navbars = $(".ui-navbar");
    for(var i=0;i<navbars.length;i++) {
        var $navbar = navbars.eq(i);
        var $li = $("<li>");
        var $a  = $('<a>',{
                   'id':"nav_"+pageID,
                   'href':'#'+pageID,
                   'data-prefetch':true,
                   'data-transition':"fade",
                   'data-icon':"custom"
                   })
        .addClass('ui-link ui-btn ui-icon-custom ui-btn-icon-top')
        .addClass('ui-'+type+'-icon')
        .text(title);
        $li.append($a);
        
        $navbar.navbar("destroy");
        $li.appendTo($navbar.children('ul'));
        $navbar.navbar();
    }
  }
}


var pageCount = 1;

/*
 *  addPage produces a jquery mobile page based on the config parameters passed, defines all the interaction and adds an icon for the navigation bar of each footer
 */

function addPage(configPage) {
    
    //  create the page
    var pageID = configPage.type + pageCount++;
    
    if(components[configPage.type]) {
        components[configPage.type].initialize(pageID,configPage);
    }
    
    var $page = $('<div>',{
        'data-role':'page',
        'type':configPage.type,
        id:pageID,
    })
    .appendTo('body');
    
    //  add the header
    var $header = $('<div>',{
       'data-role':'header',
       'data-id':'header',
       'data-theme':'a',
       'data-position':'fixed'
    })
    .append($('<h1>')
        .text(configPage.title)
    )
    .appendTo($page);
    
    //  fill the content
    var $content = $('<div>',{
        'role':'main'
    })
    .addClass('ui-content')
    .appendTo($page);
    
    if(components[configPage.type])
        components[configPage.type].updateContent($content,pageID);
    
    //  get all the pages
    var $pages = $("div[data-role='page']");
    
    //  make a navbar with icons
    var $ul = $('<ul>');
    for(var i=0;i<$pages.length;i++) {
        var $p = $pages.eq(i);
        var id = $p.attr('id');
        var type = $p.attr('type');
        var title = $p.find('h1').text();
        
        var $a  = $('<a>',{
                    'id':"nav_"+id,
                    'href':id?"#"+id:"#",
                    'data-prefetch':true,
                    'data-transition':"fade",
                    'data-icon':id?"custom":"home"
                    })
        .addClass('ui-link ui-btn ui-icon-custom ui-btn-icon-top')
        .addClass('ui-'+type+'-icon')
        .text(title);
        
        $ul.append($('<li>').append($a));
    }
    
    
    //  add the footer
    var $footer = $('<div>',{
                   'data-role':'footer',
                   'data-theme':'a',
                   'data-position':'fixed',
                   'data-tap-toggle':'false',
                   'data-id':'footer'
                   })
    .append($('<div>',{
              'data-role':'navbar',
              'id':'navbar'
              })
            .append($ul)
            )
    .appendTo($page);
    
    //  insert icon into all footer, including the one we just created
    navbarHandler.addNewNavBarElement(pageID,configPage.type,configPage.title);
    
    $page.page();
    $("div#"+pageID).find("a[href='#"+pageID+"']").addClass("ui-btn-active ui-state-persist");
    
    if(components[configPage.type])
        components[configPage.type].onPageRendered(pageID);
    
    hooks[configPage.hook] = pageID;
    reverseHooks[pageID] = configPage.hook;
    
    return $page;
}

/*  Called by a component to notify that a UI command has been sent
 */
function sendCommand(type,pageID,action,value) {
    if(controllers[type]) {
        var hookID = reverseHooks[pageID];
        controllers[type].handleCommand(hookID,action,value);
    }
}

/*  Called by a controller to send an update request to the server
 */
function updateServer(hookID,object) {
    object.hook = hookID;
    updateServerFunction(object);
}

/*  Show an error message showing that a network error has occured
 */
function networkError() {
    showError("Error: failed to communicate with the server");
}

/*  Ensure that the components and controllers are created, and that they follow the proper interface defined in the templates
 */
function verifyComponent(type) {
    if(!controllers[type]) {
        showError("Error 1001: missing controller for "+type,10000);
        return;
    }
    if(!components[type]) {
        showError("Error 1002: missing component for "+type,10000);
    }
    
    var controller = controllers[type];
    for(var property in controller_template) {
        if(!controller[property]) {
            showError("Error 1003: controller for "+type+" is missing a definition for "+property,10000);
            return false;
        }
    }

    var component = components[type];
    for(var property in component_template) {
        if(!component[property]) {
            showError("Error 1004: component for "+type+" is missing a definition for "+property,10000);
            return false;
        }
    }
    return true;
}

/*  Shows an red label with an error message. If the interface is not ready for displaying the label, the error message can still be found in the debugger's log
 */
var error_timeout;
function showError(error_message,delay) {
    console.log("!! "+error_message);
    if(!delay)
        delay = 4000;
    clearTimeout(error_timeout);
    if(!$("div#error_div").length) {
        var errorDiv = "<div id='error_div' style='width:100%; background-color:red; color:white; text-shadow:0 0 0;'></div>";

        var $pages = $("div[class='ui-content']");
        $pages.prepend(errorDiv);
    }
    else {
        $("div#error_div").show(100);
    }
    $("div#error_div").text(error_message);
    var error_timeout = setTimeout(
        function() {
            clearTimeout(error_timeout);
            $("div#error_div").hide(100);
        }
    ,delay);
}
