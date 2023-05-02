import { makePromptString, parsePrompt } from "../index";

const prompt = {
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
};

const correctPromptString = `以下の文章から4択クイズを考えてください。

[以下のフォーマットで回答してください]
\`\`\`
question: クイズの問題
selection: 選択肢
answer: 答え
\`\`\`

[例]
パンをテーマにクイズを考えた例です。
\`\`\`
question: パンはパンでも食べられないパンはなんだ
selection: フライパン, AI, パンダ, パン粉
answer: パン
\`\`\``;

describe("llmが正常な場合", () => {
  it("Promptを文字列のプロンプトに正しく変換できる", () => {
    const makePromptResult = makePromptString(prompt);
    expect(makePromptResult).toEqual(correctPromptString);
  });

  it("llmの結果をPromptの型に正しく変換できる", () => {
    const llmResponse = `question: パン\nこっちもパン\nさらにパン\nselection: フライパン, AI, パンダ, パンダ\nanswer: パンダ`;
    const parseResult = parsePrompt(prompt, llmResponse);
    expect(parseResult).toEqual({
      question: "パン\nこっちもパン\nさらにパン",
      selection: "フライパン, AI, パンダ, パンダ",
      answer: "パンダ",
    });
  });
});

describe("llmが異常な場合", () => {
  it("llmの結果をPromptの型に変換しようとした時にエラーになる", () => {
    const llmResponse = `question: パン\nこっちもパン\nselection: フライパン, AI, パンダ, パンダ`;
    function executeParse() {
      parsePrompt(prompt, llmResponse);
    }
    expect(executeParse).toThrowError();
  });
});
