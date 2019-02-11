import React from "react";

const AboutUs = ({ windowWidth }) => {
  let deviceType = windowWidth <= 850 ? "mobile" : "desktop";

  return (
    <section id="aboutus">
      <div className={`container ${deviceType}`}>
        <h2 className="title has-text-centered">About Us</h2>
        <h3 className="subtitle has-text-centered hoplite-purple">
          SJSU Hoplite
        </h3>

        <div className="content">
          Established in 2018, <b>Hoplite</b> at San José State University
          brings together Spartans with the common goal of acing technical
          coding interviews. We curate challenging interview level questions and
          mimic resources available during interviews to help members gain
          confidence and experience. We analyze problems and demonstrate
          practical techniques and methodologies that can be used during real
          interviews. We are growth focused and emphasize collaboration and
          knowledge sharing to strengthen our group and individual members.
        </div>

        <div className="content">
          <div className="columns">
            <div className="column">
              <h5 className="subtitle has-text-left hoplite-purple">
                What We Do.
              </h5>
              <ul>
                <li>Practice coding challenges and discuss solutions</li>
                <li>Host industry leading tech companies</li>
                <li>1-1 mock-interview sessions</li>
                <li>Team-based projects</li>
                <li>Share internship and interview knowledge</li>
              </ul>
            </div>
            <div className="column">
              <h5 className="subtitle has-text-left hoplite-purple">
                Why Join?
              </h5>
              <ul>
                <li>Priority access to industry events</li>
                <li>Gain access to shared industry contacts</li>
                <li>
                  Exposure to verified interview problems and techniques to
                  solve them
                </li>
                <li>Experienced community</li>
                <li>That sweet Hoplite merch</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
