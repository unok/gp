import type { Option, OptionTargetOnly, OptionWithCount } from '@/option'
import type { OptionalTypeNode } from 'typescript'

const isOptionWithCount = (option: Option): option is OptionWithCount => {
  return 'count' in option
}

type PromptTemplateDefault = {
  type: 'default'
  keywordPattern: RegExp
  outputFormat: string | undefined
  getPrompt: (option: OptionTargetOnly, isVerbose: boolean) => string
}

type PromptTemplateWithCount = {
  type: 'withCount'
  keywordPattern: RegExp
  outputFormat: string | undefined
  getPrompt: (option: OptionWithCount, isVerbose: boolean) => string
}

export const isPromptTemplateDefault = (template: PromptTemplate): template is PromptTemplateDefault => {
  return template.type === 'default'
}

export type PromptTemplate = PromptTemplateDefault | PromptTemplateWithCount

const templates: PromptTemplate[] = [
  {
    type: 'default',
    keywordPattern: /^e$/,
    outputFormat: undefined,
    getPrompt: (option: OptionTargetOnly, isVerbose: boolean) => {
      return `最後に指定した翻訳対象の文章を英語に翻訳してください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      手順は以下の様に行ってください。
      1. 5個以上の翻訳結果を作る
      2. 翻訳結果を英語に戻し意味が変わっていれば除外する
      3. 残った中から一番一般的な表現を選ぶ

      翻訳対象:
      ${option.target}`
    },
  },
  {
    type: 'default',
    keywordPattern: /^j$/,
    outputFormat: undefined,
    getPrompt: (option: OptionTargetOnly, isVerbose: boolean) => {
      return `最後に指定した翻訳対象の文章を日本語に翻訳してください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      手順は以下の様に行ってください。
      1. 5個以上の翻訳結果を作る
      2. 翻訳結果を日本語に戻し意味が変わっていれば除外する
      3. 残った中から一番一般的な表現を選ぶ

      翻訳対象:
      ${option.target}`
    },
  },
  {
    type: 'default',
    keywordPattern: /^itj?$/,
    outputFormat: undefined,
    getPrompt: (option: OptionTargetOnly, isVerbose: boolean) => {
      return `あなたは、プログラミングやAPIのドキュメントを日本語に翻訳するエキスパートです。
      最後に指定した翻訳対象の技術文書を日本語に翻訳してください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      技術の名前と思われる単語は、無理に翻訳せずにそのままにしてください。
      手順は以下の様に行ってください。
      1. 5個以上の翻訳結果を作る
      2. 翻訳結果を日本語に戻し意味が変わっていれば除外する
      3. 残った中から一番一般的な表現を選ぶ

      翻訳対象:
      ${option.target}`
    },
  },
  {
    type: 'withCount',
    keywordPattern: /^func?([0-9]+)?$/,
    outputFormat: undefined,
    getPrompt: (option: OptionWithCount, isVerbose: boolean) => {
      if (!isOptionWithCount(option)) {
        throw new Error('OptionWithCountではありません。')
      }
      return `最後に指定した説明に合致するようなキャメルケースの関数名を考えてください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      手順は以下のように行ってください。
      1. 候補をできるだけリストアップ
      2. 候補が元の意味の関数として解釈できないものを除去
      3. 一般的に使われている順番で並べ替える
      4. 一般的な順番に${option.count}個だけに絞る
      5. 結果をカンマ区切りで一行にする
      
      関数の説明:
      ${option.target}`
    },
  },
  {
    type: 'withCount',
    keywordPattern: /^abbr?([0-9]+)?$/,
    outputFormat: undefined,
    getPrompt: (option: OptionWithCount, isVerbose: boolean) => {
      if (!isOptionWithCount(option)) {
        throw new Error('OptionWithCountではありません。')
      }
      return `あなたはITのテクニカルライターです。最後に指定した言葉の省略前の単語を考えてください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      手順は以下のように行ってください。
      1. 候補をできるだけリストアップ
      2. 候補が指定した略語として使われないものを削除
      3. IT界隈で使われている順番で並べ替える
      4. 先頭から${option.count}個だけに絞る
      5. 結果をカンマ区切りで一行にする
      
      略語の説明:
      ${option.target}`
    },
  },
  {
    type: 'default',
    keywordPattern: /^c$/,
    outputFormat: undefined,
    getPrompt: (option: OptionTargetOnly, isVerbose: boolean) => {
      return `あなたは凄腕のプログラマーです。最後に指定した内容を、コミットメッセージに入れるための簡潔な英語にしてください。
      ${!isVerbose ? 'ただし解説や思考過程などは必要ないので、最後の手順の結果のみを返してください。' : ''}
      手順は以下のように行ってください。
      1. 候補をできるだけリストアップ
      2. 候補を日本語に変換した場合に意味が違うものを除去
      3. 一番一般的な結果を選ぶ
      
      翻訳対象:
      ${option.target}`
    },
  },
]

export const selectTemplate = (keyword: string): PromptTemplate => {
  const template = templates.find((template) => {
    return template.keywordPattern.test(keyword)
  })

  if (template === undefined) {
    throw new Error('テンプレートが見つかりませんでした。')
  }

  return template
}
