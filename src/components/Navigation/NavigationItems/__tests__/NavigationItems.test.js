import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationItem from "./../NavigationItem/NavigationItem";
import NavigationItems from "./../NavigationItems.js";

configure({ adapter: new Adapter() });

describe("<NavigationItems />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it("should render two <NavigationItems /> elements if not authenticated", () => {
    // find из пакета enzyme
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });
  it("should render three <NavigationItems /> elements if authenticated", () => {
    wrapper.setProps({ isAuth: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });
  it("should an exect logout button", () => {
    wrapper.setProps({ isAuth: true });
    expect(
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
    ).toEqual(true);
  });
});
