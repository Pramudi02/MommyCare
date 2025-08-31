/*
 Run with: node backend/src/scripts/seedGirlNames.js
 Requires env MONGODB_URI and JWT_SECRET (per database.js checks)
*/
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const BabyName = require('../models/BabyName');

const girlNames = [
  'Aakithya','Aannya','Abeesha','Abimani','Abimannya','Abishani','AchinThya','Adele','Adishani','Adithi','Agrani','Ahansa','Aharsha','Ahasika','Akarsha','Akeesha','Akenya',
  'Bashini','Basuri','Behansa','Bihakshi','Bihesha','Bilani','Bilanka','Bilesha','Bimalka','Bimalsha','Bimanli','Bimashi','Bimsari','Binadi','Binakshi','Binali','Binari',
  'Chalani','Chalitha','Chaluka','ChalukKya','Chamalika','Chamalsha','Chamalsi','ChamasHa','Chamathi','Chamathka','Chamilka','Chamilki','Chamodhi','Chamothma','Chamuditha','Chandula','Chaneli'
];

async function run() {
  try {
    await connectDB();
    const ops = girlNames.map((name) => ({
      updateOne: {
        filter: { name, gender: 'girl' },
        update: { $setOnInsert: { name, gender: 'girl', meaning: null } },
        upsert: true
      }
    }));
    const result = await BabyName.bulkWrite(ops);
    console.log('Inserted/updated:', result.upsertedCount || 0, 'new names');
    await mongoose.connection.close();
    console.log('Done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();


