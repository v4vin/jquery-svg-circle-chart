// Configure
require.config({
  baseUrl: 'node_modules/core/node_modules',

  // Create shortcuts to all libraries
  paths: {
		'jquery':                     'empty:',
		'snap':                   		'js-common/assets/vendor/snap',
    'attachJQ':                   'js-common/assets/js/attachJQ',
    'chartcircle':                'circle-chart/assets/js/circle-chart'
  },

  // Wrap non-AMD libraries
  shim: {
  },

  // Load init
  deps: [ 'js-common/assets/js/init.js' ]

});
