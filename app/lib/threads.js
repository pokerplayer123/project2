import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Threads = new Mongo.Collection('threads');

Meteor.methods({
  'threads.insert'(thread){
    if(!Meteor.userId) {
      throw new Meteor.Error('not-authorized');
    }
    var id= Threads.insert(thread);
    return id;
  },

  'threads.remove'(thread){
    check(thread._id, String);
    if (thread.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Threads.remove(thread._id);
  }
});
