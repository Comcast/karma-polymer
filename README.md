# Karma adapter for Polymer framewrok

This adapter helps to test [Polymer](http://www.polymer-project.org/) projects with [Karma](http://karma-runner.github.io/0.12/index.html).

> Tested with Chrome 37 and Firefox 32 on linux

# Installation

Add npm module to your dependencies:

```
{
  "devDependencies": {
    "karma": "^1.0.0",
    "karma-polymer": "^1.0.0"
  }
}
```

or install it from command line:

```sh
npm install karma-polymer --save-dev
```

# Configuration

> Note to add `polymer` **before** test framework (mocha for example).

Add `polymer` to frameworks array and specify the `client.polymer` options:

```
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['polymer', 'mocha', 'sinon-chai'],

    files: [
      // Include any JS your web components rely on that
      // are NOT imported by the web components themselves
      'bundle.js',
    ],

    client: {
      polymer: {
        webcomponentsjs: 'bower_components/webcomponentsjs/webcomponents-loader.js',
        src: [
          'src/elements/**/!(demo|test)/*.html',
        ],
        tests: [
          'src/elements/**/test/*.js',
        ],
        componentDependenciesFolder: 'bower_components',
        componentJsSrc: [
          'src/elements/**/*.js'
        ]
      },
    },
  });
};
```

- **webcomponentsjs:** `webcomponents-loader.js` (for Polymer 2.0/Web Components v1) or `webcomponents-lite.js` (for Polymer 1.0/Web Components v0)
- **src:** your web components HTML source files
- **tests:** your web components test files
- **componentDependenciesFolder:** source for any 3rd-party dependencies your web components import (most likely `bower_components`)
- **componentJsSrc:** if the JS for your web components is separate from your HTML (required if you want test coverage reports), specify the location of your web components' JS files here


# Usage

The polymer adapter creates necessary `script` element to load `webcomponents-loader.js` (recommended for Web Components v1 specs) or `webcomponents-lite.js` (recommended for Web Components v0 specs) and a set of specified `import` elements (don't forget to specify `polymer.html` itself).

Polymer adapter provides usefull object `polymer` in global space:

### polymer.create(el1, el2, ..., callback)

Creates polymer elements

This function takes a list of elements to create and callback function as a last argument. You can pass just a tag name of element or entire html code with nested elements. Callback will be called with all top-level created elements as arguments when polymer will be ready.

Callback is usefull for jasmine async resolve:

```js
beforeEach(function(done) {
  polymer.create('my-test-element', done)
})

it('should be true', function(done) {
  polymer.create('<x-el><span>test</span></x-el>', function(el) {
    expect(el.querySelector('span').text).toEqual('test')
    done()
  })
})
```

### polymer.with(el1, el2, ..., callback)

Creates elements, runs callback and removes all elements after it

This function is very similar to `create` except it removes all created elements after callback is finished:

```js
it('should be true', function(done) {
  polymer.with('<x-el><span>test</span></x-el>', function(el) {
    expect(el.querySelector('span').text).toEqual('test')
    done()
  })
})
```

### polymer.clear()

Removes all created elements. Usefull for teardown:

```js
afterEach(function(done) {
  polymer.clear()
})
```

### polymer.first, polymer.last, polymer.elements

Returns first, last or all created and existed elements respectively. Usefull with beforeEach blocks:

```js
beforeEach(function(done) {
  polymer.create('my-first-element', 'my-second-element', done)
})

it('should be true', function() {
  expect(polymer.first.tagName).toEqual('MY-FIRST-ELEMENT')
  expect(polymer.last.tagName).toEqual('MY-SECOND-ELEMENT')
  expect(polymer.elements.length).toEqual(2)
  expect(polymer.elements[0].tagName).toEqual('MY-FIRST-ELEMENT')
})
```

# Changelog

### `1.0.0`

* Support for Polymer v2.x / Web Components v1

### `0.1.5`

* Fixed [#2](https://github.com/cybernetlab/karma-polymer/issues/2) (don't start testing untill webcomponents become ready).

### `0.1.4`

* added glob package to the package.json

### `0.1.3`

* Bootstrap process refactored.
* Testing in Firefox fixed.
