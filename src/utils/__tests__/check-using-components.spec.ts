import { getExpectedComponentName } from "../check-using-components";

describe(`getExpectedComponentName`, () => {
  it("strips .mina", () => {
    expect(getExpectedComponentName("../comp/index.mina")).toEqual("index");
    expect(getExpectedComponentName("../comp/name.mina")).toEqual("name");
  });
  it("replaces some airbnb specific names with proper prefix", () => {
    expect(
      getExpectedComponentName("~@irbnb/some-package-name/comp.mina")
    ).toEqual("name-comp");
  });
});
