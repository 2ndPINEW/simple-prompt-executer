# Prompt を実行してパースするだけ

## 使い方サンプル

`npm install simple-prompt-executer` や `yarn add simple-prompt-executer` でパッケージを入れれます

### Node ESM

```typescript
import { PromptExecuter } from "simple-prompt-executer";

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
} as const;

const executer = new PromptExecuter({ openAiApiKey: "sk-xxxx" });
const result = await executer(prompt);

console.log(result.question);
```

### Deno

```typescript
import { PromptExecuter } from "npm:simple-prompt-executer";

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
} as const;

const executer = new PromptExecuter({ openAiApiKey: "sk-xxxx" });
const result = await executer(prompt);

console.log(result.question);
```

# Lisence

This project is licensed under the MIT License, see the LICENSE.txt file for details
