+function() {
  'use strict';

  var cwd = process.cwd(),
      glob = require('glob'),
      path = require('path'),
      concat = Array.prototype.concat

  module.exports = function(files, client) {
    if (!client.polymer) client.polymer = {}

    // include adapter
    files.unshift({ pattern: __dirname + '/adapter.js',
                    included: true, served: true, watched: false })

    // include Web Components Polyfills
    // Note: we still need them even if the browser supports them
    //       so that the 'WebComponentsReady' event fires
    if (client.polymer.webcomponentsjs) {
      files.unshift({ pattern: path.normalize(cwd + '/' + client.polymer.webcomponentsjs),
                   included: true, served: true, watched: false})
    }

    // Include, serve & watch your web components, & make sure they're loaded before the tests
    if (typeof client.polymer.src === 'string') client.polymer.src = [client.polymer.src]
    client.polymer.src = concat.apply([], client.polymer.src.map(function(file) {
      files.push({ pattern: path.normalize(cwd + "/" + (file.pattern || file)),
                   included: true, served: true, watched: true })
      return glob.sync(file.pattern || file).map(function (filePath) {
        return filePath.replace(/\//g, path.sep)
      })
    }))

    // Include, serve & watch your test files, make sure they're loaded last
    if (typeof client.polymer.tests === 'string') client.polymer.tests = [client.polymer.tests]
    client.polymer.tests = concat.apply([], client.polymer.tests.map(function(file) {
      files.push({ pattern: path.normalize(cwd + "/" + (file.pattern || file)),
                   included: true, served: true, watched: true })
      return glob.sync(file.pattern || file).map(function (filePath) {
        return filePath.replace(/\//g, path.sep)
      })
    }))

    // Serve & watch, but don't include, the external JS files for your web components
    if (client.polymer.componentJsSrc) {
      if (typeof client.polymer.componentJsSrc === 'string') client.polymer.componentJsSrc = [client.polymer.componentJsSrc]
      client.polymer.componentJsSrc = concat.apply([], client.polymer.componentJsSrc.map(function(file) {
        files.push({ pattern: path.normalize(cwd + "/" + (file.pattern || file)),
                    included: false, served: true, watched: true })
        return glob.sync(file.pattern || file).map(function (filePath) {
          return filePath.replace(/\//g, path.sep)
        })
      }))
    }

    // Serve, but don't watch nor include, your 3rd-party dependencies
    if (client.polymer.componentDependenciesFolder) {
      files.push({ pattern: path.normalize(cwd + '/' + client.polymer.componentDependenciesFolder + '/**'),
                   included: false, served: true, watched: false})
    }
  }
}()
