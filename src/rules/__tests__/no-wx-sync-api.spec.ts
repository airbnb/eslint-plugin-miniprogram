import { isSyncApi } from "../no-wx-sync-api";

describe(`isSyncApi`, () => {
  it("works", () => {
    expect(isSyncApi("test")).toBeFalsy();
    expect(isSyncApi("setStorageSync")).toBeTruthy();
    expect(isSyncApi("setStorage")).toBeFalsy();
    expect(isSyncApi("getLaunchOptionsSync")).toBeFalsy();
  });
});
