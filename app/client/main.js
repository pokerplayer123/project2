import { Template } from 'meteor/templating';
import { Tutorials } from '../lib/tutorials.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';
Tutorial = new Mongo.Collection('tutorial');

Template.body.helpers({
  tutorial:function(){
    return Tutorial.find({});
  }
});

Template.body.events({
'submit .new-Tutorial': function(event){
  var tutorialName = event.target.tutorialName.value;
  var courseName = event.target.courseName.value;
  var password = event.target.password.value;
  var confirmPassword = event.target.confirmPassword.value;
  var startDate = event.target.startDate.value;
  var endDate = event.target.endDate.value;
  var startTime = event.target.startTime.value;
  var endTime = event.target.endTime.value;
  var capacity = event.target.capacity.value;


  Tutorials.insert({
    tutorialName: tutorialName,
    courseName: courseName,
    password: password,
    confirmPassword: confirmPassword,
    startDate:startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    capacity: capacity,
    createdAt: new Date()
  });

  target.text.value ='';
}
});

Template.add.events({
  'submit .add-form': function(){
    event.preventDefault();

    // Get input value from the modal so that we can insert it into the database
    const target = event.target;
    const text = target.text.value;

    // Insert tutorial into collection
    Meteor.call('tutorials.insert', text);

    // Clear form
    target.text.value = '';

    // Close modal
    $('#addModal').modal('close');

    return false;
  }
});

Template.tutorial.events({
  'click .delete-tutorial':function(){
    Meteor.call('tutorials.remove', this);
    return false;
  }
});

Template.atNavButton.events({
  'click .login-toggle': ()=> {
    Session.set('nav-toggle', 'open');
  },
  'click .logout': ()=> {
    AccountsTemplates.logout();
  }
})
