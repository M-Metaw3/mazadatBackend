const express = require('express');
const subcategoryController = require('../controllers/selectedthinginapp/subcategoryControllerselected');

const router = express.Router();

router.get('/selected', subcategoryController.getSelectedSubcategories);
router.get('/search', subcategoryController.search);

router.patch('/:id/slider', subcategoryController.updateSubcategorySlider);

module.exports = router;
