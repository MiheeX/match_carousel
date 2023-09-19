import { Component, componentDidMount } from "react";
import React from "react"; //zaradi compilerja, da ne javi napake pri <div> znotraj render/return
import { CarouselData } from "../data/CarouselData";
import "./MatchCarousel.css";
import {
  fetchData,
  getAndStoreDataApi,
  /*
  getTournamentsDataById,
getRealCategoriesDataById,
  getMatchesData,
  _apiData,
  _sportId,
  */
} from "../data/ApiFetch";
import Card from "./Card";

class MatchCarousel extends Component {
  //<{}, { sportId: Number, max: Number }>
  //construcotr, če delaš state in bind methode.
  //constructor se pokliče pred mountanjem.
  //component..didMount, componentDidMount

  constructor(props) {
    //vedno najprej pokličeš super(props), pred katerimkoli drugim klicem. Drugače so this.props undefined v konstruktorju - potentialni bugi.
    //constructor uporabiš za inicializacijo local state-a, ko mu daš vrednost this.state
    //in za Binding event handler.
    //v constructorju ne smeš klicat setState. Namesto tega, določi inicial state direktno to this.state.
    super(props);

    this.state = {
      sportId: 1,
      max: 10,
      apiData: [],
      matchesData: [],
      realCategoryData: [],
      matchesCount: 0,
      dataIsRead: false,
      page: 0,
      timerCountdownSeconds: 4000,
      timer: 0,
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.CarouselButtons = this.CarouselButtons.bind(this);
    //this.handleDotsIndicator = this.handleDotsIndicator.bind(this);
    this.dotIndicators = this.dotIndicators.bind(this);
  }

  //getting and parsing matches data start
  //schema: realcategories/tournamnets/matches/match(obj)
  //get/parse matches initial data
  getAndStoreData() {
    /*
    //ne dela ok
    this.setState({
      apiData: getAndStoreDataApi(this.props.sportId, this.props.max),
      dataIsRead: true,
    });
    console.log("ApiDataTest:");
    console.log(getAndStoreDataApi(this.props.sportId, this.props.max));
*/

    fetchData()
      .then((data) => {
        console.log("Loading data...");
        const $matchesData = this.getMatchesData(this.props.sportId).slice(
          0,
          this.props.max
        );
        //make callback function, and move to components/data/ApiFetch
        this.setState({
          apiData: data.doc[0].data,
          dataIsRead: true,
          matchesData: $matchesData,
          matchesCount: $matchesData.length,
        });

        console.log(data.doc[0].data);
      })
      .then(() => {
        console.log("Data loaded!");
      })
      .catch((e) => console.log("error getting data: " + e));
  }

  //API data fetch end

  //<--------------- DATA PARSING START ----------------->
  //getting and parsing matches data start
  //schema: realcategories/tournamnets/matches/match(obj)
  //get/parse matches initial data
  getRealCategoriesData(pSportId) {
    const parsedData = this.state.apiData;
    console.log("test modeling data");
    console.log(parsedData);
    var realCategoryData = [];

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
    console.log("realcategory data");
    console.log(realCategoryData);
    //setState ne sme biti v render funkciji
    //this.setState({ realCategoryData: realCategoryData });
    return realCategoryData;
  }

  //get tournaments data filtered by sport_id and country_id
  getTournamentsData(pSportId, pCountryId) {
    const $realCategoryData = this.getRealCategoriesData(pSportId);

    var tournamentsData = [];
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
    console.log("tournaments data:...");
    console.log(tournamentsData);
    return tournamentsData;
  }

  //get multiple matches data, filtered by sport_id(sport_id) and country_id(realcategory_id)
  getMatchesData(pSportId, pCountryId) {
    var matchesData = [];

    this.getTournamentsData(pSportId, pCountryId).map((_data) => {
      _data.matches.map((_data2) => {
        matchesData.push(_data2);
      });
    });
    //console.log("outside data matches data:...");
    //console.log(matchesData);
    console.log(matchesData);
    //this.setState({ matchesCount: matchesData.length });
    return matchesData;
  }

  //Realcategories data getter
  getRealCategoriesDataById(pRealCatId) {
    var realCategoryData = [];

    this.getRealCategoriesData(this.props.sportId) //local props
      .filter((filteredData) => filteredData._id === pRealCatId)
      .map((_data) => {
        realCategoryData = _data;
      });
    return realCategoryData;
  }

  //DATA GETTERS
  //Tournaments data getter
  getTournamentsDataById(pTournamentId) {
    var tournamentData = [];

    this.getTournamentsData(this.props.sportId) //local props
      .filter((filteredData) => filteredData._id === pTournamentId)
      .map((_data) => {
        tournamentData = _data;
      });
    return tournamentData;
  }

  //matches data getter
  //Get single match data by "_id"
  getMatchDataById(pMatchId) {
    var matchData = [];

    this.getMatchesData()
      .filter((filteredData) => filteredData._id === pMatchId)
      .map((_data) => {
        matchData = _data;
      });
    console.log("Single match data...");
    console.log(matchData);
    return matchData;
  }
  //getting and parsing matches data end
  //<---------- DATA PARSING END ----------------->//

  componentDidMount() {
    if (!this.state.dataIsRead) {
      console.log("reading data...");
      this.getAndStoreData();
    }
    //this.resetTimer();
    //this.HandleAutoChangeSLides();
  }

  componentDidUpdate(props) {}

  //da se izogneš side effectom ali subscriptionov v konstruktorju, uporabi componentDidMount instead
  //componentDidMount() is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here.
  //If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
  //This method is a good place to set up any subscriptions. If you do that, don’t forget to unsubscribe in componentWillUnmount().
  //You may call setState() immediately in componentDidMount(). It will trigger an extra rendering, but it will happen before the browser updates the screen.
  // In most cases, you should be able to assign the initial state in the constructor().
  //It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

  //slike: display:none oz. block,
  //dotsi: "className="active" oz. ""

  /*
  InitCarouselDataTest() {
    if (CarouselData.length > 0) {
      //console.log("deluje");
      //const data = this.FetchData();

      CarouselData.map((slideData, index) => {
        console.log("index=" + index);
        console.log("img for index" + slideData.image);

        if (index === 3) {
          console.log("znotraj map-a:" + slideData.image);
          return <p>SCENKA DELA</p>;
        } else {
          return <p>Nope!</p>;
        }
      });
    } else
      return (
        <div>
          <p>Prazno!</p>
        </div>
      );
  }
  */

  //button handles start
  handleNext() {
    let handledPage = this.state.page;
    if (!(handledPage + 1 >= this.state.matchesCount)) {
      handledPage += 1;
    } else {
      handledPage = 0;
    }

    this.setState({ page: handledPage });
    this.resetTimer();
  }

  handlePrev() {
    let handledPage = this.state.page;
    if (!(handledPage - 1 < 0)) {
      handledPage -= 1;
    } else {
      handledPage = this.state.matchesCount - 1;
    }

    this.setState({ page: handledPage });
    this.resetTimer();
  }

  handleDotsIndicator(index) {
    this.setState({ page: index });

    this.resetTimer();

    console.log("dot index:" + index);
  }

  dotIndicators() {
    let indicators = [];
    for (let i = 0; i < this.state.matchesCount; i++) {
      indicators.push(this.dotIndicator(i));
    }

    return indicators;
  }

  dotIndicator(index) {
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
          <this.dotIndicators />
        </span>
      </>
    );
  }

  //test functions. Works OK, but can't reset it easily.. todo...
  HandleAutoChangeSLides() {
    var interval = this.state.timerCountdownSeconds;
    var expected = Date.now();
    var stateTimerCountdownSeconds = this.state.timerCountdownSeconds;
    const $that = this;
    const $handleNext = this.handleNext;
    this.setState({ timeoutID: setTimeout(step, interval) });

    function step() {
      var dt = Date.now() - expected;
      if (dt > interval) {
        //not ok
      }
      console.log("should print every interval ms");
      console.log(interval);
      $handleNext();

      expected += interval;
      setTimeout(step, Math.max(0, interval - dt));
    }
    console.log("timeoutID: " + this.state.timeoutID);
  }
  // button handles end

  resetTimer() {
    let $timer = setInterval(() => {
      this.handleNext();
    }, 4000);

    clearInterval(this.state.timer);
    this.setState({ timer: $timer });
  }

  //set and use data
  InitCarouselData() {
    //test cases for matches data!
    //this.getMatchesData(1,1); //ne sme biti v render funkciji, drugače se ponavlja...
    //this.getRealCategoriesData(); //OK undefined
    //this.getTournamentsData(undefined, undefined); //OK undefined
    //this.getMatchesData();
    //this.getMatchDataById(43523147);
    //this.getRealCategoriesDataById(395);
    //

    let vCarouselData = [];
    /*
    for (let i = 0; i < CarouselData.length; i++) {
      vCarouselData.push(this.CarouselData(i));
    }
    */

    var $length = this.state.matchesCount;
    for (let i = 0; i < $length; i++) {
      vCarouselData.push(this.CarouselData(i));
      console.log("carouselData length:" + $length + "and i:" + i);
    }

    //vCarouselData = this.getMatchesData(1);

    return vCarouselData;
  }
  //

  CarouselData(pIndex) {
    var $matchesData = this.state.matchesData[pIndex];

    return (
      <Card
        index={pIndex}
        key={pIndex}
        page={this.state.page}
        matchData={$matchesData} //če ne prikaže, je lahko tukaj pri var problem
        rcData={this.getRealCategoriesDataById($matchesData._rcid)}
        tData={this.getTournamentsDataById($matchesData._tid)}
      />
    );
  }

  doRender() {
    //this.GetDataBySportCategory("Soccer");
    return (
      <div className="carousel-container">
        {/*content*/}
        <div className="carousel-wrapper">
          {/*carousel-content*/}
          <div className="carousel-content-wrapper">
            {/*slideshow*/}
            <div
              className="carousel-content"
              style={{
                transform: "translateX(-" + this.state.page * 100 + "%)",
              }}
            >
              {/*Slides (slideshow-wrapper)*/}
              {this.InitCarouselData()}
            </div>
            <this.CarouselButtons />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.doRender();
  }
}

//izven class componenta. je to ok?
MatchCarousel.defaultProps = {
  max: 10,
  sportId: undefined,
};

export default MatchCarousel;
