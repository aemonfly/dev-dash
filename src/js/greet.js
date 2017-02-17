/* jshint esversion:6 */
/* globals jQuery, document, console, LS */

// on load...
// 1. check local storage for existing user object ('dev-dash-user')
// 2. if exists,
//     a. set load repo based on 'active' flag
//     b. populate repo selection list
//     ... if not ...
//     a. drop down modal panel asking for user's name and GH username
//     b. on submit,
//        * fetch their 3 recently active repos
//        * build repos array and render repo-selector list
//        * save username and repo array to local storage
//        * close modal
//        * render tables and chart based on repo element[0]

var Greet = (function($) {
    
    // init vars
    var defaultNames = [
            'pal',
            'sexy',
            'cool guy',
            'dork',
            'classy'
        ],
        userName,
        
        // placeholder for cached DOM elements
        DOM = {},
        
        // modal prompt template
        modalForm = `<form id="user-modal-form" class="Grid Grid--gutters" action="submit">
                    <div class="Grid-cell InputAddOn">
                    <span class="InputAddOn-item">Your Name:</span>
                    <input id="user-modal-name" class="InputAddOn-field" type="text" required>
                    </div>
                    <div class="Grid-cell InputAddOn">
                    <span class="InputAddOn-item">GitHub User Name:</span>
                    <input id="user-modal-username"  class="InputAddOn-field" type="text" required>
                    </div>
                    <div class="Grid-cell InputAddOn">
                    <button class="InputAddOn-item" id="user-modal-button">Go!</button>
                    </div>
                    </form>`;
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$greeting    = $('#greeting');
        
        DOM.$overlay = $('<div id="overlay"></div>');
        
        DOM.$modalPrompt = $(document.createElement('div'));
        DOM.$modalPrompt
            .attr('id', 'user-modal')
            .addClass('user-modal')
            .html(modalForm);
        
        $('body')
            .append(DOM.$modalPrompt);
    }
    
    
    // bind events
    function bindEvents() {
        $('#user-modal-form').submit(handleSubmit);
    }
    
    
    // handle modal submit
    function handleSubmit(e) {
        e.preventDefault();
        
        console.log(e);
        
        var name       = e.currentTarget[0].value,
            githubName = e.currentTarget[1].value;
        
        userName = name;
        
        LS.setData('dev-dash-user', {
            name     : name,
            username : githubName
        });
        
        hideModal();
        
        displayMessage();
        
    }
    
    
    // asign time-based message to 'greet' on initial load
    function makeMessage() {
        var timeOfDay,
            tehDate = new Date(),
            initialHour = tehDate.getHours();
        
        if (initialHour < 12) {
            timeOfDay = "Morning";
        } else if (initialHour >= 12 && initialHour < 17) {
            timeOfDay = "Afternoon";
        } else {
            timeOfDay = "Evening";
        }

        return `Good ${timeOfDay}, ${userName}.`;
    }
    
    
    // show modal - slide down from top
    function showModal() {
        
        // show overlay
        DOM.$overlay.show();
        
        DOM.$modalPrompt
            .addClass('user-modal-show');
    }
    
    
    // hide modal - slide up to top
    function hideModal() {
        
        // show overlay
        DOM.$overlay.hide();
        
        DOM.$modalPrompt
            .removeClass('user-modal-show');
    }
    
    
    // check local storage for user
    function checkStorage() {
        
        var storage = LS.getData('dev-dash-user');
        
        if (storage && storage.name) {
            userName = storage.name;
            displayMessage();
        } else {
            showModal();
        }
    }
    

    // render message to DOM
    function displayMessage() {
        DOM.$greeting.text(makeMessage());
    }
    
    
    // public init method
    function init() {
        cacheDom();
        
        DOM.$overlay.hide();
        $('body').append(DOM.$overlay); // then append it to DOM
        
        bindEvents();
        
        checkStorage();
//        displayMessage();
    }
    
    
    // export public methods
    return {
        init: init
    };
    
}(jQuery));