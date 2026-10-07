// Test script for Sponsor form submission
// Using built-in fetch API (requires Node.js v18+)

// Form submission URL
const FORM_URL = 'https://script.google.com/macros/s/AKfycbzzQZ0zYjbjJRppNKz7YOmeGpSAEGvhv3jCXaOhDo5xGJg5gdPxcZLZcxrosa5rCkqw5w/exec';

// Test data
const testData = {
  fullName: 'Test Sponsor',
  company: 'Test Company',
  email: 'sponsor@example.com',
  phone: '987-654-3210',
  interest: 'Tournament Sponsorship',
  message: 'This is a test submission for the sponsor form. Please ignore.'
};

async function testSponsorForm() {
  console.log('Testing Sponsor form submission...');
  console.log('Submitting data:', testData);
  
  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    console.log('Response:', result);
    
    if (result.success) {
      console.log('✅ Test passed! Form submission successful.');
    } else {
      console.log('❌ Test failed! Form submission unsuccessful.');
      console.log('Error message:', result.message);
    }
  } catch (error) {
    console.log('❌ Test failed with exception:');
    console.error(error);
  }
}

// Run the test
testSponsorForm();
