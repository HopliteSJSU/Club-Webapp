import React from "react";

import SocialMediaIcons from "components/social-media-icons/social-media-icons";

const Footer = props => (
  <footer className="footer">
    <div className="container">
      <div className="columns">
        <div className="column">
          <div
            className={`content location ${
              window.innerWidth <= 850 ? "mobile" : "desktop"
            }`}
          >
            <span className="icon is-inline-flex">
              <i className="fas fa-map-marker-alt is-flex hoplite-purple" />
            </span>
            <div className="sub-content is-inline-block">
              <h3 className="title hoplite-purple">Location</h3>
              <p>
                Thursday 7:30PM @ MQH 234 <br /> Friday 10:00AM @ MQH 226
              </p>
            </div>
          </div>
        </div>
        <div className="column">
          <div
            className={`content contact-us ${
              window.innerWidth <= 850 ? "mobile" : "desktop"
            }`}
          >
            <span className="icon is-inline-flex hoplite-purple">
              <i className="fas fa-envelope-open" />
            </span>
            <div className="sub-content is-inline-block">
              <h3 className="title hoplite-purple">Contact Us</h3>
              <p>hopliteclub@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="column">
          <SocialMediaIcons />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
