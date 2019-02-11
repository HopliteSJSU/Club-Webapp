import React from "react";

class Card extends React.Component {
  state = {};

  handleCardClick = () => (window.location.href = this.props.linkedin);

  render() {
    const { img, name, role } = this.props;

    return (
      <div className="column">
        <div className="card" onClick={this.handleCardClick}>
          <div className="card-image noselect">
            <figure className="image is-4by3">
              <img alt={name} src={img} width="100%" draggable="false" />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-content">
                <p className="title is-5 has-text-centered">{name}</p>
                <p className="subtitle is-6 has-text-centered hoplite-purple">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
