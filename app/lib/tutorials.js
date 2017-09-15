import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tutorials = new Mongo.Collection('tutorial');

//methods that can be accessed by both client and server
Meteor.methods({
  'tutorial.insert'(text){
    check(text, String);

    // Check if user is logged in
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
//method for inserting tutorial objects into the database
    Tutorials.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.use(),
      username: Meteor.user().username,
      tutorialName:Meteor.user(),
      courseName:Meteor.user(),
      password:Meteor.user(),
      confirmPassword:Meteor.user(),
      startDate:Meteor.user(),
      endDate:Meteor.user(),
      startTime: Meteor.user(), //adding field about tutorial start time
      endTime: Meteor.user(), //adding field about tutorial end time
      capacity: Meteor.user(), //adding field about expected students
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

Meteor.publish( 'tutorials', function( search ) {
  check( search, Match.OneOf( String, null, undefined ) );

  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { tutorialName: regex },
        { courseName: regex },
      ]
    };

    projection.limit = 100;
  }

  return Tutorials.find( query, projection );
});
