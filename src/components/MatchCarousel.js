import { Component } from "react";
import React from "react";
import "./MatchCarousel.css";
import Card from "./Card";

class MatchCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sportId: undefined,
      max: this.props.max, //instead of this.state.max, this.props.max is used in code
      page: 0,
      timer: 0,
      timerInitialized: false,
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.CarouselButtons = this.CarouselButtons.bind(this);
    this.DotsIndicator = this.DotsIndicator.bind(this);
    this.InitCarouselData = this.InitCarouselData.bind(this);
  }

  componentDidMount() {
    this.setState({
      //matchesData: this.props.matchesData.slice(0, this.props.max),
      //matchesCount: this.props.matchesData.slice(0, this.props.max).length,
      sportId: this.props.sportId,
    });

    if (!this.state.timerInitialized) {
      this.resetTimer();
      this.state = { timerInitialized: true };
    } else {
      clearInterval(this.state.timer);
    }
  }

  //<--------------- DATA PARSING START ----------------->
  //getting and parsing matches data start
  //schema: realcategories/tournamnets/matches/match(obj)

  //get/parse matches initial data
  getRealCategoriesData(pSportId) {
    //const parsedData = this.state.apiData;
    const parsedData = this.props.apiData;
    let realCategoryData = [];

    if (pSportId === undefined) {
      parsedData.map((_data) => {
        _data.realcategories.map((_data2) => {
          realCategoryData.push(_data2);
        });
      });
    } else {
      parsedData
        .filter((filteredData) => filteredData._id === pSportId)
        .map((_data) => {
          realCategoryData = _data.realcategories;
        });
    }

    return realCategoryData;
  }

  //get tournaments data filtered by sport_id and country_id
  getTournamentsData(pSportId, pCountryId) {
    const $realCategoryData = this.getRealCategoriesData(pSportId);

    let tournamentsData = [];
    if (pCountryId === undefined) {
      $realCategoryData.map((_data) => {
        _data.tournaments.map((_data2) => {
          tournamentsData.push(_data2);
        });
      });
    } else {
      $realCategoryData
        .filter((filteredData) => filteredData._id === pCountryId)
        .map((_data) => {
          tournamentsData = _data.tournaments;
        });
    }

    return tournamentsData;
  }

  //get multiple matches data, filtered by sport_id(sport_id) and country_id(realcategory_id)
  getMatchesData(pSportId, pCountryId) {
    let $matchesData = [];

    this.getTournamentsData(pSportId, pCountryId).map((_data) => {
      _data.matches.map((_data2) => {
        $matchesData.push(_data2);
      });
    });

    return $matchesData;
  }

  //DATA GETTERS START
  //Realcategories data getter
  getRealCategoriesDataById(pRealCatId) {
    let realCategoryData = [];

    this.getRealCategoriesData(this.props.sportId)
      .filter((filteredData) => filteredData._id === pRealCatId)
      .map((_data) => {
        realCategoryData = _data;
      });
    return realCategoryData;
  }

  //Tournaments data getter
  getTournamentsDataById(pTournamentId) {
    let tournamentData = [];

    this.getTournamentsData(this.props.sportId)
      .filter((filteredData) => filteredData._id === pTournamentId)
      .map((_data) => {
        tournamentData = _data;
      });

    return tournamentData;
  }

  //Matches data getter
  //Get single match data by "_id"
  getMatchDataById(pMatchId) {
    let matchData = [];

    this.props.matchesData
      .filter((filteredData) => filteredData._id === pMatchId)
      .map((_data) => {
        matchData = _data;
      });

    return matchData;
  }
  //DATA GETTERS END
  //<---------- DATA PARSING END ----------------->//

  //<---------- BUTTON HANDLERS START ----------------->//
  handleNext() {
    const matchesCount =
      this.props.matchesData.slice(0, this.props.max).length - 1;
    let handledPage = this.state.page;

    if (!(handledPage >= matchesCount)) {
      handledPage += 1;
    } else {
      handledPage = 0;
    }

    this.setState({ page: handledPage });
    this.resetTimer();
  }

  handlePrev() {
    const matchesCount =
      this.props.matchesData.slice(0, this.props.max).length - 1;
    let handledPage = this.state.page;

    if (!(handledPage <= 0)) {
      handledPage -= 1;
    } else {
      handledPage = matchesCount;
    }

    this.setState({ page: handledPage });
    this.resetTimer();
  }

  handleDotsIndicator(index) {
    this.setState({ page: index });
    this.resetTimer();
  }
  //<---------- BUTTON HANDLERS END ----------------->//

  DotsIndicator() {
    const matchesCount = this.props.matchesData.slice(0, this.props.max).length;
    let indicators = [];
    for (let i = 0; i < matchesCount; i++) {
      indicators.push(this.dotIndicatorButton(i));
    }

    return indicators;
  }

  dotIndicatorButton(index) {
    return (
      <button
        key={index}
        onClick={this.handleDotsIndicator.bind(this, index)}
        className={
          index === this.state.page
            ? "dot-indicator dot-indicator-active"
            : "dot-indicator"
        }
      ></button>
    );
  }

  CarouselButtons() {
    return (
      <>
        <button
          onClick={this.handlePrev}
          className="btn-nav-wrapper btn-nav btn-nav-prev"
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        <button
          onClick={this.handleNext}
          className="btn-nav-wrapper btn-nav btn-nav-next"
        >
          <i className="fa fa-chevron-right"></i>
        </button>
        <span className="dot-indicators">
          <this.DotsIndicator />
        </span>
      </>
    );
  }

  setTimer() {
    let timer = setInterval(() => {
      this.handleNext();
    }, 4000); //+1s = carousel transition

    return timer;
  }

  resetTimer() {
    let $timer = this.setTimer();

    clearInterval(this.state.timer);
    this.setState({ timer: $timer });
  }

  //set Card components and pass data
  InitCarouselData() {
    let vCarouselData = [];
    const $matchesData = this.props.matchesData;
    const slicedData = $matchesData.slice(0, this.props.max);
    const length = slicedData.length;

    for (let i = 0; i < length; i++) {
      vCarouselData.push(this.carouselDataCardComponent(i));
    }
    return vCarouselData;
  }

  carouselDataCardComponent(pIndex) {
    //const $matchesData = this.state.matchesData[pIndex];
    const $matchesData = this.props.matchesData.slice(0, this.props.max);
    const $matchData = $matchesData[pIndex];

    return (
      <Card
        index={pIndex}
        key={pIndex}
        page={this.state.page}
        matchData={$matchData}
        rcData={this.getRealCategoriesDataById($matchData._rcid)}
        tData={this.getTournamentsDataById($matchData._tid)}
      />
    );
  }

  doRender() {
    const slideCarousel = {
      transform: "translateX(-" + this.state.page * 100 + "%)",
    };

    return (
      <>
        <div className="carousel-wrapper">
          <div className="carousel-content-wrapper">
            <div className="carousel-content" style={slideCarousel}>
              <this.InitCarouselData />
            </div>
            <this.CarouselButtons />
          </div>
        </div>
      </>
    );
  }

  render() {
    return this.doRender();
  }
}

MatchCarousel.defaultProps = {
  max: 10,
  sportId: undefined,
};

export default MatchCarousel;
