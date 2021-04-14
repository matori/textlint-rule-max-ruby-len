'use strict';
import { TextlintRuleModule } from '@textlint/types';
import { TxtNode } from '@textlint/ast-node-types';

const defaultOptions = {
  rubyBase: 10,
  rubyText: 10,
  useStringLength: false,
};

const module: TextlintRuleModule = (context, options = {}) => {
  const { Syntax, RuleError, report } = context;
  const rubyBaseMax = options.rubyBase ? options.rubyBase : defaultOptions.rubyBase;
  const rubyTextMax = options.rubyTextMax ? options.rubyTextMax : defaultOptions.rubyText;
  const useStringLength = typeof options.useStringLength === 'boolean'
    ? options.useStringLength
    : defaultOptions.useStringLength;
  const RubyBase = 'RubyBase';
  const RubyText = 'RubyText';
  return {
    [Syntax.Str](node) {
      const text = node.value;
      const len = getLength(text, useStringLength);
      if (isNodeWrapped(node, [RubyBase])) {
        if (len > rubyBaseMax) {
          report(
            node,
            new RuleError(`ルビ親文字が長すぎます: ${len}文字 / ${rubyBaseMax}文字`),
          );
        }
      }
      if (isNodeWrapped(node, [RubyText])) {
        if (len > rubyTextMax) {
          report(
            node,
            new RuleError(`ルビ文字が長すぎます: ${len}文字 / ${rubyTextMax}文字`),
          );
        }
      }
    }
  };
};

function getLength(text: string, useStringLength: boolean): number {
  if (useStringLength) {
    return text.length;
  }
  return [...text].length;
}

/**
 * Get parents of node.
 * The parent nodes are returned in order from the closest parent to the outer ones.
 * @param node
 * @returns {Array}
 */
function getParents(node: TxtNode): TxtNode[] {
  const result = [];
  // child node has `parent` property.
  let parent = node.parent;
  while (parent != null) {
    result.push(parent);
    parent = parent.parent;
  }
  return result;
}

/**
 * Return true if `node` is wrapped any one of `types`.
 * @param {TxtNode} node is target node
 * @param {string[]} types are wrapped target node
 * @returns {boolean|*}
 */
function isNodeWrapped(node: TxtNode, types: string[]): boolean {
  const parents = getParents(node);
  const parentsTypes = parents.map(function(parent) {
    return parent.type;
  });
  return types.some(function(type) {
    return parentsTypes.some(function(parentType) {
      return parentType === type;
    });
  });
}

export default module;
