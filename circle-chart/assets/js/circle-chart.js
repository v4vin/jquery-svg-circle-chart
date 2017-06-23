define('chartcircle',['jquery', 'snap'], function($, Snap) {

  // Constructor
  var ChartCircle = {

    // Defaults
    defaults: {
      size:                            240,                           //svg size
      svgElem:                         '.cc-svg svg',                 //svg elem selector
      elemPercentageSpan:              '.cc-number, .cc-text-number', //Percentage value span elem selector
      speed:                           1000,                          //animation speed
      startValue:                      0,                             //default start value
      barSize:                         '20',                          //bar size in pixel
      fillcolor:                       'none'                         //fill color for the svg
    },

    // Initialize
    init: function(elem, options, i) {
      var my = this;
      my.options = $.extend({},my.defaults,options);
      my.ind = i;

      // References
      my.$elem = $(elem);
      my.$window = $(window);

      my.percentage = my.$elem.data('percentage');
      my.speed = (my.$elem.data('speed') === undefined ? my.options.speed : my.$elem.data('speed') * 1000);
      my.$percentageElem = my.$elem.find(my.options.elemPercentageSpan);
      my.barsize = my.options.barSize;
      my.size = my.options.size;
      my.width = my.size;
      my.height = my.size;
      my.$svgElem = my.$elem.find(my.options.svgElem)[0];
      my.startValue = my.options.startValue;

      // Activate on load
      my.$window.one('loaded',function(){
        my.activate.call(my);
				console.log('f');
      });
    },

    // Activate
    activate: function(){
      var my = this;

      my.prepare();
      my._addHandlers();

    },

    prepare: function() {
      var my = this;
			console.log(Snap);

      my.svgElem = Snap(my.$svgElem);

      my.d =[0,my._getDAttr(my.percentage)];
      my.loopLength = [0,Snap.path.getTotalLength(my.d[my.d.length-1])];

      my.svgPath = my.svgElem.path({
                     path: Snap.path.getSubpath(my.d[my.d.length-1], 0, 0),
                     fillOpacity: 0,
                     strokeWidth: 20,
                    });
      my._animatePercentage(0, my.percentage);
    },

    _getDAttr: function(percentage) {
      var my = this;

      var path_cx = my.width / 2,
          path_cy = my.height / 2,
          path_start_angle = 0,
          path_end_angle = percentage * (Math.PI * 2 / 100),
          path_r = Math.min(path_cx, path_cy) - my.barsize / 2,
          x1 = path_cx + path_r * Math.sin(path_start_angle),
          y1 = path_cx - path_r * Math.cos(path_start_angle),
          x2 = path_cx + path_r * Math.sin(path_end_angle),
          y2 = path_cx - path_r * Math.cos(path_end_angle),
          path_big = (path_end_angle - path_start_angle > Math.PI ? 1 : 0);

      var d = "M" + x1 + "," + y1 + " A" + path_r + "," + path_r + " 0 " + path_big + " 1 " + x2 + "," + y2;

      return d;
    },

    _addHandlers: function(){
      var my = this;

      // API/actions calls
      my.$elem.on({
        'revealing.chartcircle': function(e) { my._animatePercentage(0, my.percentage) },
        'redraw.chartcircle': function(e,params) { my.reDraw(params.percentage) },
        'updateto.chartcircle': function(e,params) { my.updateTo(params.percentage) }
      });

    },

    _animatePercentage: function(startValue, endValue) {
      var my = this;

      // animating graph
      Snap.animate(my.loopLength[my.loopLength.length-2], my.loopLength[my.loopLength.length-1],
        function(step){
          my.svgPath.attr({
            path: Snap.path.getSubpath((startValue < endValue ? my.d[my.d.length-1] : my.d[my.d.length-2]), 0, step)
          });
          // number counter
          my.$percentageElem.text(Math.ceil(step/6.95)+'%');// reusing Snap animation for counting 6.95 is (current loop length - previous loop length)/(endvalue - startvalue)
        },
        my.speed //duration
      );
    },

    //updates the chart to the new value.
    updateTo: function(percentage) {
      var my = this;

      if (!percentage) return;
      my.d.push(my._getDAttr(percentage));
      my.loopLength.push(Snap.path.getTotalLength(my.d[my.d.length-1]));
      my._animatePercentage(my.percentage, percentage);
      my.percentage = percentage;
    },

    // redraws the chart from 0 to the new vlaue.
    reDraw: function(percentage) {
      var my = this;

      if (!percentage) return;
      my.percentage = percentage;
      my.svgPath.remove();
      my.prepare();
    }
  };

  // Return
  return ChartCircle;
});