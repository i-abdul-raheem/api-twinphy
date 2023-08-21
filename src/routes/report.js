const express= require('express');
const router= require('express').Router();
const {Post}=require('../handlers/Post');

const handler= new Post();
router.post('/:post_id', handler.reportPost);
module.exports={reports: router};


