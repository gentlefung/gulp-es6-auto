# changed

Quickly fetches changes for a module.

[![NPM info][nodei.co]][npm-url]

[![Build status][ci-image]][ci-url]
[![dependencies][dependencies-image]][dependencies-url]
[![endorse][endorse-image]][endorse-url]

## Problem

Often your project depends on multiple modules. If you
want to upgrade to latest version for a given module, how
do you know that has changed since the version you have?
The only solution is often to manually browse to the module's
website and find the History.md or Changes.md or similar file.

I am trying to automate this common action:

    changed foo

    // prints
    0.5.0
        - fixed tabs
        - started using bar

## Install and run

    npm install -g changed
    changed --help

## Principle

After installing the latest module's version in the
temp folder, try to find *History*, *Changes* or similarly
named file and display its contents. If everything fails,
displays the README.md file.

## Related

Once you know that you would like to update to given module,
you can use my other tool [next-update](https://npmjs.org/package/next-update) to quickly check if updating breaks any unit tests.

## Small print

Author: Gleb Bahmutov &copy; 2013

License: MIT - do anything with the code, but don't blame me if it does not work.

[ci-image]: https://travis-ci.org/bahmutov/changed.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/changed
[nodei.co]: https://nodei.co/npm/changed.png?downloads=true
[npm-url]: https://npmjs.org/package/changed
[dependencies-image]: https://david-dm.org/bahmutov/changed.png
[dependencies-url]: https://david-dm.org/bahmutov/changed
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
