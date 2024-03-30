require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {secretPicker} = require('../config/tokens');


const generateToken = (userId,  expires, type) => {

    const secret = secretPicker(type);
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
      };
      const token =  jwt.sign(payload, secret);
      return token;
};

const accessTokenValidate = (token) => {
    try{
        const payload = jwt.verify(token, secretPicker('access'));
        if(payload.exp <= moment().unix()){
            return false;
        }
        return true;
    }catch(err){
        return false;
    }
}
module.exports = {
    generateToken,
    accessTokenValidate
}