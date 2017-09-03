import { Template } from 'meteor/templating';
import { Tutorials } from '../lib/tutorials.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';
tutorial = new Mongo.Collection('tutorial');

Template.body.helpers({
  tutorials:function(){
    return Tutorials.find({});
  }
});

Template.body.events({
'submit .new-Tutorial': function(event){
  var tutorial = event.target.tutorial.value;

  tutorial.insert({
    tutorial: tutorial,
    createdAt: new Date()
  });
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
