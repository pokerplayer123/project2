import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.users.allow({
    update: function (userId, doc, fieldNames, modifier) {
      //similar checks like insert
      return true;
    },
  });
});

