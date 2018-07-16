var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://amico:amico2018@ds139251.mlab.com:39251/heroku_snjdrsnt');

//mongoose.connect('mongodb://localhost/sportello-amico');

var db = mongoose.connection;

// Candidate Schema
var CandidateSchema = mongoose.Schema({
        /*    sportelloIndex: {
                type: String,
                required: true,
            }, */
            firstname: {
                type: String,
                required: true,
                index: true
            },
            lastname: {
                type: String,
                required: true,
            },
            bday: {
                type: String,
                required: true,
            },
            idnp: {
                type: String,
            },
            nationality: {
                type: String,
            },
            gender: {
                type: String,
                required: true,
            },
            address: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            region: {
                type: String,
                required: true,
            },
            zip: {
                type: String,
            },
            tel: {
                type: String,
                required: true,
            },
            email: {
                type: String,
//                required: true,
            },
            mainWorkExperience: {
                type: String,
            },
            otherWorkExperience: {
                type: String,
            },
            lookingFor: {
                type: String,
            },
            capabilities: {
                type: String,
            },
            ITcapabilities: {
                type: String,
            },
            mainSchool: {
                type: String,
            },
            courses: {
                type: String,
            },
            language1: {
                type: String,
            },
            language2: {
                type: String,
            },
            l2C: {
                type: String,
            },
            l2P: {
                type: String,
            },
            l2S: {
                type: String,
            },
            language3: {
                type: String,
            },
            l3C: {
                type: String,
            },
            l3P: {
                type: String,
            },
            l3S: {
                type: String,
            },
            language4: {
                type: String,
            },
            l4C: {
                type: String,
            },
            l4P: {
                type: String,
            },
            l4S: {
                type: String,
            },
            language5: {
                type: String,
            },
            l5C: {
                type: String,
            },
            l5P: {
                type: String,
            },
            l5S: {
                type: String,
            },
            problems: {
                type: String,
            },
            license: {
                type: String,
            },
            euroCV: {
                type: Boolean,
            },
            privacy: {
                type: Boolean,
            },
            active: {
                type: Boolean,
            },
            profileImage: {
                type: String,
            },
            profileCv: {
                type: String,
            },
});

var Candidate = module.exports = mongoose.model('Candidate', CandidateSchema);

// Fetch All Candidates
module.exports.getCandidates = function(callback){
    
    Candidate.find({}, { _id: 1, firstname: 1, lastname: 1, bday: 1, gender: 1, mainWorkExperience: 1 }, callback);
}

module.exports.getCandidateById = function(id, callback){
    Candidate.findById(id, callback);
}

module.exports.getCandidateByFirstname = function(firstname, callback){
    var query = {firstname: firstname};
    Candidate.find(query, callback);
}

module.exports.getCandidateByLastname = function(lastname, callback){
    var query = {lastname: lastname};
    Candidate.find(query, callback);
}
/*
module.exports.getUserByCategory = function(username, callback){
    var query = {username: username};
    Candidate.findOne(query, callback);
}
*/

module.exports.deleteCandidate = function(id, callback){
    Candidate.deleteOne({"_id" : id }, callback);
}

module.exports.editCandidate = function(candidate, callback){
    var query = {"id": candidate.id};
    Candidate.findOneAndUpdate(query, {$set:{
        		'firstname': candidate.firstname,
				'lastname': candidate.lastname, 
				'bday': candidate.bday,
				'idnp': candidate.idnp,
				'nationality': candidate.nationality,
				'gender': candidate.gender,
				'address': candidate.address,
				'city': candidate.city,
				'region': candidate.region,
				'zip': candidate.zip,
				'tel': candidate.tel,
				'email': candidate.email,
				'mainWorkExperience': candidate.mainWorkExperience,
				'otherWorkExperience': candidate.otherWorkExperience,
				'lookingFor': candidate.lookingFor,
				'capabilities': candidate.capabilities,
				'ITcapabilities': candidate.ITcapabilities,
				'mainSchool': candidate.mainSchool,
				'courses': candidate.courses,
				'language1': candidate.language1,
				'language2': candidate.language2,
				'l2C': candidate.l2C,
				'l2P': candidate.l2P,
				'l2S': candidate.l2S,
				'language3': candidate.language3,
				'l3C': candidate.l3C,
				'l3P': candidate.l3P,
				'l3S': candidate.l3S,
				'language4': candidate.language4,
				'l4C': candidate.l4C,
				'l4P': candidate.l4P,
				'l4S': candidate.l4S,
				'language5': candidate.language5,
				'l5C': candidate.l5C,
				'l5P': candidate.l5P,
				'l5S': candidate.l5S,
				'problems': candidate.problems,
				'license': candidate.license,
				'euroCV': candidate.euroCV,
				'privacy': candidate.privacy,
				'active': candidate.active,
				'profileImage': candidate.profileImageName,
				'profileCv': candidate.profileCvName
    }},{new: true}, callback);
};

module.exports.createCandidate = function(newCandidate,callback){
        // Create User
        newCandidate.save(callback);
};