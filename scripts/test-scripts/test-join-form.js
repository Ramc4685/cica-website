// Test script for Join CICA form submission
// Using built-in fetch API (requires Node.js v18+)

// Form submission URL
const FORM_URL = 'https://script.google.com/macros/s/AKfycbxQb0XmO55sW7bJQYz1FKcoewJ-Udh-vCcneMeXs_McXY9QhrigyzMwYbpNJkOCYIJ8/exec';

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '123-456-7890'
};

async function testJoinForm() {
  console.log('Testing Join CICA form submission...');
  console.log('Submitting data:', testData);
  
  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
testJoinForm();
