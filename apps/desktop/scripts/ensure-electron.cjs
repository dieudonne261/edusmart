const childProcess = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const electronPackagePath = require.resolve('electron/package.json')
const electronRoot = path.dirname(electronPackagePath)
const electronVersion = require(electronPackagePath).version
const platform = os.platform()
const arch = os.arch()
const executableName =
  platform === 'win32'
    ? 'electron.exe'
    : platform === 'darwin'
      ? 'Electron.app/Contents/MacOS/Electron'
      : 'electron'

const pathFile = path.join(electronRoot, 'path.txt')
const executablePath = path.join(electronRoot, 'dist', executableName)

function hasElectronBinary() {
  return fs.existsSync(pathFile) && fs.existsSync(executablePath)
}

function runOfficialInstall() {
  const installScript = path.join(electronRoot, 'install.js')

  childProcess.execFileSync(process.execPath, [installScript], {
    env: {
      ...process.env,
      ELECTRON_SKIP_BINARY_DOWNLOAD: '',
    },
    stdio: 'inherit',
  })
}

function repairFromWindowsCache() {
  if (platform !== 'win32') {
    return
  }

  const localAppData = process.env.LOCALAPPDATA

  if (!localAppData) {
    return
  }

  const cachedZip = path.join(
    localAppData,
    'electron',
    'Cache',
    `electron-v${electronVersion}-${platform}-${arch}.zip`,
  )

  if (!fs.existsSync(cachedZip)) {
    return
  }

  const distPath = path.join(electronRoot, 'dist')
  fs.rmSync(distPath, { force: true, recursive: true })
  fs.mkdirSync(distPath, { recursive: true })

  childProcess.execFileSync('tar', ['-xf', cachedZip, '-C', distPath], {
    stdio: 'inherit',
  })

  fs.writeFileSync(pathFile, executableName)
}

if (!hasElectronBinary()) {
  runOfficialInstall()
}

if (!hasElectronBinary()) {
  repairFromWindowsCache()
}

if (!hasElectronBinary()) {
  throw new Error(
    'Electron binary is missing. Run `pnpm install --force --prefer-offline` from the repository root.',
  )
}
