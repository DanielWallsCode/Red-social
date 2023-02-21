const { response } = require("express");
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');
const crtl = {}

crtl.index = async(req,res = response) => {
    try {
        const images = await Image.find()
          .sort({ timestamp: -1 })
          .lean({ virtuals: true });
    
        let viewModel = { images: [] };
        viewModel.images = images;
        viewModel = await sidebar(viewModel);
        res.render("index", viewModel);
      } catch (error) {
        console.log(error);
      }
};



module.exports = crtl;