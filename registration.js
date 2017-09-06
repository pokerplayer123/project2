import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './registration.html';

Router.route('/', function () {
  this.render('Home', {
    data: function () { return Items.findOne({_id: this.params._id}); }
  });
});

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var name = $('[name=name').val();
        var zid = $('[name=zid').val();
        var fbprofile = $('[name=fbprofile]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            name: name,
            zid: zid,
            fbprofile: fbprofile,
            password: password
        });
    }
});
