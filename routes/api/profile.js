const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/User');

// @route  GET api/profile/test
// @desc   Tests profile route 
// @access Public
router.get('/test', (req, res)=> {
    res.json({msg: 'profile works'});
});

// @route  GET api/profile/
// @desc   Get current user profile 
// @access Private
router.get('/current',passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => console.log(err));
});

router.get('/',passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => console.log(err));
});

// @route  POST api/profile/
// @desc   Create or Edit User Profile 
// @access Private
router.post('/',passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    //Get fields
    const profileFiels = {};
    profileFiels.user = req.user.id;
    if(req.body.handle) profileFiels.handle = req.body.handle;
    if(req.body.company) profileFiels.company = req.body.company;
    if(req.body.website) profileFiels.website = req.body.website;
    if(req.body.location) profileFiels.location = req.body.location;
    if(req.body.bio) profileFiels.bio = req.body.bio;
    if(req.body.status) profileFiels.status = req.body.status;
    if(req.body.githubusername) profileFiels.githubusername = req.body.githubusername;
    //Skills - split into array
    if(typeof(req.body.skills !== undefined)){
        profileFiels.skills = req.body.skills.split(',');
    }
    //Initialise Social
    profileFiels.social = {};

    if(req.body.youtube) profileFiels.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFiels.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFiels.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFiels.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFiels.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            if(profile){
                //Update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFiels }, { new: true })
                    .then(profile => res.json(profile));
            }
            else{
                //Create

                //Check if handle exists
                Profile.findOne({ handle: profileFiels.handle })
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        //Save profile
                        new Profile(profileFiels).save().then(profile => res.json(profile));
                    });
            }
        })
});
module.exports = router;