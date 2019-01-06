var Palaute = require('../models/Palaute'); 


exports.Palaute_list = function(req,res,next) { 
    var PalauteList=[]; 
    Palaute.getAllPalaute(function(err, rows, fields) {  
        if (err) {  
        return next(err); } 
        for (var i = 0; i < rows.length; i++) { 

            // Create an object to save current row's data 
            var Palaute = { 
                'id':rows[i].id, 
                'sisalto':rows[i].sisalto, 
            } 
            // Add object into array 
            PalauteList.push(Palaute); 
        } 

            // Render index.pug page using array  
        res.render('Palaute', {title:'TODO',PalauteList:PalauteList}); 
    }); 
};
exports.task_details = function(req,res,next) {
    var Palaute;
    if (req.params.id) { 
        Palaute.getPalauteById(req.params.id, function(err, rows, fields) { 
            if (err) { 
            return next(err); }
            if(rows.length==1) {
                task = {
                    'id':rows[0].id,
                    'sisalto':rows[0].sisalto,
                }
                res.render('sisalto', {title:'TODO',Palaute: Palaute});
            } 
            else {
                res.status(404).json({"status_code":404, "status_message": "Not found"});
            }
        });
    }
};  
// Handle Task create on GET 

exports.Palaute_create_get = function(req, res, next) {      
    res.render('Palaute_form', { title: 'Luo tehtävä' });
};

// Handle Task create on POST 
exports.task_create_post = function(req, res, next) {
    
    
    //Check that the Title field is not empty
    req.checkBody('title', 'Title is required').notEmpty(); 
    
    //Trim and escape the name field. 
    req.sanitize('title').escape();
    req.sanitize('title').trim();
    
    
    
    //Run the validators
    var errors = req.validationErrors();
    
    var Palaute = 
      { id:'', 
        title: req.body.title, 
        status:'pending'
       };
    
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('task_form', { title: 'Luo tehtävä', Palaute: Palaute, errors: errors});
    return;
    } 
    else {

        Palaute.addPalaute(Palaute,function(err){
            if(err) {return next(err);}
            res.redirect("/Palaute");
        });
        
    }
};  
exports.Palaute_delete_get = function(req, res, next) { 
    if (req.params.id) {  
    
           Palaute.deletePalaute(req.params.id, function deletePalaute(err) { 
                if (err) { return next(err); } 
                //Success - got to task list 
                res.redirect("/Palaute"); 
            }); 

        } 

};
exports.Palaute_update_get = function(req,res,next) {
    var Palaute;
    if (req.params.id) { 
        Palaute.getPalauteById(req.params.id, function(err, rows, fields) { 
            if (err) { 
            return next(err); }
            if(rows.length==1) {
                Palaute = {
                    'id':rows[0].id,
                    'title':rows[0].title,
                    'status':rows[0].status
                }
                res.render('update_form', {title:'TODO',Palaute: Palaute});
            } 
            else {
                res.status(404).json({"status_code":404, "status_message": "Not found"});
            }
        });
    }
};

// Handle Palaute update on POST 
exports.Palaute_update_post = function(req, res, next) {
        
    //Check that the Title field is not empty
    req.checkBody('title', 'Title is required').notEmpty(); 
    
    //Trim and escape the name field. 
    req.sanitize('title').escape();
    req.sanitize('title').trim();
    
    
    
    //Run the validators
    var errors = req.validationErrors();
    
    var Palaute = 
      { 
     title:req.body.title, 
         status:req.body.status,
     id:req.params.id
       };
    
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('update_form', { title: 'Muokkaa tehtävää', Palaute: Palaute, errors: errors});
    return;
    } 
    else {

        Palaute.updatePalaute(req.params.id,Palaute,function updatePalaute(err) {
                if (err) { return next(err); }
                //Success - got to Palaute list
                res.redirect("/Palaute");
        });
        
    }
};