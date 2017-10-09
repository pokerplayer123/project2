import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Answers = new Mongo.Collection('answers');

Meteor.methods({
  'answers.insert'(thread) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    var id = Answers.insert(thread);
    var points;
    increment();
    Meteor.users.update({ _id: Meteor.userId() }, { $inc: {"profile.points": +0.25}} );
    return id;

  },

  'answers.remove'(thread) {
    check(thread._id, String);
    if (thread.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Answers.remove(thread._id);
  }

});

//increase point
function increment() {
  ++Meteor.user.points;
}