import TextLintTester from "textlint-tester";
import jawnPlugin from 'textlint-plugin-jawn'
import rule from '../lib/textlint-rule-max-ruby-len'

const tester = new TextLintTester();

tester.run(
  "JAWN-FS + textlint-rule-max-ruby-len",
  {
    plugins: [
      {
        pluginId: "jawn",
        plugin: jawnPlugin
      }
    ],
    rules: [
      {
        ruleId: "max-ruby-len",
        rule: rule,
        // default
        // options: {
        //   rubyBase: 10,
        //   rubyText: 10,
        //   useStringLength: false,
        // }
      }
    ]
  },
  {
    valid: [
      {
        text: `これは通る｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".jwn"
      },
      {
        text: `これはルビじゃないので通る｜〇一二三四五六七八九十｜《あいうえおかきくけこさ》`,
        ext: ".jwn"
      },
    ],
    invalid: [
      {
        text: `親文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 10,
          }
        ]
      },
      {
        text: `ルビ文字がオーバー｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 22,
          }
        ]
      },
      {
        text: `親文字とルビ文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこさ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 15,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 27,
          }
        ]
      },
      {
        text: `複数行\n\n親文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこ》\nルビ文字がオーバー｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".txt",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 3,
            column: 10,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 4,
            column: 22,
          }
        ]
      },
    ],
  }
);

tester.run(
  "Plain text + textlint-rule-max-ruby-len",
  rule,
  {
    valid: [
      {
        text: `これは通る｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".txt"
      },
      {
        text: `これはルビじゃないので通る｜〇一二三四五六七八九十｜《あいうえおかきくけこさ》`,
        ext: ".txt"
      },
    ],
    invalid: [
      {
        text: `親文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこ》`,
        ext: ".txt",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 10,
          }
        ]
      },
      {
        text: `ルビ文字がオーバー｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".txt",
        errors: [
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 22,
          }
        ]
      },
      {
        text: `親文字とルビ文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこさ》`,
        ext: ".txt",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 15,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 27,
          }
        ]
      },
      {
        text: `複数行\n\n親文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこ》\nルビ文字がオーバー｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".txt",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 3,
            column: 10,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 4,
            column: 22,
          }
        ]
      },
    ],
  }
);

tester.run(
  "Markdown + textlint-rule-max-ruby-len",
  rule,
  {
    valid: [
      {
        text: `これは通る｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".md"
      },
      {
        text: `# 見出し：これは通る｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".md"
      },
      {
        text: `- リスト：これは通る｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".md"
      },
      {
        text: `リンク：これは通る[｜春夏秋冬《しゅんかしゅうとう》](https://example.com)`,
        ext: ".md"
      },
      {
        text: '> 親文字とルビ文字がオーバーだけど引用なので通る｜〇一二三四五六七八九十《あいうえおかきくけこさ》',
        ext: ".md"
      },
      {
        text: '```コードブロック内テキストはルビ判定しないので通る｜〇一二三四五六七八九十《あいうえおかきくけこさ》```',
        ext: ".md"
      },
      {
        text: '`コード内テキストはルビ判定しないので通る｜〇一二三四五六七八九十《あいうえおかきくけこさ》`',
        ext: ".md"
      },
      {
        text: '画像の代替テキストはルビ判定しないので通る![｜〇一二三四五六七八九十《あいうえおかきくけこさ》](https://example.com/example.png)',
        ext: ".md"
      },
      {
        text: `これはルビじゃないので通る｜〇一二三四五六七八九十｜《あいうえおかきくけこさ》`,
        ext: ".md"
      },
    ],
    invalid: [
      {
        text: `- 親文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこ》`,
        ext: ".md",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 12,
          }
        ]
      },
      {
        text: `# ルビ文字がオーバー｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".md",
        errors: [
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 24,
          }
        ]
      },
      {
        text: `1. 親文字とルビ文字がオーバー｜〇一二三四五六七八九十《あいうえおかきくけこさ》`,
        ext: ".md",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 18,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 30,
          }
        ]
      },
    ],
  }
);
