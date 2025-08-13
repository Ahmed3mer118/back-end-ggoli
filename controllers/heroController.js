const Hero = require("../models/hero.model")

exports.getHeroSection = async (req, res) => {
    try {
      let hero = await Hero.findOne();
      if (!hero) {
        hero = await Hero.create({
          title: "Default Title",
          description: "Default Description",
          buttonText: "Shop Now",
          buttonLink: "/products",
          backgroundImage: "/uploads/default.jpg"
        });
      }
      res.json(hero);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.updateHeroSection =  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        buttonText: req.body.buttonText,
        buttonLink: req.body.buttonLink
      };
  
      if (req.file) {
        updateData.backgroundImage = "/uploads/" + req.file.filename;
      }
  
      let hero = await Hero.findOne();
      if (!hero) {
        hero = await Hero.create(updateData);
      } else {
        hero = await Hero.findByIdAndUpdate(hero._id, updateData, { new: true });
      }
  
      res.json(hero);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }