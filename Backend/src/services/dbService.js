const db = require('../config/firestore');

async function saveResult(result) {
  const docRef = await db.collection('sentimentResults').add({
    ...result,
    timestamp: new Date()
  });
  return docRef.id;
}

async function getResult(id) {
  const doc = await db.collection('sentimentResults').doc(id).get();
  return doc.exists ? doc.data() : null;
}

module.exports = { saveResult, getResult };