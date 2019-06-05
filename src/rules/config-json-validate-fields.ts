/**
 * @fileoverview parsing and linting required and valid JSON config fields.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import path from "path";
import fs from "fs";
import JSON5 from "json5";
import { CommonConfig, PageConfig, ValidKeys } from "../constants";

const replaceExt = (file: string, newExt: string): string => {
  const { dir, name } = path.parse(file);

  return path.format({
    dir,
    base: `${name}${newExt}`
  });
};

const readFileSafe = (file: string): string | null => {
  try {
    const context = fs.readFileSync(file);
    if (!context) {
      return null;
    }

    return context.toString();
  } catch (error) {
    return null;
  }
};

type ExtractedConfig = { configText: string; configFile: string };
type ExtractFailure = { errMsg: "invalid config" | "file content mismatch" };

function extractConfigFromFile(file: string): ExtractedConfig | ExtractFailure {
  // find config file
  const minaFile = replaceExt(file, ".mina");
  const minaContent = readFileSafe(minaFile);
  const jsonFile = replaceExt(file, ".json");
  const jsonContent = readFileSafe(jsonFile);
  if (minaContent) {
    // support .mina file
    const configMatched = minaContent.match(/<config>(.*)<\/config>/s);
    if (!configMatched) {
      return { errMsg: "file content mismatch" };
    }
    const configText = configMatched[1] as string;
    const configFile = minaFile;

    return { configText, configFile };
  }
  if (jsonContent) {
    // support .json file
    const configText = jsonContent;
    const configFile = jsonFile;

    return { configText, configFile };
  }
  // not a Mini Program component / page

  return { errMsg: "invalid config" };
}

type ComponentConfig = CommonConfig;

export const configJsonValidateFields = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Validate fields in component / page config file",
      category: "WeChat Mini Program Best Practices",
      recommended: false,
      url: "https://github.com/airbnb/eslint-plugin-miniprogram"
    },

    schema: []
  },

  create(context: any) {
    return {
      CallExpression(node: any) {
        if (node.callee.type === "Identifier") {
          const { name } = node.callee;
          if (name !== "Component" && name !== "Page") {
            return;
          }
          const file = context.getFilename();

          const result = extractConfigFromFile(file);
          if ((result as ExtractFailure).errMsg === "file content mismatch") {
            context.report({
              node,
              message: `Missing <config> tag in ${file}`
            });

            return;
          }
          const { configFile, configText } = result as ExtractedConfig;

          let configData: Partial<PageConfig | ComponentConfig>;
          // read config
          try {
            configData = JSON5.parse(configText);
          } catch (error) {
            context.report({
              node,
              message: `Parse config failed in ${configFile} ${error.message}`
            });

            return;
          }

          const invalidKeys = Object.keys(configData).filter(
            (key: string) => !ValidKeys.has(key)
          );
          if (Array.isArray(invalidKeys) && invalidKeys.length > 0) {
            context.report({
              node,
              message: `Invalid keys ${invalidKeys.join(", ")} in ${configFile}`
            });

            return;
          }

          // should add `"conponent": true` if using `Component` function.
          if (name === "Component" && !configData.component) {
            context.report({
              node,
              message: `Missing required field \`"component": true\` in ${configFile}`
            });

            return;
          }

          // should not use `"conponent": true` if using `Page` function.
          if (name === "Page" && configData.component) {
            context.report({
              node,
              message: `Disallowed field \`"component": true\` in ${configFile}`
            });

            return;
          }

          if (
            (configData as PageConfig).navigationBarTextStyle &&
            ["black", "white"].indexOf(
              (configData as PageConfig).navigationBarTextStyle
            ) < 0
          ) {
            context.report({
              node,
              message: `Invalid value for field "navigationBarTextStyle" in ${configFile}, can only be ${[
                "black",
                "white"
              ].join(" / ")}`
            });

            return;
          }

          if (
            (configData as PageConfig).backgroundTextStyle &&
            ["dark", "light"].indexOf(
              (configData as PageConfig).backgroundTextStyle
            ) < 0
          ) {
            context.report({
              node,
              message: `Invalid value for field "backgroundTextStyle" in ${configFile}, can only be ${[
                "dark",
                "light"
              ].join(" / ")}`
            });

            return;
          }

          // should always add `"usingComponents": {}`.
          if (!configData.usingComponents) {
            context.report({
              node,
              message: `Missing required field \`"usingComponents": {}\` in ${configFile}`
            });
          }
        }
      }
    };
  }
};
