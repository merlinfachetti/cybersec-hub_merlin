const MIN_MAJOR = 22;
const MIN_MINOR = 12;

function fail(message) {
  console.error(message);
  process.exit(1);
}

const [majorRaw = '0', minorRaw = '0'] = process.versions.node.split('.');
const major = Number(majorRaw);
const minor = Number(minorRaw);

const isSupported =
  major > MIN_MAJOR || (major === MIN_MAJOR && minor >= MIN_MINOR);

if (!isSupported) {
  fail(
    [
      '',
      `Unsupported Node.js version: ${process.versions.node}`,
      `This project requires Node.js >= ${MIN_MAJOR}.${MIN_MINOR}.0 because Prisma 7 and the current build stack depend on it.`,
      'Use the project runtime before installing or building:',
      '  source ~/.nvm/nvm.sh',
      '  nvm use 22.19.0',
      'If you do not have it installed yet:',
      '  nvm install 22.19.0',
      '',
    ].join('\n')
  );
}

console.log(`Node.js version ok: ${process.versions.node}`);
