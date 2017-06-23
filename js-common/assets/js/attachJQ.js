define(['jquery'], function($) {

  // Create plugin
  $.fn.attachJQ = function(obj, pluginName, options){
    var $elem = this;

    // Check if element exists
    if ($elem.length > 0){

      // Create the plugin based on provided plugin name
      $.fn[pluginName] = function(options,i){
        var elem = this[0];

        // Check if this is already called, to avoid repeated calls
        if (typeof (elem[pluginName]) !== 'object'){

          // Create instance for that particular element
          elem[pluginName] = Object.create(obj);

          // Initialize the plugin
          elem[pluginName].init(elem, options, i);
        }

        // Return the object to call internal methods from plugin
        return elem[pluginName];
      }

      // Call the plugin for each matching element
      // Note that because we want to return component object
      // instead of jQuery object, each item must be attached
      // one at a time and referenced once at a time
      $elem.each(function(i){
        $(this)[pluginName](options,i);
      });

    };

    // Return the element for chaining purpose
    return $elem;
  };

  // Otherwise return jQuery for AMD pattern
  return $;

});