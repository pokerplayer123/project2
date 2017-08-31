import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tutors = new Mongo.Collection('tasks');

Meteor.methods({
    'tutors.insert'(text){
        check(text, String);
        //checks that tutor that what is entered into the db is a string


        //constructor for Tutors
        Tutors.insert({
            text,
            firstname: new String(),
            lastname: new String(),
        })
    }
})