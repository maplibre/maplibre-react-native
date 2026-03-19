import type { FilterSpecification } from "@maplibre/maplibre-gl-style-spec";

import { BridgeValue, type RawValueType } from "@/utils/BridgeValue";
import { getNativeFilter } from "@/utils/getNativeFilter";

const FilterItem = BridgeValue;

describe("getNativeFilter", () => {
  it("should parse flat filter", () => {
    const filter: FilterSpecification = ["==", "rating", 10];
    expect(getNativeFilter(filter)).toEqual(["==", "rating", 10]);
  });

  it("should parse filter with array", () => {
    const filter: FilterSpecification = [
      "all",
      ["==", "class", "street_limited"],
      [">=", "admin_level", 3],
      ["==", "enabled", true],
    ];
    expect(getNativeFilter(filter)).toEqual([
      "all",
      ["==", "class", "street_limited"],
      [">=", "admin_level", 3],
      ["==", "enabled", true],
    ]);
  });

  it("should return empty array if filter type passed in is not an array", () => {
    expect(getNativeFilter(undefined)).toEqual([]);
    // @ts-expect-error
    expect(getNativeFilter({})).toEqual([]);
  });

  it("should create boolean filter item", () => {
    verifyFilterItem(new FilterItem(true), "boolean", true);
    verifyFilterItem(new FilterItem(false), "boolean", false);
  });

  it("should create number filter item", () => {
    verifyFilterItem(new FilterItem(0), "number", 0);
    verifyFilterItem(new FilterItem(1), "number", 1);
    verifyFilterItem(new FilterItem(100), "number", 100);
  });

  it("should create string filter item", () => {
    verifyFilterItem(new FilterItem("0"), "string", "0");
    verifyFilterItem(new FilterItem("test"), "string", "test");
    verifyFilterItem(new FilterItem("true"), "string", "true");
    verifyFilterItem(new FilterItem("false"), "string", "false");
  });

  it("should throw error if the filter item is not a primitive", () => {
    // @ts-expect-error
    verifyErrorFilterItem(undefined);
    // @ts-expect-error
    verifyErrorFilterItem(null);
  });
});

function verifyFilterItem(
  filterItem: BridgeValue,
  expectedType: string,
  expectedValue: RawValueType,
) {
  expect(filterItem.toJSON()).toEqual({
    type: expectedType,
    value: expectedValue,
  });
}

function verifyErrorFilterItem(value: RawValueType) {
  const filterItem = new FilterItem(value);
  expect(() => filterItem.toJSON()).toThrow();
}
