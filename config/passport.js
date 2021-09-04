const JWTStartegy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JWTStartegy(opts, (jwt_payload, done)=> {
            User.findById(jwt_payload.id)
                .then(user => {
                    if(user) done(null,user);

                    return done(null, false);
                })
                .catch(err => console.log(err));
    }));
};