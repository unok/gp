import OpenAI from 'openai'

export const queryGPT4 = async (prompt: string): Promise<string> => {
  const apiKey = Bun.env.OPENAI_API_KEY
  const configuration = {
    apiKey: apiKey,
  }
  const openai = new OpenAI(configuration)

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('Error querying GPT-4:', error)
    return 'エラーが発生しました。'
  }
}
