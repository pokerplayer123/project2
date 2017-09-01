import { Accounts } from 'meteor/accounts-base'


// mySubmitFunction
var mySubmitFunc = function(error, state){
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
  
// myLogoutFunction
var myLogoutFunc = function(){
    console.log('Logged out');
}

//Add fields
AccountsTemplates.addField({
    _id: "userType",
    type: "radio",
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
});

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
    continuousValidation: false,
    negativeFeedback: false,
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
   // onSubmitHook: mySubmitFunc,
   // preSignUpHook: myPreSubmitFunc,
   // postSignUpHook: myPostSubmitFunc,

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
    },
});

