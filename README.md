# Views.js
[View.js](https://adrianklimek.github.io/views) is a lightweight image viewer written in vanilla JavaScript.

## Bower installation
To install via Bower, simply do the following:
```
$ bower install views --save
```

## Usage
For default viewer:
```
var viewer = new Views(anyElement);
```

If you want to use viewer with custom options:
```
var viewer = new Views(anyElement, {
    defaultTheme: true,    // If you don't want to use the default viewer theme, disable this option  
    prefix: '',    // You can add prefix to html ids and classes of the viewer's elements, e.g. if you want to set up multiple viewer instances with different styles
    loader: '',    // Can be a html or a text, it will be inserted to the loader
    closeButton: '',   // Can be a html or just a text, it will be inserted to the close button
    anywhereToClose: true,    // By default you can click anywhere to close viewer
    openAnimationDuration: 0,    // If you use css animations set this option with opening animation duration in ms (without ms)
    closeAnimationDuration: 0    // If you use css animations set this option with closing animation duration in ms (without ms)
});
```

Open viewer template looks like this:
```
<div id="views-wrapper">
    <div class="views-background"></div>
    <div class="views-content">
        <div id="views-close"></div>
        <div class="views-loader"></div>
        <img class="views-image" src="">
    </div>
</div>
```

E.g., if you set a prefix option to "light" every class or id will be start with "light-" `#light-views-wrapper`

When viewer is opening "views-opening" class is added to `#views-wrapper`, and when it's closing "views-closing" is added. 

### Methods
```
var viewer = new Views(anyElement);
viewer.open(); // Open viewer
viewer.close(); // Close viewer
```

## Browser support
All modern browsers and **IE10+**. For **IE9** support classList polyfill is needed, for **IE8** support EventTarget polyfill is also needed.

## License
Views.js is licensed under [MIT license](https://opensource.org/licenses/MIT).
