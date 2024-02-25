import type { Option } from '@/option'
import { type PromptTemplate, isPromptTemplateDefault } from '@/template'

export const create = (keyword: string, target: string, template: PromptTemplate): Option => {
  if (isPromptTemplateDefault(template)) {
    return {
      target: target,
    }
  }
  const match = keyword.match(template.keywordPattern)
  if (match) {
    return {
      target: target,
      count: parseInt(match[1]),
    }
  }
  return {
    target: target,
    count: 1,
  }
}
