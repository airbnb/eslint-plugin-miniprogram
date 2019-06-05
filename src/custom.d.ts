declare module "@tinajs/mina-sfc" {
  function parse(
    source: string
  ): {
    config: { content: string };
  };
}

declare module "eslint-plugin-vue/lib/utils" {
  function defineTemplateBodyVisitor(context: any, visitor: any): any;
}
