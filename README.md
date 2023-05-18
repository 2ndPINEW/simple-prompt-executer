# Prompt を実行してパースするだけ

## 使い方サンプル

`npm install simple-prompt-executer` や `yarn add simple-prompt-executer` でパッケージを入れれます

### Node ESM

```typescript
import { Prompt, makePromptString, parsePrompt } from "simple-prompt-executer";

const prompt: Prompt = {
  prompt: `以下の文章から4択クイズを考えてください。`,
  exampleDescription: "パンをテーマにクイズを考えた例です。",
  response: {
    question: {
      example: "パンはパンでも食べられないパンはなんだ",
      description: "クイズの問題",
    },
    selection: {
      example: ["フライパン", "AI", "パンダ", "パン粉"],
      description: "選択肢",
    },
    answer: {
      example: "パン",
      description: "答え",
    },
  },
};
const executer = new PromptExecuter({ openAiApiKey: "sk-xxxx" });
const result = await executer.execute(prompt);
//   ^result = {
// 	question: "クリスマスに隠かくれているものはなーんだ？",
// 	selection: ["リス", "トナカイ", "シカ", "奈良"],
// 	answer: "リス"
// }

// 型がついてるのでこれはエラーになります
result.notExistProperty;
```

### Deno

```typescript
import { PromptExecuter, Prompt } from "npm:simple-prompt-executer";

const prompt: Prompt = {
  prompt: `以下の文章から4択クイズを考えてください。`,
  exampleDescription: "パンをテーマにクイズを考えた例です。",
  response: {
    question: {
      example: "パンはパンでも食べられないパンはなんだ",
      description: "クイズの問題",
    },
    selection: {
      example: ["フライパン", "AI", "パンダ", "パン粉"],
      description: "選択肢",
    },
    answer: {
      example: "パン",
      description: "答え",
    },
  },
};

const executer = new PromptExecuter({ openAiApiKey: "sk-xxxx" });
const result = await executer.execute(prompt);
//   ^result = {
// 	question: "クリスマスに隠かくれているものはなーんだ？",
// 	selection: ["リス", "トナカイ", "シカ", "奈良"],
// 	answer: "リス"
// }

// 型がついてるのでこれはエラーになります
result.notExistProperty;
```

### LLM は自分で決めたい

```typescript
import { makePromptString, parsePrompt, Prompt } from "simple-prompt-executer";

const prompt: Prompt = {
  prompt: `以下の文章から4択クイズを考えてください。`,
  exampleDescription: "パンをテーマにクイズを考えた例です。",
  response: {
    question: {
      example: "パンはパンでも食べられないパンはなんだ",
      description: "クイズの問題",
    },
    selection: {
      example: ["フライパン", "AI", "パンダ", "パン粉"],
      description: "選択肢",
    },
    answer: {
      example: "パン",
      description: "答え",
    },
  },
};

const stringPrompt = makePromptString(prompt);
// ^ stringPrompt = 以下の文章から4択クイズを考えてください。
// [以下のフォーマットで回答してください]
// \`\`\`
// question: クイズの問題
// selection: 選択肢
// answer: 答え
// \`\`\`

// [例]
// パンをテーマにクイズを考えた例です。
// \`\`\`
// question: パンはパンでも食べられないパンはなんだ
// selection: フライパン, AI, パンダ, パン粉
// answer: パン
// \`\`\`

const llmOutput = `Use any llm here`;
const result = parsePrompt(prompt, llmOutput);
//   ^result = {
// 	question: "クリスマスに隠かくれているものはなーんだ？",
// 	selection: ["リス", "トナカイ", "シカ", "奈良"],
// 	answer: "リス"
// }

// 型がついてるのでこれはエラーになります
result.notExistProperty;
```

# Lisence

This project is licensed under the MIT License, see the LICENSE.txt file for details
