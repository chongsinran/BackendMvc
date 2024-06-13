const cluster = require('cluster');
const os = require('os');
const Logger = require('./utils/logUtils.js');
const logger = new Logger();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  logger.log(`Master ${process.pid} is running`, 'info');
  logger.log(`Forking for ${numCPUs} CPUs`, 'info');

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.log(`Worker ${worker.process.pid} died`, 'error');
    logger.log('Starting a new worker', 'info');
    cluster.fork();
  });
} else {
  require('./server');
}
