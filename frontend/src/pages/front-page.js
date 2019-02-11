import React, { Component } from "react";

import HeroBanner from "components/hero-banner/hero-banner";
import AboutUs from "components/about-us/about-us";
import Leadership from "components/leadership/leadership";
import Calendar from "components/calendar/calendar";
import Footer from "components/footer/footer";
import Navbar from "components/navbar/navbar";

import _ from "lodash";

class FrontPage extends Component {
  constructor(props) {
    super();

    this.state = {
      windowWidth: window.innerWidth,
      scrollY: window.scrollY,
      navbarItems: ["Home", "About Us", "Calendar", "Leadership", "Members"],
      activeBurger: false,
      activeNavbarItem: "Home"
    };

    this.updateScrollY = _.debounce(this.updateScrollY, 100);
  }

  componentDidMount() {
    window.addEventListener("resize", _.debounce(this.updateWidth, 200));
    window.addEventListener("scroll", this.handleScrollEvent);
    this.HashLink();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeNavbarItem !== this.state.activeNavbarItem) {
      this.HashLink();
    }
  }

  handleScrollEvent = () => {
    //This works but it's not 100% smooth
    // this.addParallax();
    this.updateScrollY();
  };

  addParallax = () => {
    let offset = window.pageYOffset * 0.6 + "px";

    let parallaxHome = document.querySelector("#home");
    let parallaxCalendar = document.querySelector("#calendar");

    if (parallaxHome && parallaxCalendar) {
      parallaxHome.style.backgroundPositionY = offset;
      parallaxCalendar.style.backgroundPositionY = offset;
    }
  };

  updateWidth = () => this.setState({ windowWidth: window.innerWidth });
  updateScrollY = () => this.setState({ scrollY: window.scrollY });

  HashLink = () => {
    let hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash) {
      let el = document.getElementById(hash);
      if (el) {
        let top = el.getBoundingClientRect().top + window.scrollY;
        window.scroll({
          top: top - 100,
          behavior: "smooth"
        });
      }
    } else if (hash === "") {
      window.scroll({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  handleBurgerClick = () =>
    this.setState(prevState => ({ activeBurger: !prevState.activeBurger }));

  handleItemClick = e =>
    this.setState({
      activeNavbarItem: e.currentTarget.textContent,
      activeBurger: false
    });

  render() {
    const {
      windowWidth,
      scrollY,
      navbarItems,
      activeNavbarItem,
      activeBurger
    } = this.state;

    let defaultNavbar =
      (scrollY <= 100 && activeNavbarItem === "Home") || scrollY === 0;

    return (
      <React.Fragment>
        <HeroBanner windowWidth={windowWidth}>
          {defaultNavbar && (
            <Navbar
              windowWidth={windowWidth}
              navbarItems={navbarItems}
              activeNavbarItem={activeNavbarItem}
              activeBurger={activeBurger}
              burgerClick={this.handleBurgerClick}
              itemClick={this.handleItemClick}
            />
          )}
        </HeroBanner>
        {!defaultNavbar && (
          <Navbar
            windowWidth={windowWidth}
            navbarItems={navbarItems}
            activeNavbarItem={activeNavbarItem}
            activeBurger={activeBurger}
            burgerClick={this.handleBurgerClick}
            itemClick={this.handleItemClick}
            fixed
          />
        )}

        <AboutUs windowWidth={windowWidth} />
        <Calendar windowWidth={windowWidth} />
        <Leadership windowWidth={windowWidth} />
        <Footer />
      </React.Fragment>
    );
  }
}

export default FrontPage;
