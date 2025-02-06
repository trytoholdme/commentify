module.exports = {
  apps: [{
    name: 'commentify',
    script: 'npm',
    args: 'run dev',
    env: {
      NODE_ENV: 'development'
    },
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100
  }]
};