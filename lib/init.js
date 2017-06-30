+function() {
  'use strict';

  var cwd = process.cwd(),
      glob = require('glob'),
      path = require('path'),
      concat = Array.prototype.concat

  module.exports = function(files, client) {
    if (!client.polymer) client.polymer = {}

    var addFiles = function(source, options) {
      if (typeof source === 'string') source = [source]
      source = concat.apply([], source.map(function(file) {
        var fileOptions = Object.assign({}, options || {}, { pattern: path.normalize(cwd + "/" + (file.pattern || file)) })
        files.push(fileOptions)
        return glob.sync(file.pattern || file).map(function (filePath) {
          return filePath.replace(/\//g, path.sep)
        })
      }))
    }

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
    addFiles(client.polymer.src, { included: true, served: true, watched: true })

    // Include, serve & watch your test files, make sure they're loaded last
    addFiles(client.polymer.tests, { included: true, served: true, watched: true })

    // Serve & watch, but don't include, the external JS files for your web components
    if (client.polymer.componentJsSrc) {
      addFiles(client.polymer.componentJsSrc, { included: false, served: true, watched: true })
    }

    // Serve, but don't watch nor include, your 3rd-party dependencies
    if (client.polymer.componentDependenciesFolder) {
      files.push({ pattern: path.normalize(cwd + '/' + client.polymer.componentDependenciesFolder + '/**'),
                   included: false, served: true, watched: false})
    }
  }
}()
