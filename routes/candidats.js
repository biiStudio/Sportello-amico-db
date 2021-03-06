var express = require('express');
var router = new express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Candidate = require('../models/candidate');
var mongoose = require('mongoose');

//var uri = 'mongodb://localhost/sportello-amico';

var uri = 'mongodb://0.0.0.0/sportello-amico';
mongoose.connect(process.env.MONGODB_URI || uri);

//mongoose.connect('mongodb://localhost/sportello-amico');

var db = mongoose.connection;


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
        res.location('/'); 
        res.redirect('/');
}


router.get('/', ensureAuthenticated, function(req, res, next) {
  
  Candidate.getCandidates(function(err, candidate){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render("candidats", { "candidats": candidate});
    }
  });
});


router.get('/details/:id', ensureAuthenticated, function(req, res, next) {
  Candidate.getCandidateById([req.params.id], function(err, candidate){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('details', { "candidats": candidate});
    }
  });
});

router.get('/edit/:id', ensureAuthenticated, function(req, res, next) {
  Candidate.getCandidateById([req.params.id], function(err, candidate){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('editCandidateInfo', { "candidats": candidate});
    }
  });
});


router.get('/delete/:id', ensureAuthenticated, function(req, res, next) {
    Candidate.getCandidateById([req.params.id], function(err, candidate){
    if(err){
      console.log(err);
      res.send(err);
    } else {
        var id = req.params.id;
        Candidate.deleteCandidate(id, function(err, candidate){
                if(err)throw err;
                console.log("  Candidate delited: get -- " + id);
        });
        res.location('/candidats'); 
        res.redirect('/candidats');
    }
  }); 
});


router.get("/new_candidate", ensureAuthenticated, function(req, res, next) {
  res.render("newCandidate", {
      title: 'Nuovo Candidado'
  });
});

router.post("/new_candidate",ensureAuthenticated, function(req, res, next) {
    
    var sportelloIndex = req.body.sportelloIndex;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var bday = req.body.bday;
    var idnp = req.body.idnp;
    var nationality =  req.body.nationality;
    var gender = req.body.gender;
    var disability = req.body.disability;
    var address = req.body.address;
    var city = req.body.city;
    var region = req.body.region;
    var zip =  req.body.zip;
    
    var tel = req.body.tel;
    var isWhatsapp = req.body.isWhatsapp;
    var email = req.body.email;
    
    var expDomain1 = req.body.expDomain1
    var mainWorkExperience = req.body.mainWorkExperience;
    var expDomain2 = req.body.expDomain2;
    var otherWorkExperience = req.body.otherWorkExperience;
    
    var lookDomain1 = req.body.lookDomain1;
	var lookingFor1 = req.body.lookingFor1;
    var lookDomain2 = req.body.lookDomain2;
    var lookingFor2 = req.body.lookingFor2;
    var lookDomain3 = req.body.lookDomain3;
    var lookingFor3 = req.body.lookingFor3;
    var capabilities = req.body.capabilities;
    var ITcapabilities = req.body.ITcapabilities;
    
    var mainSchool =  req.body.mainSchool;
    var courses =  req.body.courses;
    var otherInfo = req.body.otherInfo;
    var language1 = req.body.language1;
    var language2 = req.body.language2;
    if (language2 != ""){
        var l2C = req.body.l2C;
        var l2P = req.body.l2P;
        var l2S = req.body.l2S;
    } else {
        var l2C = "";
        var l2P = "";
        var l2S = "";
    }

    var language3 =  req.body.language3;
    if (language3 != ""){
        var l3C = req.body.l3C;
        var l3P = req.body.l3P;
        var l3S = req.body.l3S;  
    } else {
        var l3C = "";
        var l3P = "";
        var l3S = ""; 
    }
       
    var language4 = req.body.language4;
    if (language4 != ""){
        var l4C = req.body.l4C;
        var l4P = req.body.l4P;
        var l4S = req.body.l4S;
    } else {
        var l4C = "";
        var l4P = "";
        var l4S = "";
    }

    var language5 = req.body.language5;
    if (language5 != ""){
        var l5C = req.body.l5C;
        var l5P = req.body.l5P;
        var l5S = req.body.l5S;
    } else {
        var l5C = "";
        var l5P = "";
        var l5S = "";
    }

    var problems = req.body.problems;
    var license = req.body.license;
    
    var euroCV =  req.body.euroCV;
    var privacy = req.body.privacy;
    var active = req.body.active;
    var interviewDate = req.body.interviewDate;

    // Check for CV Field
    if(req.files.cv){
        console.log('uploading File...');

        // File Info
        var profileCv = req.files.cv.originalname;
        var profileCvName = req.files.cv.name;

        var profileCvMime = req.files.cv.mimetype;
        var profileCvPath = req.files.cv.path;
        var profileCvExt = req.files.cv.extension;
        var profileCvSize = req.files.cv.size;
    } else {
        // Set a Default 
        var profileCvName = '';
    }
    
    // Check for Image Field
    if(req.files.profileimage){
        console.log('uploading File...');

        // File Info
        var profileImageOriginalName = req.files.profileimage.originalname;
        var profileImageName = req.files.profileimage.name;

        var profileImageMime = req.files.profileimage.mimetype;
        var profileImagePath = req.files.profileimage.path;
        var profileImageExt = req.files.profileimage.extension;
        var profileImageSize = req.files.profileimage.size;
    } else {
        // Set a Default Image
        var profileImageName = 'noimage.png';
    }

    // Form Validation
    req.checkBody('firstname','Inserire nome').notEmpty();
    req.checkBody('lastname','Inserire cognome').notEmpty();
    req.checkBody('bday','Inserire data di nascita').notEmpty();
    //req.checkBody('idnp','Inserire Codice fiscale').notEmpty();
    //req.checkBody('nationality','Inserire nazionalita').notEmpty();
    req.checkBody('gender','Inserire sesso').notEmpty();
    //req.checkBody('address','Inserire indirizzo').notEmpty();
    req.checkBody('city','Inserire Citta').notEmpty();
    req.checkBody('region','Inserire Provincia').notEmpty();
    //req.checkBody('zip','Inserire CAP').notEmpty();
    req.checkBody('tel','Inserire telefono').notEmpty();
    req.checkBody('email','Email not valid').isEmail();

    // Check for errors
    var errors = req.validationErrors();

    if(errors){
        res.render('newCandidate', {
            errors: errors,

                sportelloIndex:  sportelloIndex,
                firstname: firstname,
				lastname: lastname, 
				bday: bday,
				idnp: idnp,
				nationality: nationality,
				gender: gender,
                disability: disability,
				address: address,
				city: city,
				region: region,
				zip: zip,
				tel: tel,
                isWhatsapp: isWhatsapp,
				email: email,
                expDomain1: expDomain1,
				mainWorkExperience: mainWorkExperience,
                expDomain2: expDomain2,
				otherWorkExperience: otherWorkExperience,
                lookDomain1: lookDomain1,
				lookingFor1: lookingFor1,
                lookDomain2: lookDomain2,
                lookingFor2: lookingFor2,
                lookDomain3: lookDomain3,
                lookingFor3: lookingFor3,
				capabilities: capabilities,
				ITcapabilities: ITcapabilities,
				mainSchool: mainSchool,
				courses: courses,
                otherInfo: otherInfo,
				language1: language1,
				language2: language2,
				l2C: l2C,
				l2P: l2P,
				l2S: l2S,
				language3: language3,
				l3C: l3C,
				l3P: l3P,
				l3S: l3S,
				language4: language4,
				l4C: l4C,
				l4P: l4P,
				l4S: l4S,
				language5: language5,
				l5C: l5C,
				l5P: l5P,
				l5S: l5S,
				problems: problems,
				license: license,
				euroCV: euroCV,
				privacy: privacy,
				active: active,
                interviewDate: interviewDate,
				profileImage: profileImageName,
				profileCv: profileCvName

        });
    } else {
        //var sportelloIndex = 'AA0' + db.candidates.count() + 1;
        var newCandidate = new Candidate({
                sportelloIndex:  sportelloIndex,
                firstname: firstname,
				lastname: lastname, 
				bday: bday,
				idnp: idnp,
				nationality: nationality,
				gender: gender,
                disability: disability,
				address: address,
				city: city,
				region: region,
				zip: zip,
				tel: tel,
                isWhatsapp: isWhatsapp,
				email: email,
                expDomain1: expDomain1,
				mainWorkExperience: mainWorkExperience,
                expDomain2: expDomain2,
				otherWorkExperience: otherWorkExperience,
                lookDomain1: lookDomain1,
				lookingFor1: lookingFor1,
                lookDomain2: lookDomain2,
                lookingFor2: lookingFor2,
                lookDomain3: lookDomain3,
                lookingFor3: lookingFor3,
				capabilities: capabilities,
				ITcapabilities: ITcapabilities,
				mainSchool: mainSchool,
				courses: courses,
                otherInfo: otherInfo,
				language1: language1,
				language2: language2,
				l2C: l2C,
				l2P: l2P,
				l2S: l2S,
				language3: language3,
				l3C: l3C,
				l3P: l3P,
				l3S: l3S,
				language4: language4,
				l4C: l4C,
				l4P: l4P,
				l4S: l4S,
				language5: language5,
				l5C: l5C,
				l5P: l5P,
				l5S: l5S,
				problems: problems,
				license: license,
				euroCV: euroCV,
				privacy: privacy,
				active: active,
                interviewDate: interviewDate,
				profileImage: profileImageName,
				profileCv: profileCvName
        });

            // Create Candidate
            Candidate.createCandidate(newCandidate, function(err, candidate){
                if(err)throw err;
                console.log(candidate);
            });

            //Success Message
            req.flash('success', 'Registrazione è andata a buon fine ');

            res.location('/');
            res.redirect('/');
    }
});


router.post("/edit/:id", ensureAuthenticated, function(req, res, next) {
    
    Candidate.getCandidateById([req.params.id], function(err, candidate){
        if(err){
          console.log(err);
          res.send(err);
        } else {
            console.log("Candidate to be edited: " + candidate);
            // Updating Candidate info
        candidate.id = [req.params.id];
		candidate.sportelloIndex =  req.body.sportelloIndex;
		candidate.firstname = req.body.firstname;
		candidate.lastname = req.body.lastname;
		candidate.bday = req.body.bday;
		candidate.idnp = req.body.idnp;
		candidate.nationality =  req.body.nationality;
		candidate.gender = req.body.gender;
        candidate.disability = req.body.disability;
		candidate.address = req.body.address;
		candidate.city = req.body.city;
		candidate.region = req.body.region;
		candidate.zip =  req.body.zip;
		candidate.tel = req.body.tel;
        candidate.isWhatsapp = req.body.isWhatsapp;
		candidate.email = req.body.email;
		candidate.expDomain1 = req.body.expDomain1;
		candidate.mainWorkExperience = req.body.mainWorkExperience;
		candidate.expDomain2 = req.body.expDomain2;
		candidate.otherWorkExperience = req.body.otherWorkExperience;
		candidate.lookDomain1 = req.body.lookDomain1;
		candidate.lookingFor1 = req.body.lookingFor1;
        candidate.lookDomain2 = req.body.lookDomain2;
        candidate.lookingFor2 = req.body.lookingFor2;
        candidate.lookDomain3 = req.body.lookDomain3;
        candidate.lookingFor3 = req.body.lookingFor3;
		candidate.capabilities = req.body.capabilities;
		candidate.ITcapabilities = req.body.ITcapabilities;
		candidate.mainSchool =  req.body.mainSchool;
		candidate.courses =  req.body.courses;
		candidate.otherInfo = req.body.otherInfo;
		candidate.language1 = req.body.language1;
		candidate.language2 = req.body.language2;
			candidate.l2C = req.body.l2C;
			candidate.l2P = req.body.l2P;
			candidate.l2S = req.body.l2S;
		candidate.language3 =  req.body.language3;
			candidate.l3C = req.body.l3C;
			candidate.l3P = req.body.l3P;
			candidate.l3S = req.body.l3S; 
		candidate.language4 = req.body.language4;
			candidate.l4C = req.body.l4C;
			candidate.l4P = req.body.l4P;
			candidate.l4S = req.body.l4S;
        candidate.language5 = req.body.language5;
			candidate.l5C = req.body.l5C;
			candidate.l5P = req.body.l5P;
			candidate.l5S = req.body.l5S;
        candidate.problems = req.body.problems;
		candidate.license = req.body.license;
		candidate.euroCV =  req.body.euroCV;
		candidate.privacy = req.body.privacy;
		candidate.interviewDate = req.body.interviewDate;
		candidate.active = req.body.active;
		candidate.profileCvName = '';
		candidate.profileImageName = 'noimage.png';


		// Form Validation
		req.checkBody('firstname','Inserire nome').notEmpty();
		req.checkBody('lastname','Inserire cognome').notEmpty();
		req.checkBody('bday','Inserire data di nascita').notEmpty();
		//req.checkBody('idnp','Inserire Codice fiscale').notEmpty();
		//req.checkBody('nationality','Inserire nazionalita').notEmpty();
		req.checkBody('gender','Inserire sesso').notEmpty();
		//req.checkBody('address','Inserire indirizzo').notEmpty();
		req.checkBody('city','Inserire Citta').notEmpty();
		req.checkBody('region','Inserire Provincia').notEmpty();
		//req.checkBody('zip','Inserire CAP').notEmpty();
		req.checkBody('tel','Inserire telefono').notEmpty();
		req.checkBody('email','Email not valid').isEmail();

		// Check for errors
		var errors = req.validationErrors();

		if(errors){
		  res.render('editCandidateInfo', { 
		    "candidats": candidate, 
				"errors": errors,
			});
		} else {
			//var sportelloIndex = 'AA0' + db.candidates.count() + 1;
			candidate = {
                sportelloIndex:  candidate.sportelloIndex,
                firstname: candidate.firstname,
				lastname: candidate.lastname, 
				bday: candidate.bday,
				idnp: candidate.idnp,
				nationality: candidate.nationality,
				gender: candidate.gender,
                disability: candidate.disability,
				address: candidate.address,
				city: candidate.city,
				region: candidate.region,
				zip: candidate.zip,
				tel: candidate.tel,
                isWhatsapp: candidate.isWhatsapp,
				email: candidate.email,
                expDomain1: candidate.expDomain1,
				mainWorkExperience: candidate.mainWorkExperience,
                expDomain2: candidate.expDomain2,
				otherWorkExperience: candidate.otherWorkExperience,
                lookDomain1: candidate.lookDomain1,
				lookingFor1: candidate.lookingFor1,
                lookDomain2: candidate.lookDomain2,
                lookingFor2: candidate.lookingFor2,
                lookDomain3: candidate.lookDomain3,
                lookingFor3: candidate.lookingFor3,
				capabilities: candidate.capabilities,
				ITcapabilities: candidate.ITcapabilities,
				mainSchool: candidate.mainSchool,
				courses: candidate.courses,
                otherInfo: candidate.otherInfo,
				language1: candidate.language1,
				language2: candidate.language2,
				l2C: candidate.l2C,
				l2P: candidate.l2P,
				l2S: candidate.l2S,
				language3: candidate.language3,
				l3C: candidate.l3C,
				l3P: candidate.l3P,
				l3S: candidate.l3S,
				language4: candidate.language4,
				l4C: candidate.l4C,
				l4P: candidate.l4P,
				l4S: candidate.l4S,
				language5: candidate.language5,
				l5C: candidate.l5C,
				l5P: candidate.l5P,
				l5S: candidate.l5S,
				problems: candidate.problems,
				license: candidate.license,
				euroCV: candidate.euroCV,
				privacy: candidate.privacy,
				active: candidate.active,
                interviewDate: candidate.interviewDate,
				profileImage: candidate.profileImageName,
				profileCv: candidate.profileCvName
			};
            Candidate.editCandidate(candidate, function(err, candidate){
                if(err)throw err;
                console.log("Candidate edited: " + candidate.id);
            });
            //Success Message
            req.flash('success', 'Detagli agiornate coretamente');
            
            res.location('/candidats'); 
            res.redirect('/candidats');
		}
    }
    });
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// OLD functions

/*
router.get("/", function(req, res, next) {
  res.render("newCandidate", {
      'title': 'Nuovo Candidado'
  });
});


router.get("/new_candidate", function(req, res, next) {
  res.render("newCandidate", {
      'title': 'Nuovo Candidado'
  });
});
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

