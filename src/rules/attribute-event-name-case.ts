import { AST } from "vue-eslint-parser";
import utils from "eslint-plugin-vue/lib/utils";
import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import snakeCase from "lodash/snakeCase";

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// see also https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/attribute-hyphenation.js

type Cases = "camel" | "kebab" | "snake";

const CASE_MAPPINGS = {
  camel: camelCase,
  kebab: kebabCase,
  snake: snakeCase
};

const EVENT_LISTEN = /^(bind|catch|capture-bind|capture-catch):?/;

export const attributeEventNameCase = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Check event name case",
      category: "WeChat Mini Program Best Practices",
      recommended: false,
      url: "https://github.com/airbnb/eslint-plugin-miniprogram"
    },
    schema: [
      {
        enum: ["camel", "kebab", "snake"]
      }
    ]
  },

  create(context: any) {
    const optionCase: Cases = context.options[0] || "camel";
    const mapping = CASE_MAPPINGS[optionCase];
    if (!mapping) {
      throw new TypeError("Case type not found");
    }

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node: AST.VAttribute) {
        const name = node.key.rawName;

        if (!EVENT_LISTEN.test(name)) {
          return;
        }
        const eventName = name.replace(EVENT_LISTEN, "");
        if (mapping(eventName) === eventName) {
          return;
        }

        context.report({
          node: node.key,
          loc: node.loc,
          message: `Event \`${name}\` should be ${optionCase} case \`${name.replace(
            eventName,
            mapping(eventName)
          )}\``
        });
      }
    });
  }
};
