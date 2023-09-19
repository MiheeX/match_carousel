import { Component } from "react";
import imgPrematch from "../assets/bg-prematch.jpg";
import imgPostmatch from "../assets/bg-postmatch.jpg";
import imgLive from "../assets/bg-live.jpg";
import "./Card.css";
import MatchCarousel from "./MatchCarousel";
import { getFlagUrl } from "../data/ApiFetch";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchStatus: 0,
      realcategoryData: [],
    };
  }

  writeImg(pSrc) {
    return (
      <img
        className="bckg-img"
        src={pSrc}
        width="100%"
        height="100%"
        style={{ filter: "brightness(0.6)" }} //ABUG PRVI SLIDE NIMA BORDER RADIUSA
      />
    );
  }

  setImageSrc(pStatus) {
    console.log({ imgPostmatch });
    switch (pStatus) {
      case 100:
        return imgPostmatch;
      case 0:
        return imgPrematch;
      default:
        return imgLive;
    }
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

  setResult(pStatus) {
    switch (pStatus) {
      case 100:
        return (
          this.props.matchData.result.home +
          ":" +
          this.props.matchData.result.away
        );
      case 0:
        return (
          this.props.matchData._dt.time + "\r" + this.props.matchData._dt.date
        );
      default:
        if (!this.props.matchData.result.home == null) {
          return (
            this.props.matchData.result.home +
            ":" +
            this.props.matchData.result.away
          );
        }
    }
  }

  setStatusName(pStatus) {
    switch (pStatus) {
      case 100:
        return "ENDED";
      case 0:
        return "NOT STARTED";
      default:
        return "GAMETIME";
    }
  }
  setStatusColor(pStatusId) {
    switch (pStatusId) {
      case 100:
        return "green";
      case 0:
        return "grey";
      default:
        return "orange";
    }
  }

  render() {
    const $matchData = this.props.matchData;
    const $realCatData = this.props.rcData;
    const $tournamnetData = this.props.tData;

    return (
      //slideshow
      <>
        <div
          key={this.props.index}
          //style={bckgImg}
          className={
            this.props.index === this.props.page
              ? "carousel-content active bckg-img "
              : "carousel-content hidden bckg-img "
          } //slide
        >
          {this.setImage($matchData.status._id)}
          <div>
            <p className="league-name">
              {$tournamnetData.name + "-" + $tournamnetData.seasontypename}
            </p>
            <p className="league-type">{$realCatData.name}</p>
          </div>
          <div
            className="flag flag-home"
            style={{
              backgroundImage:
                "url('" + getFlagUrl($matchData.teams.home.uid) + "')",
            }}
          ></div>
          <div
            className="flag flag-away"
            style={{
              backgroundImage:
                "url('" + getFlagUrl($matchData.teams.away.uid) + "')",
            }}
          ></div>

          <div className="result">
            <p className="result-text">
              {/*this.props.matchData.result.home}:{this.props.matchData.result.away*/}
              {this.setResult($matchData.status._id)}
            </p>
          </div>
          <p className="team-name team-name-home">
            {$matchData.teams.home.name}
          </p>
          <p className="team-name team-name-away">
            {$matchData.teams.away.name}
          </p>
          <div
            className="match-status"
            style={{
              backgroundColor: this.setStatusColor($matchData.status._id),
            }}
          >
            <p>{$matchData.status.name.toUpperCase()}</p>
          </div>
        </div>
      </>
    );
  }
}

export default Card;
