/*!
 *  views.js - lightweight vanilla JavaScript image viewer
 *  @version 0.1.1
 *  @author Adrian Klimek
 *  @link https://adrianklimek.github.io/views/
 *  @copyright Adrian Klimek 2016-2017
 *  @license MIT
 */

(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory(window));
    } 
    else if (typeof module === 'object' && module.exports) {
        module.exports = function(window) {
            factory(window);
        };
    } 
    else {
        window.Views = factory(window);
    }
}(window, function (window) {
    'use strict';

    // Helpers
    // Extend array
    function extend(target, values) {
        for (var P in values) {
            if (values.hasOwnProperty(P)) {
                target[P] = values[P];
            }
        }
        return target;
    }

    // Constructor
    function Views(element, options) {
        var defaults = {
            defaultTheme: true,
            prefix: '',
            loader: '',
            closeButton: '<svg version="1.1" id="close-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><line fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="6.808" y1="6.808" x2="25.192" y2="25.192"/><line fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="6.808" y1="25.192" x2="25.192" y2="6.808"/></svg>',
            anywhereToClose: true,
            openAnimationDuration: 0,
            closeAnimationDuration: 0
        };

        // Extend defaults
        if (typeof options == 'object') {
            this.options = extend(defaults, options);
        }
        else {
            this.options = defaults;
        }

        // Get element 
        if (typeof element == 'undefined'){
            throw new Error('Views [constructor]: "element" parameter is required');
        }
        else if (typeof element == 'object') {
            this.element = element;
        }
        else if (typeof element == 'string') {
            this.element = document.querySelector(element);
        }
        else {
            throw new Error('Views [constructor]: wrong "element" parameter');
        }

        this.init();
    }

    Views.prototype.init = function() {
        // Create empty callbacks
        this.onOpen = function() {};
        this.onClose = function() {};

        // Css code for default theme
        this.css = {
            view: 'position:fixed;top:0;left:0;width:100%;height:100%;padding:50px 15px;box-sizing:border-box;cursor:pointer;',
            image: 'max-width:100%;max-height:100%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:50px 15px;box-sizing:border-box;',
            closeButton: 'width:24px;height:24px;position:absolute;top:11px;right:11px;-webkit-filter:drop-shadow(0 0 12px rgba(0,0,0,.07));filter:drop-shadow(0 0 12px rgba(0,0,0,.07));',
            background: 'position:absolute;top:0;left:0;height:100%;width:100%;opacity:.75;background-color:#000;'
        };

        if (this.options.prefix !== '' && typeof this.options.prefix == 'string') {
            this.options.prefix += '-';
        }

        // Set names for elements
        this.names = {
            id: {
                view: this.options.prefix + 'views-wrapper',
                closeButton: this.options.prefix + 'views-close'
            },
            class: {
                opening: this.options.prefix + 'views-opening',
                closing: this.options.prefix + 'views-closing',
                loading: this.options.prefix + 'views-loading',
                image: this.options.prefix + 'views-image',
                viewerWrapper: this.options.prefix + 'views-content',
                loader: this.options.prefix + 'views-loader',
                background: this.options.prefix + 'views-background'
            }
        };

        // Get url for content(image)
        this.href = this.element.href;
        if (typeof this.href != 'string') {
            throw new Error('Views [init]: href attribute is missing a value');
        }

        // Bind event to trigger
        this.element.addEventListener('click', this, false);
    };

    // Open image view
    Views.prototype.open = function() {
        this.onOpen();
        var delayTimeout,
            _this = this,
            _backgroundStyle;
        // Create image viewer
        this.view = document.createElement('div');
        this.viewWrapper = document.createElement('div');
        this.closeButton = document.createElement('div');
        this.loader = document.createElement('div');

        // Bind viewer events
        this.view.addEventListener('click', this, false);

        if (this.options.openAnimationDuration) {
            this.view.className += ' ' + this.names.class.opening;
            delayTimeout = setTimeout(function(){
                _this.animationDelay('open');
            }, this.options.openAnimationDuration);
        }

        // Image viewer
        this.viewWrapper.className = this.names.class.viewerWrapper;
        this.view.id = this.names.id.view;
        this.view.className += ' ' + this.names.class.loading;
        if (this.options.defaultTheme) {
            this.view.style.cssText = this.css.view;
            this.closeButton.style.cssText = this.css.closeButton;
            _backgroundStyle = 'style="' + this.css.background + '"';
        }

        // Image close button
        this.closeButton.id = this.names.id.closeButton;
        this.closeButton.innerHTML = this.options.closeButton;

        // Image loader
        this.loader.className = this.names.class.loader;
        this.loader.innerHTML = this.options.loader;

        // Append to image viewer
        this.viewWrapper.appendChild(this.closeButton);
        this.viewWrapper.appendChild(this.loader);

        this.view.innerHTML = '<div class="' + this.names.class.background + '" ' + _backgroundStyle + '></div>';
        this.view.appendChild(this.viewWrapper);

        // Append viewer at the and of document body
        document.body.appendChild(this.view);

        // Load Image
        this.loadImage(this.href);
    };

    // Initialize closing of image view
    Views.prototype.close = function() {
        this.onClose();
        var delayTimeout,
            _this = this;
        this.view.classList.remove(this.names.class.opening);
        this.view.classList.add(this.names.class.closing);
        this.view.removeEventListener('click', this);
        // If animation is not declared remove viewer immediately
        if (!this.options.closeAnimationDuration) {
            this.remove();
        }
        else {
            delayTimeout = setTimeout(function(){
                _this.animationDelay('close');
            }, this.options.closeAnimationDuration);
        }
    };

    // Remove image view
    Views.prototype.remove = function() {
        document.body.removeChild(this.view);
    };

    // Load image from url
    Views.prototype.loadImage = function(url) {
        var image = new Image();
        image.addEventListener('load', this, false);

        image.className = this.names.class.image;
        image.style.cssText = this.css.image;
        image.src = url;
    };

    Views.prototype.animationDelay= function(type) {
        switch (type) {
            case 'open':
                this.view.classList.remove(this.names.class.opening);
            break;
            case 'close':
                this.remove();
            break;
        }
    };

    // Handle all events
    Views.prototype.handleEvent = function(event) {
        var method = 'on' + event.type;
        if (this[method]) {
            this[method](event);
        }
    };

    Views.prototype.onclick = function(event) {
        switch (event.currentTarget) {
            case this.element:
                event.preventDefault();
                this.open();
                break;
            case this.view:
                if (this.options.anywhereToClose || event.target == this.closeButton) {
                    this.close();
                }
                break;
        }
    };

    Views.prototype.onload = function(event) {
        if (event.currentTarget.classList.contains(this.names.class.image)) {
            this.viewWrapper.removeChild(this.loader);
            this.viewWrapper.appendChild(event.target);
            this.view.classList.remove(this.names.class.loading);
        }
    };

    // Custom events 
    Views.prototype.on = function(type, callback) {
        if (typeof callback != 'function') {
            console.log('Views [on]: "callback" parameter is required');
        }
        switch(type) {
            case 'open':
                this.onOpen = callback;
                break;
            case 'close':
                this.onClose = callback;
                break;
            default:
                console.log('Views [on]: wrong or missing "type" parameter');
        }
    };

    return Views;
}));