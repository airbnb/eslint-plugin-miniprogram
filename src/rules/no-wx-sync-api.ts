/**
 * @fileoverview Disallow the use of wx.xxSync API
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// whitelisted because there's only sync version
const whitelist: string[] = ["getLaunchOptionsSync", "getAccountInfoSync"];

export const isSyncApi = (propertyName: string) =>
  propertyName &&
  propertyName.endsWith("Sync") &&
  !whitelist.find(i => i === propertyName);

export const noWxSyncApi = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow the use of wx.xxSync API",
      category: "WeChat Mini Program Best Practices",
      recommended: false,
      url: "https://github.com/airbnb/eslint-plugin-miniprogram"
    },
    schema: []
  },

  create(context: any) {
    return {
      MemberExpression(node: any) {
        const objectName = node.object.name;
        const propertyName = node.property.name;
        if (objectName === "wx" && !node.computed && isSyncApi(propertyName)) {
          context.report({
            node,
            message: `wx.${propertyName} may cause performance issue. Use wx.${propertyName.replace(
              /Sync$/,
              ""
            )} instead.`
          });
        }
      }
    };
  }
};
