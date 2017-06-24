module.exports = function(config) {
  config.set({

    basePath: '.',

    files: [
      '../../public/assets/bower_components/angular/angular.js',
      '../../public/assets/bower_components/angular-route/angular-route.js',
      '../../public/assets/bower_components/angular-resource/angular-resource.js',
      '../../public/assets/bower_components/socket.io-client/dist/socket.io.js',
      '../../public/assets/bower_components/angular-mocks/angular-mocks.js',
      '../../public/app.js',
      '../../public/UserDashboard/UserDashboardCtrl.js',
      '../../public/UserDashboard/UserDashboardService.js',
      './UserDashboardCtrlTest.js'    
    ],

    autoWatch: true,

    frameworks: ['jasmine', 'sinon'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-sinon'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};