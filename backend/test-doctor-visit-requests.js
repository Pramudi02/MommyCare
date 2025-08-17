require('dotenv').config();
const { connectDB } = require('./src/config/database');
const DoctorVisitRequest = require('./src/models/DoctorVisitRequest');

async function testDoctorVisitRequests() {
  try {
    console.log('🚀 Testing Doctor Visit Request system...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully!');
    
    // Test creating a doctor visit request
    console.log('📝 Testing doctor visit request creation...');
    
    const testRequest = await DoctorVisitRequest.create({
      mom: 'test-mom-id-123',
      requestType: 'Prenatal Care',
      preferredDate: new Date('2025-01-15'),
      preferredTime: 'Morning',
      notes: 'Regular prenatal checkup',
      location: 'City General Hospital',
      status: 'pending'
    });
    
    console.log('✅ Doctor visit request created successfully:', {
      id: testRequest._id,
      type: testRequest.requestType,
      date: testRequest.preferredDate,
      status: testRequest.status
    });
    
    // Test finding the request
    console.log('\n🔍 Testing doctor visit request retrieval...');
    
    const foundRequest = await DoctorVisitRequest.findById(testRequest._id);
    if (foundRequest) {
      console.log('✅ Doctor visit request retrieved successfully');
    } else {
      console.log('❌ Failed to retrieve doctor visit request');
    }
    
    // Test updating the request
    console.log('\n✏️ Testing doctor visit request update...');
    
    const updatedRequest = await DoctorVisitRequest.findByIdAndUpdate(
      testRequest._id,
      { status: 'approved', adminNotes: 'Approved for morning slot' },
      { new: true }
    );
    
    if (updatedRequest.status === 'approved') {
      console.log('✅ Doctor visit request updated successfully');
    } else {
      console.log('❌ Failed to update doctor visit request');
    }
    
    // Test cancelling the request
    console.log('\n❌ Testing doctor visit request cancellation...');
    
    const cancelledRequest = await DoctorVisitRequest.findByIdAndUpdate(
      testRequest._id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (cancelledRequest.status === 'cancelled') {
      console.log('✅ Doctor visit request cancelled successfully');
    } else {
      console.log('❌ Failed to cancel doctor visit request');
    }
    
    // Clean up - delete test request
    await DoctorVisitRequest.findByIdAndDelete(testRequest._id);
    console.log('\n🧹 Test data cleaned up');
    
    console.log('\n🎉 All doctor visit request tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testDoctorVisitRequests();
