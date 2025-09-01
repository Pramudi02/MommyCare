const mongoose = require('mongoose');
require('dotenv').config();

// Import the BabyGrowth model
const getBabyGrowthModel = require('./src/models/BabyGrowth');

// Realistic growth data for Jithmi (female baby)
// Based on WHO growth standards for girls 0-2 years
const monthlyMeasurements = [
  // November 2022 - 2 months old
  { date: '2022-11-01', weight: 4.8, height: 58.0, headCircumference: 38.5, notes: 'Monthly checkup - 2 months' },
  
  // December 2022 - 3 months old
  { date: '2022-12-01', weight: 5.4, height: 60.5, headCircumference: 39.8, notes: 'Monthly checkup - 3 months' },
  
  // January 2023 - 4 months old
  { date: '2023-01-01', weight: 5.9, height: 62.8, headCircumference: 40.9, notes: 'Monthly checkup - 4 months' },
  
  // February 2023 - 5 months old
  { date: '2023-02-01', weight: 6.3, height: 64.8, headCircumference: 41.8, notes: 'Monthly checkup - 5 months' },
  
  // March 2023 - 6 months old
  { date: '2023-03-01', weight: 6.7, height: 66.5, headCircumference: 42.6, notes: 'Monthly checkup - 6 months' },
  
  // April 2023 - 7 months old
  { date: '2023-04-01', weight: 7.1, height: 68.0, headCircumference: 43.3, notes: 'Monthly checkup - 7 months' },
  
  // May 2023 - 8 months old
  { date: '2023-05-01', weight: 7.4, height: 69.3, headCircumference: 43.9, notes: 'Monthly checkup - 8 months' },
  
  // June 2023 - 9 months old
  { date: '2023-06-01', weight: 7.7, height: 70.5, headCircumference: 44.4, notes: 'Monthly checkup - 9 months' },
  
  // July 2023 - 10 months old
  { date: '2023-07-01', weight: 8.0, height: 71.6, headCircumference: 44.8, notes: 'Monthly checkup - 10 months' },
  
  // August 2023 - 11 months old
  { date: '2023-08-01', weight: 8.3, height: 72.6, headCircumference: 45.2, notes: 'Monthly checkup - 11 months' },
  
  // September 2023 - 12 months old
  { date: '2023-09-01', weight: 8.6, height: 73.5, headCircumference: 45.5, notes: 'Monthly checkup - 12 months (1 year)' },
  
  // October 2023 - 13 months old
  { date: '2023-10-01', weight: 8.9, height: 74.3, headCircumference: 45.8, notes: 'Monthly checkup - 13 months' },
  
  // November 2023 - 14 months old
  { date: '2023-11-01', weight: 9.2, height: 75.0, headCircumference: 46.1, notes: 'Monthly checkup - 14 months' },
  
  // December 2023 - 15 months old
  { date: '2023-12-01', weight: 9.5, height: 75.7, headCircumference: 46.3, notes: 'Monthly checkup - 15 months' },
  
  // January 2024 - 16 months old
  { date: '2024-01-01', weight: 9.8, height: 76.3, headCircumference: 46.5, notes: 'Monthly checkup - 16 months' },
  
  // February 2024 - 17 months old
  { date: '2024-02-01', weight: 10.1, height: 76.9, headCircumference: 46.7, notes: 'Monthly checkup - 17 months' },
  
  // March 2024 - 18 months old
  { date: '2024-03-01', weight: 10.4, height: 77.4, headCircumference: 46.9, notes: 'Monthly checkup - 18 months' },
  
  // April 2024 - 19 months old
  { date: '2024-04-01', weight: 10.7, height: 77.9, headCircumference: 47.1, notes: 'Monthly checkup - 19 months' },
  
  // May 2024 - 20 months old
  { date: '2024-05-01', weight: 11.0, height: 78.4, headCircumference: 47.3, notes: 'Monthly checkup - 20 months' },
  
  // June 2024 - 21 months old
  { date: '2024-06-01', weight: 11.3, height: 78.9, headCircumference: 47.5, notes: 'Monthly checkup - 21 months' },
  
  // July 2024 - 22 months old
  { date: '2024-07-01', weight: 11.6, height: 79.3, headCircumference: 47.7, notes: 'Monthly checkup - 22 months' },
  
  // August 2024 - 23 months old
  { date: '2024-08-01', weight: 11.9, height: 79.7, headCircumference: 47.9, notes: 'Monthly checkup - 23 months' },
  
  // September 2024 - 24 months old
  { date: '2024-09-01', weight: 12.2, height: 80.1, headCircumference: 48.1, notes: 'Monthly checkup - 24 months (2 years)' },
  
  // October 2024 - 25 months old
  { date: '2024-10-01', weight: 12.5, height: 80.5, headCircumference: 48.3, notes: 'Monthly checkup - 25 months' },
  
  // November 2024 - 26 months old
  { date: '2024-11-01', weight: 12.8, height: 80.9, headCircumference: 48.5, notes: 'Monthly checkup - 26 months' },
  
  // December 2024 - 27 months old
  { date: '2024-12-01', weight: 13.1, height: 81.3, headCircumference: 48.7, notes: 'Monthly checkup - 27 months' }
];

async function addJithmiData() {
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
    console.log('\n📈 Adding monthly measurements...');
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const measurement of monthlyMeasurements) {
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
    
    console.log('\n🎉 Data addition completed!');
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
console.log('🚀 Starting Jithmi data addition script...');
console.log('📅 Adding monthly measurements from November 2022 to December 2024');
console.log('📊 Using realistic WHO growth standards for girls 0-2 years');
console.log('');

addJithmiData();


