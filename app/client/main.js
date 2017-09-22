import { Template } from 'meteor/templating';
import { Tutorials, TutorialsIndex } from '../lib/tutorials.js';
import { Requests } from '../lib/requests.js';
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
  data: function () {
  }
});

Router.route('/Insert-Password', {
  template: 'Insert',
});

Router.route('/tutorials', {
  template: 'tutorials',
});

Router.route('/tutorials/add', {
  template: 'addTutorial',
});

Router.route('/tutorials/:id', {
  template: 'tutorialDetail',
  data: function () {
    return Tutorials.findOne({ _id: this.params.id });
  }
});



Router.route('/editProfile', {
  template: 'editProfile',
});

/**
 * For Each template, binding javascripts
 */
// -----------------------------------------
// templte tutorials start
// -----------------------------------------

Template.tutorials.helpers({
  isStudent: function () {
    return getLoginUserProfile().userType == 'student';
  },

  isTutor: function () {
    return getLoginUserProfile().userType == 'tutor';
  },

  userProfile: function () {
    return Meteor.user().profile;
  },

  userEmail: function () {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  }
});

// -----------------------------------------
// templte tutorials end
// -----------------------------------------

// -----------------------------------------
// templte addTutorial start
// -----------------------------------------

Template.addTutorial.events({
  'submit .add-form': function () {
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
    target.courseName.value = '';
    target.password.value = '';

    // Close modal
    Router.go('/tutorials');
    return false;
  }
});

// -----------------------------------------
// templte addTutorial end
// -----------------------------------------


// -----------------------------------------
// templte tutorial start
// -----------------------------------------

Template.tutorial.helpers({
  isOwner: function () {
    return this.owner == Meteor.user()._id;
  }
});

Template.tutorial.events({
  'click .delete-tutorial': function () {
    var r = confirm("Do you want to delete this tutorial?");
    if (r == true) {
      Meteor.call('tutorials.remove', this);
    }
  }
});

// -----------------------------------------
// templte tutorial end
// -----------------------------------------

Template.atNavButton.events({
  'click .login-toggle': () => {
    Session.set('nav-toggle', 'open');
  },
  'click .logout': () => {
    AccountsTemplates.logout();
  }
})

// -----------------------------------------
// templte tutorialDetail start
// -----------------------------------------
Template.tutorialDetail.helpers({
  'requests': function () {
    return Requests.find({ tutorialId: this._id }, { sorted: { createdAt: -1 } });
  },
  'hasRequests': function () {
    return Requests.find({ tutorialId: this._id }).count() > 0;
  }

});

Template.tutorialDetail.events({
  'click #create-request': function (e) {
    e.preventDefault();
    var modal = $('#create-request-modal');
    modal.modal();
    modal.modal('open');
  },

  'submit #create-request-form': function (e) {
    e.preventDefault();
    var form = $(e.target);
    var modal = $('#create-request-modal');
    var request = objectifyForm(form.serializeArray());
    request = Object.assign(request, {
      createdAt: new Date,
      owner: Meteor.user()._id,
      ownerZid: getLoginUserProfile().zid,
      tutorialId: this._id
    });

    Meteor.call('requests.insert', request);
    modal.modal('close');
  },

});

Template.requestItem.helpers({
  'isRequestOwner': function () {
    return this.owner == Meteor.user()._id;
  },
  'fromNow': function () {
    return moment(this.createdAt).fromNow();
  }
});

Template.requestItem.events({
  'click .delete-request': function (e) {
    var r = confirm("Do you want to delete this request?");
    if (r == true) {
      Meteor.call('requests.remove', this);
    }
  }
});

// -----------------------------------------
// templte tutorialDetail end
// -----------------------------------------

// -----------------------------------------
// templte editProfile Start
// -----------------------------------------
Template.editProfile.helpers({
  userProfile: function () {
    return Meteor.user() ? Meteor.user().profile : {};
  },

  userEmail: function () {
    return Meteor.user().emails ? Meteor.user().emails[0].address : null;
  },

  isTutor: function () {
    return getLoginUserProfile().userType == 'tutor';
  },

  compareGender: function (target) {
    var profile = Meteor.user() ? Meteor.user().profile : {};
    return profile.gender == target ? 'selected' : '';
  },

  compareUserType: function (target) {
    var profile = Meteor.user() ? Meteor.user().profile : {};
    return profile.userType == target ? 'selected' : '';
  },

});

Template.editProfile.events({
  'submit form': function (e) {
    e.preventDefault();
    var form = $(e.target);
    var oldProfile = getLoginUserProfile();
    var newProfile = Object.assign(oldProfile, objectifyForm(form.serializeArray()));
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { profile: newProfile } });
    return false;
  }
});

// -----------------------------------------
// templte editProfile end
// -----------------------------------------


// -----------------------------------------
// templte search tutorial start
// -----------------------------------------

Tracker.autorun(function () {
  let cursor = TutorialsIndex.search('input')
})

Template.search.helpers({
  tutorialsIndex: () => TutorialsIndex, // instanceof EasySearch.Index
  searchInputAttr: function () {
    return {
      id: 'search',
    };
  }
})

// -----------------------------------------
// templte search tutorial end
// -----------------------------------------


// generic helper function
function getLoginUserProfile() {
  return Meteor.user() ? Meteor.user().profile : {};
}

// generic helper function
function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}


// -----------------------------------------
// templte join tutorial start
// -----------------------------------------

Template.search.event({
  'click .joinClass': function(){
    var roomPass = target.roomPassword.value;
    Meteor.call('joinTutorial', this);
  }
  
});