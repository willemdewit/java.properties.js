java.properties.js
==================

[![Build Status](https://travis-ci.org/willemdewit/java.properties.js.svg?branch=master)](https://travis-ci.org/willemdewit/java.properties.js)
[![Code Climate](https://codeclimate.com/github/willemdewit/java.properties.js/badges/gpa.svg)](https://codeclimate.com/github/willemdewit/java.properties.js)
[![Test Coverage](https://codeclimate.com/github/willemdewit/java.properties.js/badges/coverage.svg)](https://codeclimate.com/github/willemdewit/java.properties.js/coverage)

Converts a string with the [java properties file](https://docs.oracle.com/cd/E23095_01/Platform.93/ATGProgGuide/html/s0204propertiesfileformat01.html) format to a Javascript Object

It can be used client-side and server-side.

This lib can be useful for i18n-properties files.

Installation
------------

`bower install java.properties.js`

or when using npm:

`npm install java.properties.js`

Module Support
--------------

Note the `dist` directory has multiple module formats, use whatever
works best for you.

- AMD

  `define(['java.properties'], function(propertiesToObject) {});`

- Node.JS (CJS)

  `var propertiesToObject = require('java.properties.js').default`

- Globals

  `window.javaProperties`

API
---

This lib is only one method which is capable of converting a string in 
java.properties format to a Javascript Object

```
# i18n messages
user.edit.title             = Edit User
user.followers.title.one    = One Follower
user.followers.title.other  = All {{count}} Followers
button.add_user.title       = Add a user
button.add_user.text        = Add
button.add_user.disabled    = Saving...
# Unicode characters are processed (e.g. '© or ü or ß' see below)
unicode.chars               = \u00A9 or \u00FC or \u00DF

# You can add comments like this,
! or with comments
longvalue                   = You can even use \
                                multi-line strings!
```

```js
var translations = propertiesToObject(messages);
// result
{
  "user": {
    "edit": {
      "title": "Edit user"
    },
    "followers": {
      "title": {
        "one": "One Follower",
        "other": "All {{count}} Followers"
      }
    }
  },
  "button": {
    "add_user": {
      "title": "Add a user",
      "text": "Add",
      "disabled": "Saving..."
    }
  },
  "longvalue": "You can even use multi-line strings!"
}
```