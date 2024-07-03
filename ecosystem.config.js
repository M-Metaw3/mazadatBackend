// module.exports = {
//     apps: [
//       {
//         name: 'server',
//         script: './server.js',
//         env: {
//           NODE_ENV: 'production',
//           GOOGLE_APPLICATION_CREDENTIALS: '/var/www/mazadatBackend/firebase/pushnotificationsmazadat-02cb5c537c44.json'
//         }
//       }
//     ]
//   };
  

module.exports = {
  apps: [
    {
      name: 'server',
      script: './server.js',
      instances: 1, // Ensure only one instance is running
      exec_mode: 'fork', // Fork mode to avoid clustering issues
      max_restarts: 5, // Limit the number of restarts
      restart_delay: 5000, // Delay between restarts to prevent rapid retries
      env: {
        NODE_ENV: 'production',
        GOOGLE_APPLICATION_CREDENTIALS: '/var/www/mazadatBackend/firebase/pushnotificationsmazadat-02cb5c537c44.json',
        // Include other environment variables if necessary
        SMS_API_URL: process.env.SMS_API_URL,
        SMS_API_USERNAME: process.env.SMS_API_USERNAME,
        SMS_API_PASSWORD: process.env.SMS_API_PASSWORD,
        SMS_API_Env: process.env.SMS_API_Env,
        SMS_API_SENDER: process.env.SMS_API_SENDER,
        SMS_API_TEMPLATE: process.env.SMS_API_TEMPLATE,
      }
    }
  ]
};
