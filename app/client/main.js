import { Template } from 'meteor/templating';
import { Tutorials } from '../lib/tutorials.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

Template.body.helpers({
  tutorials:function(){
    return Tutorials.find({});
  },

  userProfile: function() {
    return Meteor.user().profile;
  },

  userEmail: function() {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  }
});

Template.body.events({
'submit .new-Tutorial': function(event){
  var tutorial = event.target.tutorial.value;

  tutorial.insert({
    tutorial: tutorial,
    createdAt: new Date()
  });
  return false;
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


Template.editProfile.helpers({
  userProfile: function() {
    return Meteor.user().profile;
  },

  userEmail: function() {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  },

  compareGender: function(target) {
    var profile = Meteor.user().profile;
    return profile.gender == target ? 'selected' : '';
  },

  compareUserType: function(target) {
    var profile = Meteor.user().profile;
    return profile.userType == target ? 'selected' : '';
  },

});

Template.editProfile.events({
  'submit form': function(e){
    var form = $(e.target);
    var newProfile = objectifyForm(form.serializeArray());
    Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: newProfile}});
    $('#editProfile').modal('close');
    return false;
  }
});

function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
