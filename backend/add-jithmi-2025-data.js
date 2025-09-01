const mongoose = require('mongoose');
require('dotenv').config();

// Import the BabyGrowth model
const getBabyGrowthModel = require('./src/models/BabyGrowth');

// Extended growth data for Jithmi (female baby) - January 2025 to September 2025
// Based on WHO growth standards for girls 2-3 years
const extendedMeasurements = [
  // January 2025 - 28 months old
  { date: '2025-01-01', weight: 13.4, height: 81.7, headCircumference: 48.9, notes: 'Monthly checkup - 28 months' },
  
  // February 2025 - 29 months old
  { date: '2025-02-01', weight: 13.7, height: 82.1, headCircumference: 49.1, notes: 'Monthly checkup - 29 months' },
  
  // March 2025 - 30 months old
  { date: '2025-03-01', weight: 14.0, height: 82.5, headCircumference: 49.3, notes: 'Monthly checkup - 30 months' },
  
  // April 2025 - 31 months old
  { date: '2025-04-01', weight: 14.3, height: 82.9, headCircumference: 49.5, notes: 'Monthly checkup - 31 months' },
  
  // May 2025 - 32 months old
  { date: '2025-05-01', weight: 14.6, height: 83.3, headCircumference: 49.7, notes: 'Monthly checkup - 32 months' },
  
  // June 2025 - 33 months old
  { date: '2025-06-01', weight: 14.9, height: 83.7, headCircumference: 49.9, notes: 'Monthly checkup - 33 months' },
  
  // July 2025 - 34 months old
  { date: '2025-07-01', weight: 15.2, height: 84.1, headCircumference: 50.1, notes: 'Monthly checkup - 34 months' },
  
  // August 2025 - 35 months old
  { date: '2025-08-01', weight: 15.5, height: 84.5, headCircumference: 50.3, notes: 'Monthly checkup - 35 months' },
  
  // September 2025 - 36 months old (3 years!)
  { date: '2025-09-01', weight: 15.8, height: 84.9, headCircumference: 50.5, notes: 'Monthly checkup - 36 months (3 years old!)' }
];

async function addJithmi2025Data() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get the BabyGrowth model
    const BabyGrowth = getBabyGrowthModel();
    
    // Find Jithmi's profile
    console.log('🔍 Looking for Jithmi\'s profile...');
    const jithmiProfile = await BabyGrowth.findOne({ babyName: 'Jithmi' });
    
    if (!jithmiProfile) {
      console.log('❌ Jithmi\'s profile not found! Please create the profile first.');
      return;
    }
    
    console.log(`✅ Found Jithmi's profile: ${jithmiProfile.babyName} (${jithmiProfile.gender})`);
    console.log(`📅 Birth Date: ${jithmiProfile.birthDate.toDateString()}`);
    console.log(`📊 Current measurements: ${jithmiProfile.measurements.length}`);
    
    // Add each monthly measurement
    console.log('\n📈 Adding extended monthly measurements (Jan 2025 - Sep 2025)...');
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const measurement of extendedMeasurements) {
      try {
        // Check if measurement for this date already exists
        const existingMeasurement = jithmiProfile.measurements.find(
          m => m.date.toDateString() === new Date(measurement.date).toDateString()
        );
        
        if (existingMeasurement) {
          console.log(`⏭️  Skipping ${measurement.date} - measurement already exists`);
          skippedCount++;
          continue;
        }
        
        // Add the measurement
        await jithmiProfile.addMeasurement({
          date: new Date(measurement.date),
          weight: measurement.weight,
          height: measurement.height,
          headCircumference: measurement.headCircumference,
          notes: measurement.notes
        });
        
        console.log(`✅ Added ${measurement.date}: ${measurement.weight}kg, ${measurement.height}cm`);
        addedCount++;
        
      } catch (error) {
        console.error(`❌ Error adding measurement for ${measurement.date}:`, error.message);
      }
    }
    
    // Reload the profile to get updated data
    await jithmiProfile.save();
    
    console.log('\n🎉 Extended data addition completed!');
    console.log(`✅ Added: ${addedCount} new measurements`);
    console.log(`⏭️  Skipped: ${skippedCount} existing measurements`);
    console.log(`📊 Total measurements: ${jithmiProfile.measurements.length}`);
    
    // Show final summary
    console.log('\n📋 Final Summary for Jithmi:');
    console.log(`👶 Name: ${jithmiProfile.babyName}`);
    console.log(`🎀 Gender: ${jithmiProfile.gender}`);
    console.log(`📅 Birth Date: ${jithmiProfile.birthDate.toDateString()}`);
    console.log(`📊 Total Measurements: ${jithmiProfile.measurements.length}`);
    console.log(`📈 Date Range: ${jithmiProfile.measurements[0]?.date.toDateString()} to ${jithmiProfile.measurements[jithmiProfile.measurements.length - 1]?.date.toDateString()}`);
    console.log(`🎂 Age Range: 2 months → 3 years (36 months)`);
    
    // Show growth progression
    const firstMeasurement = jithmiProfile.measurements[0];
    const lastMeasurement = jithmiProfile.measurements[jithmiProfile.measurements.length - 1];
    
    if (firstMeasurement && lastMeasurement) {
      const weightGain = (lastMeasurement.weight - firstMeasurement.weight).toFixed(1);
      const heightGain = (lastMeasurement.height - firstMeasurement.height).toFixed(1);
      
      console.log('\n📊 Growth Progression Summary:');
      console.log(`⚖️  Weight: ${firstMeasurement.weight}kg → ${lastMeasurement.weight}kg (+${weightGain}kg)`);
      console.log(`📏 Height: ${firstMeasurement.height}cm → ${lastMeasurement.height}cm (+${heightGain}cm)`);
      console.log(`🔄 Total Growth Period: 3 years of continuous monitoring`);
    }
    
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
console.log('🚀 Starting Jithmi Extended Data Addition Script...');
console.log('📅 Adding monthly measurements from January 2025 to September 2025');
console.log('📊 Using realistic WHO growth standards for girls 2-3 years');
console.log('🎂 This will complete Jithmi\'s growth tracking up to 3 years old!');
console.log('');

addJithmi2025Data();


