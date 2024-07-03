module.exports = {
    apps: [
      {
        name: 'server',
        script: './server.js',
        env: {
          NODE_ENV: 'production',
          GOOGLE_APPLICATION_CREDENTIALS: '/var/www/mazadatBackend/firebase/pushnotificationsmazadat-02cb5c537c44.json'
        }
      }
    ]
  };
  