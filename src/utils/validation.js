const validator = require("validator");

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }

}
const validateEditProfileData = (req) => {
    const allowedValidFields = ["firstName", "lastName", "emailId", "skills", "photoUrl"];

    const fields = Object.keys(req.body);

    const isAllowedValidFields = fields.every((field) =>
        allowedValidFields.includes(field)
    );

    if (!isAllowedValidFields) {
        throw new Error("Invalid fields in data");
    }

    return true;
};
module.exports = {
    validateSignUpData,
    validateEditProfileData
}