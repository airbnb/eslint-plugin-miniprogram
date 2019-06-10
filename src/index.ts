import { noWxSyncApi } from "./rules/no-wx-sync-api";
import { preferWxPromisify } from "./rules/prefer-wx-promisify";
import { configJsonValidateFields } from "./rules/config-json-validate-fields";
import { attributeEventNameCase } from "./rules/attribute-event-name-case";
import { componentName } from "./rules/component-name";
import { noUnusedComponents } from "./rules/no-unused-components";
import { noUnregisteredComponents } from "./rules/no-unregistered-components";

export = {
  rules: {
    "no-wx-sync-api": noWxSyncApi,
    "prefer-wx-promisify": preferWxPromisify,
    "config-json-validate-fields": configJsonValidateFields,
    "attribute-event-name-case": attributeEventNameCase,
    "component-name": componentName,
    "no-unused-components": noUnusedComponents,
    "no-unregistered-components": noUnregisteredComponents
  }
};
