+function() {
  'use strict';

  var initPolymer = require('./lib/init')
  initPolymer.$inject = ['config.files', 'config.polymer', 'config.client']

  module.exports = {
    'framework:polymer': ['factory', initPolymer]
  }
}()
