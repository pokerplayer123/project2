import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tutorials = new Mongo.Collection('tutorials');

//methods that can be accessed by both client and server
Meteor.methods({
  'tutorials.insert'(tutorialName, courseName, password, startDate, endDate, startTime, endTime, capacity, createdAt){
    check(tutorialName, String);
    check(courseName, String);
    check(password, String);
    check(startDate, String);
    check(endDate, String);
    check(startTime, String);
    check(endTime, String);


    // Check if user is logged in
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
//method for inserting tutorial objects into the database
    Tutorials.insert({

      tutorialName:new String(),
      courseName:new String(),
      password:new String(),
      startDate: new String(),
      endDate:new String(),
      startTime: new String(), //adding field about tutorial start time
      endTime: new String(), //adding field about tutorial end time
      capacity: new String(), //adding field about expected students
      createdAt: new Date(),
      owner: Meteor.userId,

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
