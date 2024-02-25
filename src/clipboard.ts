import { spawn } from 'child_process'

export const copyToClipboardWithSpawn = (text: string): void => {
  const escapedText = text.replace(/`/g, '``').replace(/"/g, '`"').replace(/'/g, "''")
  const command = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText('${escapedText}')`

  const ps = spawn('powershell.exe', ['-command', command])

  ps.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  ps.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  ps.on('close', (code) => {
    if (code === 0) {
      console.log('クリップボードにコピーしました。')
    } else {
      console.error(`プロセスが終了コード ${code} で終了しました`)
    }
  })
}
