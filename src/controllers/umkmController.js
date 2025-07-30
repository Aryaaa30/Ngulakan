const umkmModel = require('../models/umkmModel');

exports.getAll = async (req, res, next) => {
  try {
    const data = await umkmModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await umkmModel.getById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'UMKM not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await umkmModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await umkmModel.update(req.params.id, req.body);
    res.json({ id_umkm: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await umkmModel.delete(req.params.id);
    res.json({ id_umkm: req.params.id });
  } catch (err) {
    next(err);
  }
};
