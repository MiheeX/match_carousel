import { Component } from "react";
import imgPrematch from "../assets/bg-prematch.jpg";
import imgPostmatch from "../assets/bg-postmatch.jpg";
import imgLive from "../assets/bg-live.jpg";
import "./Card.css";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchStatus: 0,
    };
  }

  /*
  componentDidMount() {
    this.setState({ matchStatus: this.props.data.status._id });
  }
  */
  writeImg(pSrc) {
    return (
      <img
        className="bckg-img"
        src={pSrc}
        width="100%"
        height="100%"
        //style="opacity: 0.8"
      />
    );
  }
  setImage(pStatus) {
    console.log({ imgPostmatch });
    switch (pStatus) {
      case 100:
        return this.writeImg(imgPostmatch);
      case 0:
        return this.writeImg(imgPrematch);
      default:
        return this.writeImg(imgLive);
    }
  }

  render() {
    /*
    const bckgImg = {
      width: "850",
      height: "500",
      //display: "flex",
      position: "relative",
      // text-align: "center",
    };
    */

    console.log("Card.js LOG:");
    console.log(this.props.data);

    return (
      <>
        <div
          key={this.props.index}
          //style={bckgImg}
          className={
            this.props.index === this.props.page ? "carousel-content" : "hidden"
          }
        >
          {this.setImage(this.props.data.status._id)}
          <div>
            <p className="league-name">Naziv Lige {this.props.index}</p>
            <p className="league-type">Tip lige</p>
          </div>
          <div className="flag-left"></div>
          <div className="flag-right"></div>

          <div className="result">
            <p className="result-text">
              {this.props.data.result.home}:{this.props.data.result.away}
            </p>
          </div>
          <p className="team-left">{this.props.data.teams.home.name}</p>
          <p className="team-right">{this.props.data.teams.away.name}</p>
          <div className="match-status">
            <p>{"STATUS TEKME: " + this.props.data.status._id}</p>
          </div>
        </div>
      </>
    );
  }
}

export default Card;
