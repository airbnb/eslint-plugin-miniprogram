/**
 * @fileoverview prefer to use promisify
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// see also https://github.com/eslint/eslint/blob/617a2874ed085bca36ca289aac55e3b7f7ce937e/lib/util/ast-utils.js#L874-L951

/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {['b']: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 *
 * @param {ASTNode} node - The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
const getStaticPropertyName = (node: any): string | null => {
  let prop;

  switch (node && node.type) {
    case "Property":
    case "MethodDefinition":
      prop = node.key;
      break;

    case "MemberExpression":
      prop = node.property;
      break;

    default:
      break;
  }

  switch (prop && prop.type) {
    case "Literal":
      return String(prop.value);

    case "TemplateLiteral":
      if (prop.expressions.length === 0 && prop.quasis.length === 1) {
        return prop.quasis[0].value.cooked;
      }
      break;

    case "Identifier":
      if (!node.computed) {
        return prop.name;
      }
      break;

    default:
      break;
  }

  return null;
};

const INVALID_KEYS = ["success", "fail", "complete"];

export const preferWxPromisify = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer promisify over wx style callbacks including success, fail and complete",
      category: "WeChat Mini Program Best Practices",
      recommended: false,
      url: "https://github.com/airbnb/eslint-plugin-miniprogram"
    },
    schema: []
  },

  create(context: any) {
    return {
      Property(node: any) {
        const name = getStaticPropertyName(node);

        // Skip destructuring.
        if (node.parent.type !== "ObjectExpression") {
          return;
        }

        // Skip if the name is not static.
        if (!name) {
          return;
        }

        if (INVALID_KEYS.includes(name)) {
          context.report({
            node,
            loc: node.key.loc,
            message: `Prefer \`promisify\` over wx style callbacks. Unexpected callback \`${name}\`.`,
            data: { name }
          });
        }
      }
    };
  }
};
