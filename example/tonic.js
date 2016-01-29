var propertiesToObject = require('java.properties.js').default;

var properties = '# i18n messages \n\
user.edit.title             = Edit User\n\
user.followers.title.one    = One Follower\n\
user.followers.title.other  = All {{count}} Followers\n\
button.add_user.title       = Add a user\n\
button.add_user.text        = Add\n\
button.add_user.disabled    = Saving...\n\
# You can add comments like this,\n\
    ! or with comments\n\
    longvalue                   = You can even use \\\n\
multi-line strings!';

var parsed = propertiesToObject(properties);

console.log(parsed);
