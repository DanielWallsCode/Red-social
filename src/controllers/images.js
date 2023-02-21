const path = require('path');
const { response } = require("express");
const { ramdonNumber } = require('../helpers/libs');
const { Image,Comment } = require('../models');
const fs = require('fs-extra');
const { rmSync } = require('fs');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');

const control = {}

control.index = async(req, res = response) => {
    let viewModel = { image: {}, comments: [] };

  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  // if image does not exists
  if (!image) return next(new Error("Image does not exists"));

  // increment views
  const updatedImage = await Image.findOneAndUpdate(
    { _id: image.id },
    { $inc: { views: 1 } }
  ).lean();

  viewModel.image = updatedImage;

  // get image comments
  const comments = await Comment.find({ image_id: image._id }).sort({
    timestamp: 1,
  }).lean();

  viewModel.comments = comments;
  viewModel = await sidebar(viewModel);

  console.log(viewModel);
  res.render("image", viewModel);
};

control.create = async (req, res = response) => {

    const saveImage = async () => {

        const imgURL = ramdonNumber();
        const images = await Image.find({ filename: imgURL });
        if (images.length > 0) {
            saveImage();
        }else{
            console.log(imgURL);
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLocaleLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`);
    
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImg = new Image({
                    titulo: req.body.title,
                    filename: imgURL + ext,
                    descripcion: req.body.description
                });
    
                const imageSaved = await newImg.save();
                res.redirect('/images/'+imgURL);
            } else {
                await fs.unlink(imageTempPath);
                rmSync.status(400).json({
                    msg: 'Formato de imagen no soportado'
                })
            }
        }
    };

    saveImage();

};

control.like = async(req, res = response) => {
    const image = await Image.findOne({
        filename: { $regex: req.params.image_id },
      });
      console.log(image);
      if (image) {
        image.likes = image.likes + 1;
        await image.save();
        res.json({ likes: image.likes });
      } else {
        res.status(404).json({ error: "Not Found" });
      }
}

control.comment = async(req, res = response) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image){
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);
    }else{
        res.redirect('/');
    }
}

control.remove = async(req, res = response) => {
   const image = await Image.findOne({filename: {$regex: req.params.image_id}})
   if(image){
        await fs.unlink(path.resolve('./src/public/upload/'+ image.filename));
        await Comment.deleteOne({image_id: image._id});
        await image.remove();
        res.json(true);
   }
}

module.exports = control;