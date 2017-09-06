import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tutorials = new Mongo.Collection('tutorials');

//methods that can be accessed by both client and server
Meteor.methods({
  'tutorials.insert'(text){
    check(text, String);

    // Check if user is logged in
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
//method for inserting tutorial objects into the database
    Tutorials.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      tutorialName:Meteor.String(),
      courseName:Meteor.String(),
      password:Meteor.password(),
      confirmPassword:Meteor.password(),
      startDate:Meteor.Date(),
      endDate:Meteor.Date(),
      startTime: Meteor.time(), //adding field about tutorial start time
      endTime: Meteor.time(), //adding field about tutorial end time
      capacity: Meteor.int(), //adding field about expected students
    });
  },
  'tutorials.remove'(tutorial){
    check(tutorial._id, String);
//sets the permissions for the application so that only the user who created the class can remove it
    if(tutorial.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Tutorials.remove(tutorial._id);
  }
});
