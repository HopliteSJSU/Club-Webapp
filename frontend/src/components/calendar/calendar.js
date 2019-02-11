import React, { Component } from "react";

import Button from "components/button/button";

class Calendar extends Component {
  handleBtnClick = () => {
    window.location.href =
      "https://calendar.google.com/calendar/r?cid=c9umttrjh8lh95rot8fs7nd0nk@group.calendar.google.com";
  };

  render() {
    const { windowWidth } = this.props;

    let deviceType = windowWidth <= 850 ? "mobile" : "desktop";

    return (
      <section id="calendar">
        <div className={`container ${deviceType}`}>
          <h2 className="title has-text-centered has-text-white">Calendar</h2>
          <h3 className="subtitle has-text-centered has-text-white">
            Find out when and where our{" "}
            <span className="hoplite-purple">club meetings</span> and events
            will happen!
          </h3>
          <div className={`is-flex ${deviceType}`}>
            {deviceType === "desktop" ? (
              <iframe
                src="https://calendar.google.com/calendar/embed?showTitle=0&showPrint=0&showCalendars=0&height=600&wkst=1&bgcolor=%23FFFFFF&src=c9umttrjh8lh95rot8fs7nd0nk%40group.calendar.google.com&color=%232F6309&ctz=America%2FLos_Angeles"
                style={{ border: 0 }}
                width="1200"
                height="700"
                frameBorder="0"
                scrolling="no"
                title="Hoplite Calendar"
              />
            ) : (
              <Button label="Go To Calendar" clicked={this.handleBtnClick} />
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default Calendar;
