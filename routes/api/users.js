const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const router = express.Router();
//Load input validation
const validateUserInputRegister = require('../../validation/register');
const validateUserInputLogin = require('../../validation/login');
//Load User Model
const User = require('../../models/User');

// @route  GET api/users/test
// @desc   Tests users route 
// @access Public
router.get('/test', (req, res)=> {
    res.json({msg: 'users works'});
});

// @route  GET api/users/register
// @desc   Register a user
// @access Public
router.post('/register', (req, res)=> {
    const { errors, isValid } = validateUserInputRegister(req.body);
    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const user = User.findOne({ email: req.body.email })
        .then(user => {
            if(user){
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            }else{
                const avatar = gravatar.url(req.body.email,{
                    s: '200', //Size
                    r: 'pg', //Ration
                    d: 'mm' //Default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    //password: req.body.password
                });
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    // Store hash in your password DB.
                    if(err) console.log(err);
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                });
                
            }
        })
});

// @route  GET api/users/login
// @desc   Login a user / Returning a JWT token
// @access Public
router.post('/login',(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateUserInputLogin(req.body);
    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Find user by email
    User.findOne({email})
        .then(user => {
            //Check for user
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors);
            } 

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        //User matched
                        //Create JWT Payload
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }
                        //Sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer '+ token
                                })
                        });
                    }
                    else{
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                })
        });
});

// @route  GET api/users/current
// @desc   Return the current user
// @access Private
router.get('/current',passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});


module.exports = router;