import { Component } from "react";
import imgPrematch from "../assets/bg-prematch.jpg";
import imgPostmatch from "../assets/bg-postmatch.jpg";
import imgLive from "../assets/bg-live.jpg";
import "./Card.css";
import { getFlagUrl } from "../data/ApiFetch";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.Flag = this.Flag.bind(this);
    this.Result = this.Result.bind(this);
    this.Team = this.Team.bind(this);
    this.Image = this.Image.bind(this);
    this.League = this.League.bind(this);
    this.MatchStatus = this.MatchStatus.bind(this);
  }

  writeImg(pSrc) {
    const styleFilter = { filter: "brightness(0.6)" };
    return <img className="bckg-img" src={pSrc} style={styleFilter} />;
  }

  setImageSrc(pStatus) {
    switch (pStatus) {
      case 100:
        return imgPostmatch;
      case 0:
        return imgPrematch;
      default:
        return imgLive;
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
          "VS" +
          " \r " +
          this.props.matchData._dt.time +
          " \r " +
          this.props.matchData._dt.date
        );
      default:
        if (this.props.matchData.result.home !== null) {
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

  Image(props) {
    switch (props.status) {
      case 100:
        return this.writeImg(imgPostmatch);
      case 0:
        return this.writeImg(imgPrematch);
      default:
        return this.writeImg(imgLive);
    }
  }

  Flag(props) {
    return (
      <div
        className={"flag flag-" + props.team}
        style={{
          backgroundImage: "url('" + getFlagUrl(props.teamUid) + "')",
        }}
      ></div>
    );
  }

  Result(props) {
    return (
      <div className="result">
        <p
          className={
            props.status_id === 0 ? "result-text-0" : "result-text-100"
          }
        >
          {this.setResult(props.status_id)}
        </p>
      </div>
    );
  }

  Team(props) {
    return (
      <p className={"team-name team-name-" + props.team}>{props.teamName}</p>
    );
  }

  League(props) {
    return (
      <div>
        <p className="league-name">
          {props.tdata.name + "-" + props.tdata.seasontypename}
        </p>
        <p className="league-type">{props.rcdata.name}</p>
      </div>
    );
  }

  MatchStatus(props) {
    return (
      <div
        className="match-status"
        style={{
          backgroundColor: this.setStatusColor(props.matchStatus._id),
        }}
      >
        <p>{props.matchStatus.name.toUpperCase()}</p>
      </div>
    );
  }

  render() {
    const $matchData = this.props.matchData;
    const $realCatData = this.props.rcData;
    const $tournamnetData = this.props.tData;

    const ParentClassName =
      this.props.index === this.props.page
        ? "carousel-content bckg-img"
        : "carousel-content bckg-img";

    return (
      <>
        <div key={this.props.index} className={ParentClassName}>
          <this.Image status={$matchData.status._id} />
          <this.League rcdata={$realCatData} tdata={$tournamnetData} />
          <this.Flag team="home" teamUid={$matchData.teams.home.uid} />
          <this.Flag team="away" teamUid={$matchData.teams.away.uid} />
          <this.Result status_id={$matchData.status._id} />
          <this.Team team="home" teamName={$matchData.teams.home.name} />
          <this.Team team="away" teamName={$matchData.teams.away.name} />
          <this.MatchStatus matchStatus={$matchData.status} />
        </div>
      </>
    );
  }
}

export default Card;
