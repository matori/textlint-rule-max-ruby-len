import TextLintTester from "textlint-tester";
import jawnPlugin from 'textlint-plugin-jawn'
import rule from '../src/textlint-rule-max-ruby-len'

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
        text: `｜春夏秋冬《しゅんかしゅうとう》`,
        ext: ".jwn"
      },
      {
        text: `これはルビじゃないので通る｜〇一二三四五六七八九十｜《あいうえおかきくけこさ》`,
        ext: ".jwn"
      },
    ],
    invalid: [
      {
        text: `｜〇一二三四五六七八九十《あいうえおかきくけこ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 2,
          }
        ]
      },
      {
        text: `｜〇一二三四五六七八九《あいうえおかきくけこさ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 13,
          }
        ]
      },
      {
        text: `｜〇一二三四五六七八九十《あいうえおかきくけこさ》`,
        ext: ".jwn",
        errors: [
          {
            message: `ルビ親文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 2,
          },
          {
            message: `ルビ文字が長すぎます: 11文字 / 10文字`,
            line: 1,
            column: 14,
          }
        ]
      },
    ],
  }
);
