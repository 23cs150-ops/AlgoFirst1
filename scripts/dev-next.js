const net = require('net');
const { spawn } = require('child_process');
const nextBin = require.resolve('next/dist/bin/next');

const BASE_PORT = 4028;
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

async function main() {
  const port = await findPort(BASE_PORT);

  if (port !== BASE_PORT) {
    console.log(`Port ${BASE_PORT} is busy, using ${port} instead.`);
  }

  const child = spawn(process.execPath, [nextBin, 'dev', '-p', String(port)], {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(1);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
