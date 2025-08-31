const BabyName = require('../models/BabyName');

// GET /api/baby-names
exports.list = async (req, res, next) => {
  try {
    const { gender, startsWith, page = 1, limit = 50, search } = req.query;
    const filter = {};

    if (gender && ['girl', 'boy', 'unisex'].includes(gender.toLowerCase())) {
      filter.gender = gender.toLowerCase();
    }

    if (startsWith && /^[A-Z]$/i.test(startsWith)) {
      filter.name = { $regex: `^${startsWith}`, $options: 'i' };
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { meaning: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      BabyName.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)),
      BabyName.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// POST /api/baby-names/bulk
exports.bulkInsert = async (req, res, next) => {
  try {
    const { gender, names } = req.body;
    if (!gender || !['girl', 'boy', 'unisex'].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid gender' });
    }
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ message: 'Names array is required' });
    }

    const docs = names.map((n) => ({ name: n.trim(), gender: gender.toLowerCase(), meaning: null }));

    const result = await BabyName.bulkWrite(
      docs.map((doc) => ({
        updateOne: {
          filter: { name: doc.name, gender: doc.gender },
          update: { $setOnInsert: doc },
          upsert: true
        }
      }))
    );

    res.status(201).json({ message: 'Inserted', result });
  } catch (err) {
    next(err);
  }
};


