export type Prompt = {
  prompt: string;
  exampleDescription?: string;
  response: {
    [key: string]: {
      description: string;
      example: string | string[];
    };
  };
};

declare const fetch: any;

/**
 * Promptを実行するクラスです
 * OpenAI APIを使用します
 */
export class PromptExecuter {
  private openAiApiKey: string;
  private modelName: string;

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
   */
  async execute<T extends Prompt>(prompt: T): Promise<{ [k in keyof T["response"]]: string }> {
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
    if (Object.keys(prompt.response).some((key) => line.startsWith(`${key}: `))) {
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
    const line = resultLines.find((line: string) => line.startsWith(`${key}: `));
    if (!line) {
      throw new Error("Invalid llm response format: Invalid key \n\nResponse ->\n" + llmResponse);
    }

    // 配列の時
    if (Array.isArray(prompt.response[key].example)) {
      if (!line.includes(",")) {
        throw new Error("Invalid llm response format: Invalid array format \n\nResponse ->\n" + llmResponse);
      }
      (response[key] as any) = line
        .replace(`${key}: `, "")
        .split(",")
        .map((v) => (v.startsWith(" ") ? v.slice(1) : v));
      return;
    }

    // 文字列の時
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
      const example = prompt.response[key].example;
      const exampleString = Array.isArray(example) ? example.join(", ") : example;
      return `${key}: ${exampleString}`;
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
