import React, { Component } from "react";
import Card from "./card";
import leaders from "./leaders";

import uuid from "uuid/v1";

class Leadership extends Component {
  render() {
    const { windowWidth } = this.props;
    let deviceType = windowWidth <= 850 ? "mobile" : "desktop";

    let columns = [];
    let row = [];
    leaders.forEach(({ name, role, img, linkedin }, index) => {
      if (index && index % 3 === 0) {
        columns.push(row);
        row = [];
      }

      row.push(
        <Card
          name={name}
          role={role}
          img={img}
          linkedin={linkedin}
          key={uuid()}
        />
      );

      if (index === leaders.length - 1) {
        columns.push(row);
      }
    });

    return (
      <section id="leadership">
        <div className={`container ${deviceType}`}>
          <h2 className="title has-text-centered">Leadership</h2>
          <h3 className="subtitle has-text-centered">
            Meet our <strong className="hoplite-purple">awesome</strong> team
            that focus on all aspects of the club!
          </h3>
          {columns.map((column, index) => (
            <div className="columns" key={index}>
              {column}
            </div>
          ))}
        </div>
      </section>
    );
  }
}

export default Leadership;
