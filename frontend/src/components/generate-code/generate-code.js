import React from "react";

const GenerateCode = ({ code }) => (
  <div id="generate-code">
    <h3 className="subtitle">
      This part of website is for officers only! Generate code for members to
      check-in.
    </h3>
    Reresh page to generate new code. Codes expire after 10 minutes.
    <br />
    <div className="level code-display">
      {code ? (
        <h2 className="level-item">{code}</h2>
      ) : (
        <h2 className="level-item">------</h2>
      )}
    </div>
  </div>
);

export default GenerateCode;
