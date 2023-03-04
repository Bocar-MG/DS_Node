let students = require('../models/students.json')

const router = require('express').Router();
const Joi = require('joi');

let student_validation_post = Joi.object({

    nom: Joi.string().required(),
    classe: Joi.string().alphanum().min(3).max(10).required(),
    modules: Joi.array().required(),
    module: Joi.string().min(10),
    note: Joi.number().integer().positive(),
    moyenne: Joi.number().integer().positive()
});


let student_validation_update = Joi.object({
    
    nom: Joi.string(),
    classe: Joi.string().alphanum().min(3).max(10),
    modules: Joi.array(),
    module: Joi.string().min(10),
    note: Joi.number().integer().positive(),
    moyenne: Joi.number().integer().positive().precision(2)
});

// Listing all students
router.get('',(req,res)=>{
    res.json(students)
})

// Listing an student by Id
router.get('/:name',(req,res) =>{
   let student = students.find(std => std.nom === req.params.name)
   if(!student)
     res.status(404).send(`student Not Found,`)
   
   res.send(student)

})


 // finding the student's  best and lowest grade
router.get('/modules/moy',(req,res) =>{
     
  
      const result = students.map((student) => {
        const modules = student.modules;
        const maxNote = Math.max(...modules.map((m) => m.note));
        const minNote = Math.min(...modules.map((m) => m.note));
        return {
          nom: student.nom,
          classe: student.classe,
          Meilleur_Note: maxNote,
          Faible_Note: minNote,
        };
    
      
    });
    res.json(result);
})
  


// adding an student
 router.post('', (req,res) =>{

      let validation = student_validation_post.validate(req.body);
      if(validation.error)
         return res.status(400).send(validation.error.message)
      let student = {
            nom: req.body.nom,
            classe: req.body.classe,
            modules: req.body.modules
        
      };
      student.moyenne = (student.modules[0].note + student.modules[1].note + student.modules[2].note)/3
      students.push(student)
      res.send(students)
})

 // updating an student
router.put('/:name',(req,res) =>{
     let validation_update = student_validation_update.validate(req.body);
     if(validation_update.error)
        return res.status(400).send(validation_update.error.message)
     let student = students.find(std => std.nom === req.params.name)
     if(!student)
        return res.status(404).send('Student Not Found')
     if(req.body.nom)
        student.nom = req.body.nom;
     if(req.body.classe)
        student.classe = req.body.classe;
     if(req.body.modules)
        student.modules = req.body.modules;
    res.status(200).send(student);


})

// deleting student by Name
router.delete('/:stdName',(req,res) =>{

        let student = students.find(std => std.nom === req.params.stdName)
        if(!student)
          return res.status(404).send('Student Not Found')
        students = students.filter(std => std.nom !== req.params.stdName);
        res.send(students);



})
// listing all student's average
router.get('/average/list',(req,res) =>{
   const result = students.map((student) => {
      return {
        
        nom: student.nom,
        classe: student.classe,
        Moyenne: student.moyenne
       
      };   
  });
  res.json(result);
})


// Listing class's average

router.get('/average/moy_gen',(req,res) => {
   const result = students.map(student => student.moyenne).reduce((prev,cur) => (prev + cur)/students.length,0)
      res.send(`la moyenne generale de la classe est : ${result}`)
 
})




module.exports=router;