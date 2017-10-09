import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Threads = new Mongo.Collection('threads');

Meteor.methods({
  'threads.insert'(thread){
    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    var currentUser = Meteor.user() ? Meteor.user().profile : {};
    var id= Threads.insert(thread);
    Meteor.users.update({ _id: Meteor.userId() }, { $inc: {"profile.points": +1}} );
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

//increase point
function increment(){
  ++Meteor.user.points;
}
