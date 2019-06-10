import { AST } from "vue-eslint-parser";
import utils from "eslint-plugin-vue/lib/utils";
import path from "path";
import kebabCase from "lodash/kebabCase";
import sfc from "@tinajs/mina-sfc";
import JSON5 from "json5";
import { BUILD_IN_COMPONENTS } from "../constants";

const DEFAULT_LOC = {
  start: { line: 1, column: 0 },
  end: { line: 1, column: 0 }
};

const isBuildInComponents = (name: string) =>
  BUILD_IN_COMPONENTS.includes(name);

const trimTail = (name: string) =>
  path.basename(name.replace(/\.mina$/, "").replace(/\/index$/, ""));

const getScopedSpecificPrefixHandling = (componentPath: string) => {
  const tokens = componentPath.split("/")[1].split("-");
  const prefix = tokens[tokens.length - 1];
  return prefix;
};

export const getExpectedComponentName = (
  componentPath: string,
  contextPath?: string
) => {
  let name: string = componentPath;
  name = trimTail(name);
  name = kebabCase(name);
  // special handling for airbnb components
  // TODO make this configurable
  if (componentPath.startsWith("~@")) {
    const prefix = getScopedSpecificPrefixHandling(componentPath);
    name = `${prefix}-${name}`;
  }
  return name;
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export type CheckUsingComponentsIntent =
  | "componentName"
  | "unusedComponent"
  | "unregisteredComponent";

const RULE_DESCRIPTION: Record<CheckUsingComponentsIntent, string> = {
  componentName: "Enforce specific casing for the component naming style",
  unusedComponent: "Check unused components",
  unregisteredComponent: "Check unregistered components"
};

export const checkUsingComponents = (intent: CheckUsingComponentsIntent) => ({
  meta: {
    type: "suggestion",
    docs: {
      description: RULE_DESCRIPTION[intent],
      category: "WeChat Mini Program Best Practices",
      recommended: false,
      url: "https://github.com/airbnb/eslint-plugin-miniprogram"
    }
  },

  create(context: any) {
    const source: string = context.getSource();
    let configData;
    try {
      const blocks = sfc.parse(source);
      const configJson: string = blocks.config.content.trim();
      if (!configJson) {
        return {};
      }
      configData = JSON5.parse(configJson);
    } catch (error) {
      context.report({
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 0 }
        },
        message: `parse config error ${error.toString()}`
      });
    }

    const usingComponents = configData.usingComponents || {};

    if (intent === "componentName") {
      const filename = context.getFilename();
      for (const [componentName, componentPath] of Object.entries(
        usingComponents
      )) {
        const expectName = getExpectedComponentName(
          componentPath as string,
          filename
        );
        if (expectName !== componentName) {
          context.report({
            loc: DEFAULT_LOC,
            message: `prefer \`${expectName}\` instead of \`${componentName}\` for \`${componentPath}\``
          });
        }
      }

      return {};
    }

    const registedComponents = new Set<string>();
    for (const component of Object.keys(usingComponents)) {
      registedComponents.add(component);
    }

    const usedComponents = new Set<string>();
    const usedComponentsNodeMap = new Map<string, Array<AST.VNode>>();

    const addUsedComponents = (componentName: string, node: AST.VNode) => {
      if (isBuildInComponents(componentName)) {
        return;
      }
      usedComponents.add(componentName);
      usedComponentsNodeMap.set(componentName, [
        ...(usedComponentsNodeMap.get(componentName) || []),
        node
      ]);
    };

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node: AST.VElement) {
        addUsedComponents(node.name, node);
      },
      VAttribute: function attribute(node: AST.VAttribute) {
        const attrName = node.key.name;
        if (!attrName.startsWith("generic:")) {
          return;
        }
        const componentName = node.value!.value;
        addUsedComponents(componentName, node);
      },
      "VElement[name='template']:exit": function exit() {
        if (intent === "unregisteredComponent") {
          for (const component of Array.from(usedComponents)) {
            if (!registedComponents.has(component)) {
              for (const componentNode of usedComponentsNodeMap.get(
                component
              ) || []) {
                context.report({
                  node: componentNode,
                  message: `unregistered component \`${component}\` in \`usingComponents\``
                });
              }
            }
          }
        }
        if (intent === "unusedComponent") {
          for (const component of Array.from(registedComponents)) {
            if (!usedComponents.has(component)) {
              context.report({
                loc: DEFAULT_LOC,
                message: `unused component \`${component}\` in \`usingComponents\``
              });
            }
          }
        }
      }
    });
  }
});
