const getBabyNameModel = require('../models/BabyName');

// Minimal seeding utility to populate a few names if collection is empty
const seedBabyNames = async () => {
  const BabyName = getBabyNameModel();
  const count = await BabyName.countDocuments();
  if (count > 0) return { inserted: 0 };

  const sample = [
    { name: 'Anushka', gender: 'girl', meaning: 'Grace; lightning; divine blessing', popularity: 95 },
    { name: 'Kaweesha', gender: 'girl', meaning: 'Sweet poem; intelligent', popularity: 80 },
    { name: 'Tharushi', gender: 'girl', meaning: 'Charming and courageous', popularity: 92 },
    { name: 'Nimaya', gender: 'girl', meaning: 'Pure, divine, humble', popularity: 88 },
    { name: 'Dinura', gender: 'boy', meaning: 'Bright like the sun', popularity: 86 },
    { name: 'Senali', gender: 'girl', meaning: 'Lightning that illuminates the sky', popularity: 90 },
    { name: 'Aarav', gender: 'boy', meaning: 'Peaceful; calm', popularity: 99 },
    { name: 'Ishan', gender: 'boy', meaning: 'Sun; lord', popularity: 91 },
    { name: 'Sahan', gender: 'boy', meaning: 'Patience; tolerance', popularity: 85 },
    { name: 'Ama', gender: 'neutral', meaning: 'Timeless; born on Saturday (regional)', popularity: 70 }
  ];

  const result = await BabyName.insertMany(sample);
  return { inserted: result.length };
};

module.exports = { seedBabyNames };

