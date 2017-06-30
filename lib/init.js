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
      files.push({ pattern: path.normalize(cwd + '/' + client.polymer.webcomponentsjs),
                   included: true, served: true, watched: false})
    }

    // find and include polymer modules
    if (typeof client.polymer.src === 'string') client.polymer.src = [client.polymer.src]
    client.polymer.src = concat.apply([], client.polymer.src.map(function(file) {
      files.push({ pattern: path.normalize(cwd + "/" + (file.pattern || file)),
                   included: false, served: true, watched: true })
      return glob.sync(file.pattern || file).map(function (filePath) {
        return filePath.replace(/\//g, path.sep)
      })
    }))
  }
}()
