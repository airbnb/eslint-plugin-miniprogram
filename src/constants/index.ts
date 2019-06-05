export const BUILD_IN_COMPONENTS = [
  // framework
  "template",
  "slot",
  "block",
  // built-in
  "movable-view",
  "cover-image",
  "cover-view",
  "movable-area",
  "scroll-view",
  "swiper",
  "swiper-item",
  "view",
  "icon",
  "progress",
  "rich-text",
  "text",
  "button",
  "checkbox",
  "checkbox-group",
  "editor",
  "form",
  "input",
  "label",
  "picker",
  "picker-view",
  "picker-view-column",
  "radio",
  "radio-group",
  "slider",
  "switch",
  "textarea",
  "functional-page-navigator",
  "navigator",
  "audio",
  "camera",
  "image",
  "live-player",
  "live-pusher",
  "video",
  "map",
  "canvas",
  "ad",
  "official-account",
  "open-data",
  "web-view"
];

export type CommonConfig = {
  component: boolean;
  usingComponents: object;
};

export type HexColor = string;

export type PageConfig = CommonConfig & {
  navigationBarBackgroundColor: HexColor;
  navigationBarTextStyle: "white" | "black";
  navigationBarTitleText: string;
  navigationStyle: "default" | "custom";
  backgroundColor: HexColor;
  backgroundTextStyle: "dark" | "light";
  backgroundColorTop: string;
  backgroundColorBottom: string;
  enablePullDownRefresh: boolean;
  onReachBottomDistance: number;
  pageOrientation: "portrait" | "landscape" | "auto";
  disableSwipeBack: boolean;
  disableScroll: boolean;
  componentGenerics: Record<string, boolean | { default: string }>;
};

export const ValidKeys = new Set([
  "component",
  "usingComponents",
  "componentGenerics",
  "navigationBarBackgroundColor",
  "navigationBarTextStyle",
  "navigationBarTitleText",
  "navigationStyle",
  "backgroundColor",
  "backgroundTextStyle",
  "backgroundColorTop",
  "backgroundColorBottom",
  "enablePullDownRefresh",
  "onReachBottomDistance",
  "pageOrientation",
  "disableSwipeBack",
  "disableScroll"
]);
