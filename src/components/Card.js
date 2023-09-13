import { Component } from "react";
import imgPrematch from "../assets/bg-prematch.jpg";
import imgPostmatch from "../assets/bg-postmatch.jpg";
import imgLive from "../assets/bg-live.jpg";
import "./Card.css";
import MatchCarousel from "./MatchCarousel";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchStatus: 0,
      realcategoryData: [],
    };
  }

  /*
  componentDidMount() {
    this.setState({
      realcategoryData: MatchCarousel.getRealCategoriesDataById(
        this.props.matchData._rcid
      ),
    });
    console.log("RealCategoryDataByID:");
    console.log(this.props.matchData._rcid);
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
        return (
          this.props.matchData.result.home +
          ":" +
          this.props.matchData.result.away
        );
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
    console.log(this.props.matchData);

    return (
      //slideshow
      <>
        <div
          key={this.props.index}
          //style={bckgImg}
          className={
            this.props.index === this.props.page
              ? "carousel-content active"
              : "carousel-content hidden"
          } //slide
        >
          {this.setImage(this.props.matchData.status._id)}
          <div>
            <p className="league-name">
              {this.props.tData.name + "-" + this.props.tData.seasontypename}
            </p>
            <p className="league-type">{this.props.rcData.name}</p>
          </div>
          <div className="flag-left"></div>
          <div className="flag-right"></div>

          <div className="result">
            <p className="result-text">
              {/*this.props.matchData.result.home}:{this.props.matchData.result.away*/}
              {this.setResult(this.props.matchData.status._id)}
            </p>
          </div>
          <p className="team-left">{this.props.matchData.teams.home.name}</p>
          <p className="team-right">{this.props.matchData.teams.away.name}</p>
          <div className="match-status">
            <p>{this.props.matchData.status.name}</p>
          </div>
        </div>
      </>
    );
  }
}

export default Card;
