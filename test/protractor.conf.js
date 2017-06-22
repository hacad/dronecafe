exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    'UserDashboard-spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};