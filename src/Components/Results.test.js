import Results from "./Results";
import { render } from "@testing-library/react";
import { shallow } from "enzyme";

describe("Results", () => {
  it("should get a prop called totalUsage and it should be a number", () => {
    const wrapper = shallow(<Results />);
    expect(wrapper.props().totalUsage).toBeNumber();
  });
});
