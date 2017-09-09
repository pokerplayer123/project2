import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tutorials = new Mongo.Collection('tutorials');

//methods that can be accessed by both client and server
Meteor.methods({
  'tutorials.insert'(tutorialDetails){
    var tutorialID = Tutorials.insert(tutorialDetails);
    return tutorialID;

    // Check if user is logged in
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
  }
  },
//method for inserting tutorial objects into the database
  'tutorials.remove'(tutorial){
    check(tutorial._id, String);
//sets the permissions for the application so that only the user who created the class can remove it
    if(tutorial.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Tutorials.remove(tutorial._id);
  }
});
