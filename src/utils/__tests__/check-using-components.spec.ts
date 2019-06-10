import { getExpectedComponentName } from "../check-using-components";

describe(`getExpectedComponentName`, () => {
  it("strips .mina", () => {
    expect(getExpectedComponentName("../comp/index.mina")).toEqual("comp");
    expect(getExpectedComponentName("../myComp/index.mina")).toEqual("my-comp");
    expect(getExpectedComponentName("../comp/name.mina")).toEqual("name");
    expect(getExpectedComponentName("../myComp/nameAndId.mina")).toEqual(
      "name-and-id"
    );
  });

  it("does some specific handling with scoped packages", () => {
    expect(
      getExpectedComponentName("~@irbnb/some-package-name/comp.mina")
    ).toEqual("name-comp");
    expect(
      getExpectedComponentName("~@irbnb/some-package-name/comp/index.mina")
    ).toEqual("name-comp");
    expect(
      getExpectedComponentName("~@irbnb/some-package-name/myComp/index.mina")
    ).toEqual("name-my-comp");
  });
});
