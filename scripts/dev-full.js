const net = require('net');
const { spawn } = require('child_process');
const nextBin = require.resolve('next/dist/bin/next');

const FRONTEND_BASE_PORT = 4028;
const BACKEND_PORT = 5000;
const MAX_PORT = 4999;

function isPortFree(port) {
  return new Promise((resolve) => {
    const checkHost = (host) =>
      new Promise((hostResolve) => {
        const socket = net.createConnection({ port, host });
        const finish = (result) => {
          socket.destroy();
          hostResolve(result);
        };

        socket.setTimeout(200);
        socket.once('connect', () => finish(false));
        socket.once('timeout', () => finish(true));
        socket.once('error', () => finish(true));
      });

    Promise.all([checkHost('127.0.0.1'), checkHost('::1')]).then((results) => {
      resolve(results.every(Boolean));
    });
  });
}

async function findPort(startPort) {
  for (let port = startPort; port <= MAX_PORT; port += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error(`No free port found between ${startPort} and ${MAX_PORT}.`);
}

function spawnProcess(command, args, env = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      ...env,
    },
  });
}

async function main() {
  const frontendPort = await findPort(FRONTEND_BASE_PORT);

  if (frontendPort !== FRONTEND_BASE_PORT) {
    console.log(`Port ${FRONTEND_BASE_PORT} is busy, using ${frontendPort} instead.`);
  }

  const backendFree = await isPortFree(BACKEND_PORT);
  let backendProcess = null;

  if (backendFree) {
    backendProcess = spawnProcess('node', ['server/server.js']);
  } else {
    console.log(`Backend port ${BACKEND_PORT} is already in use, reusing the existing backend.`);
  }

  const frontendProcess = spawn(process.execPath, [nextBin, 'dev', '-p', String(frontendPort)], {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      PORT: String(frontendPort),
    },
  });

  const shutdown = () => {
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill();
    }

    if (!frontendProcess.killed) {
      frontendProcess.kill();
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  frontendProcess.on('exit', (code, signal) => {
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill();
    }

    if (signal) {
      process.exit(1);
      return;
    }

    process.exit(code ?? 0);
  });

  if (backendProcess) {
    backendProcess.on('exit', (code, signal) => {
      if (signal) {
        process.exit(1);
        return;
      }

      if (code && code !== 0) {
        process.exit(code);
      }
    });
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});