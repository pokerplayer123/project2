import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Subforums = new Mongo.Collection('subforums');

Meteor.methods({
  'subforums.insert'(subforum) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    var id = Subforums.insert(subforum);
    return  id;
  },

  'subforums.remove'(subforum) {
    check(subforum._id, String);
    if (subforum.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Subforums.remove(subforum._id);
  }

  
});