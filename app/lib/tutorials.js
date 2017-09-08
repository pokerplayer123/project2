import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tutorials = new Mongo.Collection('tutorials');

//methods that can be accessed by both client and server
Meteor.methods({
  'tutorials.insert'(text){
    // need to edit the check input
    check(text, String);

    // Check if user is logged in
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
//method for inserting tutorial objects into the database
    Tutorials.insert({
      createdAt: new Date(),
      owner: new String(),
      tutorialName:new String(),
      courseName:new String(),
      password:new String(),
      confirmPassword:new String(),
      startDate: new Date(),
      endDate:new Date(),
      startTime: new Time(), //adding field about tutorial start time
      endTime: new Time(), //adding field about tutorial end time
      capacity: new String(), //adding field about expected students

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
