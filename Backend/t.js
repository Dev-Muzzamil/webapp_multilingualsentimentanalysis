// testFirestoreNamedDb.js
// This script tests Firestore connectivity to a named database (`mllsa`) in project `qualified-sun-448917-k5`.
// Place your service account key as key.json in the same directory, or update the path accordingly.

const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// Optionally, require service account for authentication if running outside GCP environments
let firestoreOptions = {
  projectId: 'qualified-sun-448917-k5',
  databaseId: 'mllsa',
};

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');
  firestoreOptions.keyFilename = serviceAccountPath;
} catch (e) {
  // If key.json is not present, will try application default creds.
  console.warn('No key.json found, using default credentials if available.');
}

const firestore = new Firestore(firestoreOptions);

async function testFirestore() {
  try {
    // Write test
    const docRef = firestore.collection('environmentTest').doc('envDoc');
    await docRef.set({
      message: 'Hello from Firestore named DB!',
      checkedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'NODE_ENV not set',
      platform: process.platform,
    });

    // Read test
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('❌ No such document found!');
    } else {
      console.log('✅ Document data:', doc.data());
    }

    // List collections for extra verification
    const collections = await firestore.listCollections();
    console.log('Available top-level collections in this DB:', collections.map(col => col.id));
  } catch (err) {
    console.error('Firestore error:', err);
  }
}

testFirestore();