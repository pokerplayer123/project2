import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Requests = new Mongo.Collection('requests');

Meteor.methods({
  'requests.insert'(request) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    var id = Requests.insert(request);
    return  id;
  },

  'requests.remove'(request) {
    check(request._id, String);
    // if (request.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    Requests.remove(request._id);
  }
});
