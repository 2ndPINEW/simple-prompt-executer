type Prompt = {
  readonly prompt: string;
  readonly exampleDescription?: string;
  readonly response: {
    readonly [key: string]: {
      readonly description: string;
      readonly example: string;
    };
  };
};

declare const fetch: any;

/**
 * Promptを実行するクラスです
 * OpenAI APIを使用します
 */
export class PromptExecuter {
  openAiApiKey: string;
  modelName: string;

  constructor(opt: { openAiApiKey: string; modelName?: string }) {
    this.openAiApiKey = opt.openAiApiKey;
    this.modelName = opt.modelName ?? "gpt-3.5-turbo";
  }

  private async fetchApi(prompt: string) {
    const body = {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: this.modelName,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiApiKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("OpenAI API error");
    }

    const json = await res.json();
    return json.choices[0].message.content;
  }

  /**
   * Promptを実行します
   *
   * Promptの例です
   * const prompt = {
  prompt: `以下の文章から4択クイズを考えてください。`,
  exampleDescription: "パンをテーマにクイズを考えた例です。",
  response: {
    question: {
      example: "パンはパンでも食べられないパンはなんだ",
      description: "クイズの問題",
    },
    selection: {
      example: "フライパン, AI, パンダ, パン粉",
      description: "選択肢",
    },
    answer: {
      example: "パン",
      description: "答え",
    },
  },
} as const;
   */
  async execute<T extends Prompt>(
    prompt: T
  ): Promise<{ [k in keyof T["response"]]: string }> {
    const promptString = makePromptString(prompt);
    const res = await this.fetchApi(promptString);
    const result = parsePrompt(prompt, res);
    return result;
  }
}

const makeResultLines = (llmResponse: string, prompt: Prompt) => {
  const resultLines = llmResponse.split("\n");
  const tmp: string[] = [];
  resultLines.forEach((line) => {
    if (
      Object.keys(prompt.response).some((key) => line.startsWith(`${key}: `))
    ) {
      tmp.push(line);
    } else if (tmp.length > 0) {
      tmp[tmp.length - 1] += `\n${line}`;
    }
  });
  return tmp;
};

/**
 * 実行結果の文字列をPrompt通りの型になるように変換します
 */
export const parsePrompt = <T extends Prompt>(
  prompt: T,
  llmResponse: string
): { [k in keyof T["response"]]: string } => {
  const resultLines = makeResultLines(llmResponse, prompt);
  const response = {} as { [k in keyof T["response"]]: string };
  Object.keys(prompt.response).forEach((key) => {
    const line = resultLines.find((line: string) =>
      line.startsWith(`${key}: `)
    );
    if (!line) {
      throw new Error("Invalid llm response format");
    }
    (response[key] as any) = line.replace(`${key}: `, "");
  });
  return response;
};

/**
 * Promptを文字列に変換します
 */
export const makePromptString = (prompt: Prompt): string => {
  const responseFormats = Object.keys(prompt.response)
    .map((key) => {
      return `${key}: ${prompt.response[key].description}`;
    })
    .join("\n");
  const exampleFormats = Object.keys(prompt.response)
    .map((key) => {
      return `${key}: ${prompt.response[key].example}`;
    })
    .join("\n");

  return `${prompt.prompt}

[以下のフォーマットで回答してください]
\`\`\`
${responseFormats}
\`\`\`

[例]${prompt.exampleDescription ? `\n${prompt.exampleDescription}` : ""}
\`\`\`
${exampleFormats}
\`\`\``;
};
