import { rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'

const nextDir = path.join(process.cwd(), '.next')

try {
  rmSync(nextDir, { recursive: true, force: true })
} catch {
  // Ignore cleanup failures; Next can still attempt startup.
}

const isWindows = process.platform === 'win32'
const command = isWindows
  ? path.join(process.cwd(), 'node_modules', '.bin', 'next.cmd')
  : path.join(process.cwd(), 'node_modules', '.bin', 'next')

const child = spawn(command, ['dev'], {
  stdio: 'inherit',
  shell: isWindows,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
