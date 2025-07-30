const adminModel = require('../models/adminModel');
const hashHelper = require('../utils/hashHelper');

exports.getAll = async (req, res, next) => {
  try {
    const admins = await adminModel.getAll();
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const admin = await adminModel.getById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { username, password, nama } = req.body;
    const hashed = await hashHelper.hashPassword(password);
    const result = await adminModel.create({ username, password: hashed, nama });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { username, password, nama } = req.body;
    const hashed = password ? await hashHelper.hashPassword(password) : undefined;
    await adminModel.update(req.params.id, {
      username,
      password: hashed,
      nama
    });
    res.json({ id_admin: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await adminModel.delete(req.params.id);
    res.json({ id_admin: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.dashboard = (req, res) => {
    res.render('admin/dashboardAdmin', { user: req.session.user });
};
