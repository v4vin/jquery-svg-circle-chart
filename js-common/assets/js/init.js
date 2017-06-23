// Flag when loaded
(function(){
  $(function(){
    //console.log('tiaa-footer: domready');
    $(window).load(function(){ this._loaded=true })
  });
})(jQuery);

// For header files
// Sets up variables so they may be requested without reloading
// Also shims the ones needing shimming
define('jquery', function(){
  return jQuery;
});

// Load all libraries
require([
	'jquery',
	'snap',
	'attachJQ',
	'chartcircle'
  ], function(
		jquery,
		snap,
    attachJQ,
    chartcircle
  ) {
	// Attach functions
	var $window = $(window);
	var $document = $(document);
	var $body = $('body');

	function attachJQComponents(){
		$('.chart-circle').attachJQ(chartcircle,'chartcircle');
	}
	attachJQComponents();
	setTimeout(function(){
		$window.trigger('loaded');
	},400);
}    
);
