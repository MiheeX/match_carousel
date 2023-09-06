import { Component, componentDidMount } from "react";
import React from "react"; //zaradi compilerja, da ne javi napake pri <div> znotraj render/return
import { CarouselData } from "../data/CarouselData";
import "./MatchCarousel.css";
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
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.CarouselButtons = this.CarouselButtons.bind(this);
    //this.handleDotsIndicator = this.handleDotsIndicator.bind(this);
    this.dotIndicators = this.dotIndicators.bind(this);
  }

  //API data fetch start
  //TODO in seperate packet /data/ApiFetch...
  fetchData = async () => {
    const response = await fetch(
      "https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074" //, {method: "GET"}
    );
    //team flag PNG: "http://ls.betradar.com/ls/crest/big/<team_id>.png"
    if (!response.ok) {
      throw new Error("Error getting data!");
    } else {
      return response.json();
    }
  };

  getAndStoreData() {
    this.fetchData()
      .then((data) => {
        console.log("Loading data...");
        const $data = this.getMatchesData(this.props.sportId).slice(
          0,
          this.props.max
        );
        this.setState({
          apiData: data.doc[0].data,
          dataIsRead: true,
          matchesData: $data,
          matchesCount: $data.length,
        });

        console.log(data.doc[0].data);
      })
      .then(() => {
        console.log("Data loaded!");
      })
      .catch((e) => console.log("error getting data: " + e));
  }

  //API data fetch end

  componentDidMount() {
    if (!this.state.dataIsRead) {
      console.log("reading data...");
      this.getAndStoreData();
    }
  }

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
    if (!(handledPage + 1 > this.state.matchesCount - 1)) {
      handledPage += 1;
    }

    this.setState({ page: handledPage });
  }

  handlePrev() {
    let handledPage = this.state.page;
    if (!(handledPage - 1 < 0)) {
      handledPage -= 1;
    }

    this.setState({ page: handledPage });
  }

  handleDotsIndicator(index) {
    this.setState({ page: index });
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
          index === this.state.page ? "dot-indicator-active" : "dot-indicator"
        }
      ></button>
    );
  }

  CarouselButtons() {
    return (
      <>
        <button onClick={this.handlePrev} className="btn-slider btn-prev">
          Prev
        </button>
        <button onClick={this.handleNext} className="btn-slider btn-next">
          Next
        </button>
        <span className="dot-indicators">
          <this.dotIndicators />
        </span>
      </>
    );
  }
  // button handles end

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
          console.log("Selected ID = " + _data._id);
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
    var tournamentsData = [];
    if (pCountryId === undefined) {
      this.getRealCategoriesData(pSportId).map((_data) => {
        _data.tournaments.map((_data2) => {
          tournamentsData.push(_data2);
        });
      });
    } else {
      this.getRealCategoriesData(pSportId)
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

  //set and use data
  InitCarouselData() {
    //test cases for matches data!
    //this.getMatchesData(1,1); //ne sme biti v render funkciji, drugače se ponavlja...
    //this.getRealCategoriesData(); //OK undefined
    //this.getTournamentsData(undefined, undefined); //OK undefined
    //this.getMatchesData();
    //this.getMatchDataById(43523147);
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
    }
    console.log("carouselData length:" + $length);

    //vCarouselData = this.getMatchesData(1);

    return vCarouselData;
  }
  //

  CarouselData(index) {
    //return <p>SCENKA DELA</p>;

    //console.log(this.state.page);
    //console.log("index: " + index);

    /*
    return (
      <img
        key={index}
        src={CarouselData[index].image}
        className={index === this.state.page ? "carousel-content" : "hidden"}
      ></img>
    );
    */
    return (
      <Card
        index={this.state.page}
        data={this.state.matchesData[this.state.page]}
      />
    );
  }

  doRender() {
    //this.GetDataBySportCategory("Soccer");
    return (
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-content-wrapper">
            <div className="carousel-content">{this.InitCarouselData()}</div>
          </div>
          <this.CarouselButtons />
        </div>
      </div>
    );
  }

  render() {
    return this.doRender();
  }
}

export default MatchCarousel;
