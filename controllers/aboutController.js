const About = require("../models/about.model");

// Get About Section
exports.getAboutSection = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        title: "Default Title",
        subtitle: "Default Subtitle",
        description1: "Default Description 1",
        description2: "Default Description 2",
        image: "/uploads/default.jpg"
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update About Section
exports.updateAboutSection = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      description1: req.body.description1,
      description2: req.body.description2,
    //   features: req.body.features // لو هتعدل المميزات
    };

    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }

    let about = await About.findOne();
    if (!about) {
      about = await About.create(updateData);
    } else {
      about = await About.findByIdAndUpdate(about._id, updateData, { new: true });
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
