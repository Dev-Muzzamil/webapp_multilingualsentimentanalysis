const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const projectId = process.env.FIRESTORE_PROJECT_ID || 'default-project';
const databaseId = process.env.FIRESTORE_DATABASE_ID || '(default)';
const keyFilename = process.env.FIRESTORE_KEY_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

const firestoreOptions = {
  projectId,
  databaseId,
};

// Only set keyFilename if available (not needed on GCP)
if (keyFilename) {
  firestoreOptions.keyFilename = path.isAbsolute(keyFilename)
    ? keyFilename
    : path.join(process.cwd(), keyFilename);
}

const db = new Firestore(firestoreOptions);

module.exports = db;