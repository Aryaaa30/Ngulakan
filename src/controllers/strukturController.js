const strukturModel = require('../models/strukturModel');

exports.getAll = async (req, res, next) => {
  try {
    const list = await strukturModel.getAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await strukturModel.getById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await strukturModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await strukturModel.update(req.params.id, req.body);
    res.json({ id_struktur: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await strukturModel.delete(req.params.id);
    res.json({ id_struktur: req.params.id });
  } catch (err) {
    next(err);
  }
};
