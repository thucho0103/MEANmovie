const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt }=require('passport-jwt');
const { JWT_SECRET } = require('../middlewares/jwt.middlerware');
var Users = require('../models/users.model');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey:JWT_SECRET,
    },(payload,done)=>{  
        try{
            console.log(payload);
            Users.findById(payload.sub)
                .then(user=>{
                    console.log(user);
                    if(user.isAdmin){
                        done(null,payload);
                    }
                    else{
                        if(user.plan > new Date()){
                            done(null,payload);
                        }
                        else{
                            done(error,false);
                        }
                    }
                })
        }
        catch(error){
            done(error,false);
        }
}));