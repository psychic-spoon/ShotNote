const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Note Model
require('../models/Note');
const Note = mongoose.model('notes');

//Add Note Form
router.get('/add',(req,res)=>{
    res.render('notes/add');
});

//Edit Note
router.get('/edit/:id',(req,res)=>{
    Note.findOne({
        _id:req.params.id
    })
    .then(note =>{
        res.render('notes/edit',{
            note:note
        });
    })   
});


//Edit Form
router.put('/:id',(req,res)=>{
    Note.findOne({
        _id: req.params.id
    })
    .then(note => {
        note.title = req.body.title;
        note.details = req.body.details;

        note.save()
        .then(note =>{
            req.flash('success_msg','Note updated');
            res.redirect('/notes');
        })
    });
});

//Delete Request
router.delete('/:id',(req,res)=>{
    Note.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','Note deleted');
        res.redirect('/notes');
    });
});

//Process Form
router.post('/',(req,res)=>{
    let err = [];
    if(!req.body.title){
        err.push({text:'Please add Title'});
    }
    if(!req.body.details){
        err.push({text:'Details required'});
    }
    if(err.length>0){
        res.render('notes/add',{
            title:req.body.title,
            details:req.body.details,
            errors: err
        });
    }else{
        const newUser = {
            title:req.body.title,
            details:req.body.details
        };
        new Note(newUser)
        .save()
        .then(note => {
            req.flash('success_msg','Note saved');
            res.redirect('/notes');
        })
    }
})

//Display Idea
router.get('/',(req,res)=>{
    Note.find({})
    .sort({date:'desc'})
    .then(notes => {
        res.render('notes/index',{
            notes: notes
        });
    });
    
})

module.exports = router;
