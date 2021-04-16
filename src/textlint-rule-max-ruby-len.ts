'use strict';
import { TextlintRuleModule } from '@textlint/types';
import { RuleHelper } from 'textlint-rule-helper';
import { matchCaptureGroupAll } from 'match-index';

const defaultOptions = {
  rubyBase: 10,
  rubyText: 10,
  useStringLength: false,
};

// 正規表現作成用の定数
// @see https://github.com/matori/jawn-to-ast/blob/main/src/constants.ts

// ルビ親文字
const RUBY_BASE_SYMBOL_START_CHARS = ['|', '｜'];

// ルビテキスト
const RUBY_TEXT_SYMBOL_START = '《';
const RUBY_TEXT_SYMBOL_END = '》';

// エスケープ用の文字
const ESCAPE_CHARS = ['|', '｜'];

// 正規表現
// @see https://github.com/matori/jawn-to-ast/blob/main/src/patterns.ts

const escapeChars = ESCAPE_CHARS.join('');
const rubyBaseStartChars = RUBY_BASE_SYMBOL_START_CHARS.join('');

const rubyBasePatternBase = [
  `[${rubyBaseStartChars}]`,
  `([^${escapeChars}]+?)`,
  `(?<!${RUBY_TEXT_SYMBOL_START})`,
  RUBY_TEXT_SYMBOL_START,
  `.+?`,
  RUBY_TEXT_SYMBOL_END,
].join('');

const rubyTextPatternBase = [
  `[${rubyBaseStartChars}]`,
  `[^${escapeChars}]+?`,
  `(?<!${RUBY_TEXT_SYMBOL_START})`,
  RUBY_TEXT_SYMBOL_START,
  `(.+?)`,
  RUBY_TEXT_SYMBOL_END,
].join('');

const rubyBasePattern = new RegExp(rubyBasePatternBase, 'g');
const rubyTextPattern = new RegExp(rubyTextPatternBase, 'g');

// node type
const RubyBase = 'RubyBase';
const RubyText = 'RubyText';

const module: TextlintRuleModule = (context, options = {}) => {
  const helper = new RuleHelper(context);
  const { Syntax, getSource, RuleError, report } = context;
  const rubyBaseMax = options.rubyBase ? options.rubyBase : defaultOptions.rubyBase;
  const rubyTextMax = options.rubyText ? options.rubyText : defaultOptions.rubyText;
  const useStringLength = typeof options.useStringLength === 'boolean'
    ? options.useStringLength
    : defaultOptions.useStringLength;
  const ignoreNodes = [
    Syntax.BlockQuote,
    Syntax.CodeBlock,
    Syntax.Comment,
    Syntax.Image,
    Syntax.Code,
  ];
  return {
    [Syntax.Str](node): void {
      // 無視するノードの子孫なら何もしない
      if (helper.isChildNode(node, ignoreNodes)) {
        return;
      }

      if (helper.isChildNode(node, [RubyBase])) { // RubyBaseノード
        const text = node.value;
        const len = getLength(text, useStringLength);
        if (len > rubyBaseMax) {
          const ruleError = new RuleError(createErrorMesage(RubyBase, len, rubyBaseMax));
          report(node, ruleError);
        }
      } else if (helper.isChildNode(node, [RubyText])) { // RubyTextノード
        const text = node.value;
        const len = getLength(text, useStringLength);
        if (len > rubyTextMax) {
          const ruleError = new RuleError(createErrorMesage(RubyText, len, rubyBaseMax));
          report(node, ruleError);
        }
      } else {
        // RubyBaseやRubyTextのノードタイプを持たないASTに対しての処理
        // JAWNのRubyノード外のテキストが引っかかったらjawn-to-astのパースがおかしい
        const source = getSource(node);
        const rubyBaseCaptureGroups = matchCaptureGroupAll(source, rubyBasePattern);
        const rubyTextCaptureGroups = matchCaptureGroupAll(source, rubyTextPattern);
        rubyBaseCaptureGroups.forEach(({ text, index }) => {
          const len = getLength(text, useStringLength);
          if (len > rubyBaseMax) {
            const ruleError = new RuleError(createErrorMesage(RubyBase, len, rubyBaseMax), { index });
            report(node, ruleError);
          }
        });
        rubyTextCaptureGroups.forEach(({ text, index }) => {
          const len = getLength(text, useStringLength);
          if (len > rubyTextMax) {
            const ruleError = new RuleError(createErrorMesage(RubyText, len, rubyBaseMax), { index });
            report(node, ruleError);
          }
        });
      }
    },
  };
};

function getLength(text: string, useStringLength: boolean): number {
  if (useStringLength) {
    return text.length;
  }
  return [...text].length;
}

function createErrorMesage(type: string, len: number, max: number): string {
  if (type === RubyBase) {
    return `ルビ親文字が長すぎます: ${len}文字 / ${max}文字`;
  }
  if (type === RubyText) {
    return `ルビ文字が長すぎます: ${len}文字 / ${max}文字`;
  }
  return `${len}文字 / ${max}文字`;
}

export default module;
