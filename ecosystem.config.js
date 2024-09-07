module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances : 2,
      exec_mode: 'cluster',
      max_memory_restart: '200M',
      error_file: './logs/err.log',
    },
  ],
};

// voici la commande pour lancer : pm2 start ecosystem.config.js

//pour vérifier qu'il est bien installé : pm2 --version