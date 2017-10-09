import { Template } from 'meteor/templating';
import { Tutorials, TutorialsIndex } from '../lib/tutorials.js';
import { Requests } from '../lib/requests.js';
import { Accounts } from 'meteor/accounts-base';
import { Subforums } from '../lib/subforums.js';
import { Threads } from '../lib/threads.js';
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

Router.route('/my-tutorials', {
  template: 'myTutorials',
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

Router.route('/tutorials/forum/:id', {
  template: 'forum',
  data: function () {
    return Subforums.findOne({ tutorialId: this.params.id });
  }
})

Router.route('/tutorials/forum/:tutorialId/subforum/:subforumId', {
  template: 'subforum',
  data: function () {
    return {
      subforum: Subforums.findOne({ _id: this.params.subforumId }),
      threads: Threads.find({ subforumId: this.params.subforumId })
    }
  }
})

Router.route('/students', {
  template: 'students',
  users: function (){
    Meteor.users.find().forEach(function(oneUser) {
			console.log(oneUser);
		})

		return Meteor.users.find();
  }
});



/**
 * For Each template, binding javascripts
 */
Template.students.helpers({
  isStudent: function () {
    return getLoginUserProfile().userType == 'student';
  },
  userProfile: function () {
    return Meteor.user().profile;
  },
});
// -----------------------------------------
// templte nav start
// -----------------------------------------
Template.nav.helpers({
  isTutor: function () {
    return getLoginUserProfile().userType == 'tutor';
  },
});
// -----------------------------------------
// templte nav end
// -----------------------------------------


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
// templte MyTutorials start
// -----------------------------------------
Template.myTutorials.helpers({
  'tutorials': function () {
    return Tutorials.find({ owner: Meteor.user()._id });
  }
});

// -----------------------------------------
// templte MyTutorials end
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
Template.tutorialDetail.onCreated(function () {
  // if not the owner tutor, always need to enter password
  this.data.needToJoin = this.data.owner != Meteor.user()._id;
  this.data.isJoined = !this.data.needToJoin;
  this.data.errorMsg = '';
});
Template.tutorialDetail.helpers({
  'requests': function () {
    var requests = Requests.find({ tutorialId: this._id }, { sorted: { createdAt: -1 } });
    return requests
  },
  'hasRequests': function () {
    return Requests.find({ tutorialId: this._id }).count() > 0;
  },
  'isTutor': function () {
    return getLoginUserProfile().userType == 'tutor';
  },
  'isOwner': function () {
    return this.owner == Meteor.user()._id;
  },
  'passwordSectionStyle': function () {
    return this.isJoined ? 'none' : 'block';
  },
  'detailSectionStyle': function () {
    return !this.isJoined ? 'none' : 'block';
  },
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
    console.log(form);
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

  'submit #join-room': function (e, instance) {
    e.preventDefault();
    $('#errorMsg').html('');

    var form = $(e.target);
    var password = form.find('[name=room-password]').val();
    if (password == this.password) {
      this.isJoined = true;
      $('#password-section').hide();
      $('#detail-section').show();
    } else {
      $('#errorMsg').html('Invalid password, please try again');
    }
  }

});

Template.requestItem.helpers({
  'isRequestOwnerOrTutorialOwner': function () {
    var tutorial = Tutorials.findOne({ _id: this.tutorialId });
    return this.owner == Meteor.user()._id || (tutorial && tutorial.owner == Meteor.user()._id);
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
// template tutorialDetail end
// -----------------------------------------

// -----------------------------------------
// template forum Start
// -----------------------------------------

Template.forum.helpers({
  'subforums': function () {
    return Subforums.find({ tutorialId: this.tutorialId }, { sorted: { createdAt: -1 } });
  },
  'hasSubforums': function () {
    return Subforums.find({ tutorialId: this.tutorialId }).count() > 0;
  },
  'tutorial': function () {
    return Tutorials.findOne({ _id: this.tutorialId });
  }

});

Template.forum.events({
  'click #create-subforum': function (e) {
    e.preventDefault();
    var modal = $('#create-subforum-modal');
    modal.modal();
    modal.modal('open');
  },

  'submit #create-subforum-form': function () {
    event.preventDefault();
    var form = event.target;
    var modal = $('#create-subforum-modal');
    subforumname = form.subforum.value;
    description = form.description.value;
    tutorialId = Router.current().params.id;
    Meteor.call('subforums.insert', {
      subforumname: subforumname,
      description: description,
      tutorialId: tutorialId,
      owner: Meteor.user()._id,
      createdAt: new Date(),
      isClosed: false
    });
    modal.modal('close');
  }
});
// -----------------------------------------
// template forum end
// -----------------------------------------


// -----------------------------------------
// template subforumCard start
// -----------------------------------------

Template.subforumCard.helpers({
  isOwner: function () {
    return this.owner == Meteor.user()._id;
  }
});

Template.subforumCard.events({
  'click .delete-subforum': function (e) {
    e.preventDefault();
    Meteor.call('subforums.remove', this);
  }
});


// -----------------------------------------
// template subforumCard end
// -----------------------------------------

// -----------------------------------------
// template subforum Start
// -----------------------------------------

Template.subforum.helpers({
  isOwner: function () {
    return this.subforum.owner == Meteor.user()._id;
  },

  isSubforumClosed: function() {
    return this.subforum.isClosed;
  }

});

Template.subforum.events({
  'submit #create-thread': function (e) {
    event.preventDefault();
    var form = $(e.currentTarget);
    var points = 0;
    var answer = form.find('#answer').val();
    var data = {
      tutorialId: Router.current().params.tutorialId,
      subforumId: Router.current().params.subforumId,
      answer: answer,
      owner: Meteor.user()._id,
      ownerName: getLoginUserFullname(),
      createdAt: new Date(),
      likes: "0",
    }
    Meteor.call('threads.insert', data);
    form.find('#answer').val('');  
  },

  'click .like': function(e){
    //on click add a like to post and add the user to the array of "likers"
    //If user has already liked the post, toggle text to "unlike" and remove from array
  },

  'click .close-subforum': function(e) {
    debugger
    e.preventDefault();
    Subforums.update({ _id: this.subforum._id }, { $set: { isClosed: true } });
  },

  'click .open-subforum': function(e) {
    e.preventDefault();
    Subforums.update({ _id: this.subforum._id }, { $set: { isClosed: false } });
  }
});

// -----------------------------------------
// template subforum end
// -----------------------------------------


// -----------------------------------------
// template threadDetail Start
// -----------------------------------------
Template.threadDetail.helpers({
  'fromNow': function () {
    return moment(this.createdAt).fromNow();
  },

  isOwner: function () {
    return this.owner == Meteor.user()._id;
  },

  isSubforumOwner: function() {
    var subforum = Subforums.findOne({_id: Router.current().params.subforumId});
    return subforum.owner == Meteor.user()._id;
  },

  isBestAnswer: function() {
    var subforum = Subforums.findOne({_id: Router.current().params.subforumId});
    return subforum.bestAnswer == this._id;
  },

  points: function() {
    return Meteor.user().profile.points;
  }
});

Template.threadDetail.events({
  'click .delete-thread': function (e) {
    e.preventDefault();
    Meteor.call('threads.remove', this);
  },

  'click .pick-best-answer': function(e) {
    e.preventDefault();
    var subforum = Subforums.findOne({_id: Router.current().params.subforumId});
    Subforums.update({ _id: subforum._id }, { $set: { bestAnswer: this._id } });
  }
});

// -----------------------------------------
// template threadDetail end
// -----------------------------------------


// -----------------------------------------
// template editProfile Start
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

function getLoginUserFullname() {
  var profile = getLoginUserProfile();
  return ((profile.firstname || '') + ' ' + (profile.lastname || '')).trim();
}

// generic helper function
function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}