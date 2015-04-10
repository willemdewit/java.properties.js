java.properties.js
==================

Converts a java properties file to a Javascript Object

It can be used client-side and server-side.

This lib can be usefull for i18n-properties files.

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
  }
}
```