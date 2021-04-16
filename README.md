# textlint-rule-max-ruby-len

ルビ親文字とルビ文字の文字数を制限する[textlint](https://github.com/textlint/textlint)ルールです。

対応しているルビ構文は次のとおりです。

```
｜親文字《ルビ》
|親文字《ルビ》
```

## インストール

```
npm install textlint-rule-max-ruby-len
```

## 使い方

```json5
// .textlintrc
{
  "rules": {
    "max-ruby-len": true,
  }
}
```

## オプション

```json5
// .textlintrc
{
  "rules": {
    "max-ruby-len": {
      "rubyBase": 10,
      "rubyText": 10,
      "useStringLength": false
    },
  }
}
```

- `rubyBase`: `number`  
  default: `10`  
  ルビ親文字の最大文字数。
- `rubyText`: `number`  
  default: `10`  
  ルビ文字の最大文字数。
- `useStringLength`: `boolean`  
  default: `false`  
  文字の数え方。  
  初期状態ではString Iteratorを使い`[...striing].length`で数えます。  
  `string.length`で数えたい場合に`true`を指定します。  
  よくわからない場合は、お使いの投稿サイトで`𩸽`が2文字と判定されたら`true`にしておくとよいでしょう。

## License

MIT
