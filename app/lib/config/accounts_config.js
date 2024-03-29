import { Accounts } from 'meteor/accounts-base'


// mySubmitFunction
var mySubmitFunc = function (error, state) {
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
};

var myPreSubmitFunc = function (password, info) {
}

var myPostSubmitFunc = function (userId, info) {
}


// myLogoutFunction
var myLogoutFunc = function () {
  Router.go('/');
  console.log('Logged out');
}

//Add fields
AccountsTemplates.addFields([
  {

    _id: "zid",
    type: "text",
    displayName: "zID",
    required: true,
  },

  {

    _id: "firstname",
    type: "text",
    displayName: "First Name",
    required: true,
  },

  {
    _id: "lastname",
    type: "text",
    displayName: "Last Name",
    required: true,
  },

  {
    _id: "degree",
    type: "text",
    displayName: "Degree",
    required: false,
  },

  {

    _id: "gender",
    type: "select",
    displayName: "Gender",
    select: [
      {
        text: "Male",
        value: "male",
      },
      {
        text: "Female",
        value: "female",
      },
    ],
    required: true,
  },

  {
    _id: "userType",
    type: "select",
    displayName: "Tutor or Student?",
    select: [
      {
        text: "Tutor",
        value: "tutor",
      },
      {
        text: "Student",
        value: "student",
      },
    ],
    required: true,
  },

  // {
  //   _id: "consultationStart",
  //   type: "text",
  //   displayName: "Consultation Time Start",
  //   required: false,
  // },

  // {
  //   _id: "consultationEnd",
  //   type: "text",
  //   displayName: "Consultation Time End",
  //   required: false,
  // },

]);


AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  lowercaseUsername: false,
  focusFirstInput: true,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: false,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Privacy Policy and Terms of Use
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',

  // Redirects
  homeRoutePath: '/home',
  redirectTimeout: 4000,

  // Hooks
  onLogoutHook: myLogoutFunc,
  onSubmitHook: mySubmitFunc,
  preSignUpHook: myPreSubmitFunc,
  postSignUpHook: myPostSubmitFunc,

  // Texts
  texts: {
    button: {
      signUp: "Register Now!"
    },
    title: {
      forgotPwd: "Recover Your Password"
    },
    errors: {
      loginForbidden: "error.accounts.Login failed"
    },
    inputIcons: {
              isValidating: "fa fa-spinner fa-spin",
              hasSuccess: "fa fa-check",
              hasError: "fa fa-times",
    },
  },
});

AccountsTemplates.configureRoute('signIn', {
  redirect: function(){
      var user = Meteor.user();
      if (user)
        Router.go('/tutorials');
  }
});
