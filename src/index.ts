import { copyToClipboardWithSpawn } from '@/clipboard'
import { queryGPT4 } from '@/gpt4'
import { type OptionTargetOnly, type OptionWithCount } from '@/option'
import { create } from '@/optionFactory'
import { isPromptTemplateDefault, selectTemplate } from '@/template'

const args = Bun.argv.slice(2)
if (args.length < 2) {
  throw new Error('引数を指定してください。')
}
const keyword = args.shift() ?? ''
const doNotExecute = ['-n', '-nv', '-vn'].includes(args[0])
const isVerbose = ['-nv', '-vn'].includes(args[0])
if (doNotExecute || isVerbose) {
  args.shift()
}
const template = selectTemplate(keyword)
const option = create(keyword, args.join(' '), template)
const prompt = isPromptTemplateDefault(template)
  ? template.getPrompt(option as OptionTargetOnly, isVerbose)
  : template.getPrompt(option as OptionWithCount, isVerbose)
console.log('prompt: ', prompt)

if (doNotExecute || isVerbose) {
  copyToClipboardWithSpawn(prompt)
} else {
  queryGPT4(prompt).then((response) => {
    console.log(response)
    copyToClipboardWithSpawn(response)
  })
}
