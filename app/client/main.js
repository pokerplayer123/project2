import { Template } from 'meteor/templating';
import { Tutorials } from '../lib/tutorials.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

/**
 * Router Configuration Starts
 */
Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  template: 'tutorials',
  data: function() {
  }
});

Router.route('/tutorials', {
  template: 'tutorials',
});

Router.route('/tutorials/:id', {
  template: 'tutorialDetail',
  data: function() {
    return Tutorials.findOne({ _id: this.params.id });
  }
});

Router.route('/editProfile', {
  template: 'editProfile',
});


/**
 * For Each template, binding javascripts
 */
Template.tutorials.helpers({
  tutorials:function(){
    return Tutorials.find({});
  },

  isStudent: function() {
    return getLoginUserProfile().userType == 'student';
  },

  isTutor: function() {
    return getLoginUserProfile().userType == 'tutor';
  },

  userProfile: function() {
    return Meteor.user().profile;
  },

  userEmail: function() {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  }
});

Template.addTutorial.events({
  'submit .add-form': function(){
    event.preventDefault();

    // Get input value from the modal so that we can insert it into the database
    const target = event.target;
    const tutorialName = target.tutorialName.value;
    const courseName = target.courseName.value;
    const password = target.password.value;
    const owner = Meteor.userId();
    const startDate = target.startDate.value;
    const endDate = target.endDate.value;
    const startTime = target.startTime.value;
    const endTime = target.endTime.value;

    // Insert tutorial into collection
    Meteor.call('tutorials.insert', {
      tutorialName: tutorialName,
      courseName: courseName,
      password: password,
      owner: owner,
      startTime: startTime,
      endTime: endTime,
      startDate: startDate,
      endDate: endDate,
    });
    // Clear form
    target.tutorialName.value = '';
    target.courseName.value ='';
    target.password.value ='';

    // Close modal
    $('#addModal').modal('close');
    return false;
  }
});

Template.tutorial.events({
  'click .delete-tutorial':function(){
    debugger
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


Template.editProfile.helpers({
  userProfile: function() {
    return Meteor.user() ? Meteor.user().profile : {};
  },

  userEmail: function() {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  },

  compareGender: function(target) {
    var profile = Meteor.user() ? Meteor.user().profile : {};
    return profile.gender == target ? 'selected' : '';
  },

  compareUserType: function(target) {
    var profile = Meteor.user() ? Meteor.user().profile : {};
    return profile.userType == target ? 'selected' : '';
  },

});

Template.editProfile.events({
  'submit form': function(e){
    e.preventDefault();
    var form = $(e.target);
    var newProfile = objectifyForm(form.serializeArray());
    Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: newProfile}});
    // $('#editProfile').modal('close');
    return false;
  }
});

function getLoginUserProfile() {
  return Meteor.user() ? Meteor.user().profile : {};
}

function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
