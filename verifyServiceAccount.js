const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, 'pushnotificationsmazadat-02cb5c537c44.json');
console.log('Checking service account path:', serviceAccountPath);

if (fs.existsSync(serviceAccountPath)) {
  console.log('Service account file exists.');
} else {
  console.error('Service account file does not exist.');
}
