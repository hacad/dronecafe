exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    '*-spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};