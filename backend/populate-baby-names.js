const mongoose = require('mongoose');
require('dotenv').config();

// Import the BabyName model
const getBabyNameModel = require('./src/models/BabyName');

// New baby names data based on the image
const babyNames = [
  {
    name: 'Arianna',
    gender: 'girl',
    meaning: 'Most holy; Silver; Melody',
    popularity: 95,
    likes: 0
  },
  {
    name: 'Amaya',
    gender: 'girl',
    meaning: 'Heavenly valley; Elevated place; Mother capital; Night rain; End',
    popularity: 88,
    likes: 0
  },
  {
    name: 'Alexandra',
    gender: 'girl',
    meaning: 'Defender or helper of the people',
    popularity: 92,
    likes: 0
  },
  {
    name: 'Ariella',
    gender: 'girl',
    meaning: 'Lioness of God',
    popularity: 87,
    likes: 0
  },
  {
    name: 'Ada',
    gender: 'girl',
    meaning: 'Noble; First-born girl; Island; Adornment; Ornament',
    popularity: 85,
    likes: 0
  },
  {
    name: 'Anastasia',
    gender: 'girl',
    meaning: 'Resurrection; Coming again',
    popularity: 90,
    likes: 0
  },
  {
    name: 'Alani',
    gender: 'girl',
    meaning: 'Little rock; Handsome; Orange tree or orange fruit; Peaceful; Fragrant',
    popularity: 83,
    likes: 0
  },
  {
    name: 'Amy',
    gender: 'girl',
    meaning: 'Beloved; To love',
    popularity: 89,
    likes: 0
  },
  {
    name: 'Aubree',
    gender: 'girl',
    meaning: 'Elf ruler; King of the elves',
    popularity: 86,
    likes: 0
  }
];

async function populateBabyNames() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get the BabyName model
    const BabyName = getBabyNameModel();
    
    // Clear existing baby names collection
    console.log('🗑️  Clearing existing baby names collection...');
    await BabyName.deleteMany({});
    console.log('✅ Existing baby names cleared');
    
    // Insert new baby names
    console.log('📝 Inserting new baby names...');
    const insertedNames = await BabyName.insertMany(babyNames);
    
    console.log('🎉 Baby names populated successfully!');
    console.log(`✅ Added ${insertedNames.length} baby names`);
    
    // Display summary
    console.log('\n📋 Baby Names Summary:');
    insertedNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name.name} (${name.gender}) - ${name.meaning}`);
      console.log(`   Popularity: ${name.popularity}/100, Likes: ${name.likes}`);
    });
    
    // Show collection stats
    const totalNames = await BabyName.countDocuments();
    const girlsCount = await BabyName.countDocuments({ gender: 'girl' });
    const boysCount = await BabyName.countDocuments({ gender: 'boy' });
    
    console.log('\n📊 Collection Statistics:');
    console.log(`Total Names: ${totalNames}`);
    console.log(`Girl Names: ${girlsCount}`);
    console.log(`Boy Names: ${boysCount}`);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
console.log('🚀 Starting Baby Names Population Script...');
console.log('📝 This will replace all existing baby names with the new collection');
console.log('👶 Adding 9 beautiful girl names with meanings and popularity scores');
console.log('');

populateBabyNames();
