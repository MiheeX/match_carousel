import { Component } from "react";
import { fetchData } from "../data/ApiFetch";
import MatchCarousel from "./MatchCarousel";

class MatchCarouselContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiData: [],
      show1: 0,
      show2: 0,
    };

    this.MatchCarouselWrapper = this.MatchCarouselWrapper.bind(this);
    this.Tabs = this.Tabs.bind(this);
    this.Case1 = this.Case1.bind(this);
    this.Case2 = this.Case2.bind(this);
    this.handle1 = this.handle1.bind(this);
    this.handle2 = this.handle2.bind(this);
  }

  componentDidMount() {
    if (!this.state.apiData.length) {
      this.getAndStoreData();
    }
  }

  getAndStoreData() {
    fetchData()
      .then((data) => {
        console.log("Loading data...");

        this.setState({
          apiData: data.doc[0].data,
        });
      })
      .then(() => {
        console.log("Data loaded!");
      })
      .catch((e) => console.log("error getting data: " + e));
  }

  //get realcategory data by sport_id. If undefined, returns all
  getRealCategoriesData(pSportId) {
    const parsedData = this.state.apiData;
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

  //get tournaments data filtered by sport_id and country_id.
  //if pCountryId is undefined returns for all sportId
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

  MatchCarouselWrapper(props) {
    return (
      <MatchCarousel
        apiData={this.state.apiData}
        matchesData={this.getMatchesData(props.sportId)}
        sportId={props.sportId}
        max={props.max}
      />
    );
  }

  //Tabs for showing components
  Case1() {
    if (this.state.show1 === 1) {
      return (
        <>
          <this.MatchCarouselWrapper sportId={1} max={10} />
        </>
      );
    }
  }

  Case2() {
    if (this.state.show2 === 1) {
      return (
        <>
          <this.MatchCarouselWrapper sportId={1} />
          <this.MatchCarouselWrapper sportId={2} />
        </>
      );
    }
  }

  Tabs() {
    const buttonStyle = { width: "100px", height: "30px" };
    return (
      <>
        <button style={buttonStyle} onClick={this.handle1}>
          Tab 1
        </button>
        <button style={buttonStyle} onClick={this.handle2}>
          Tab 2
        </button>
      </>
    );
  }

  handle1() {
    this.setState({ show1: 1, show2: 0 });
  }

  handle2() {
    this.setState({ show1: 0, show2: 1 });
  }

  render() {
    const buttonStyle = { width: "100px", height: "30px" };
    return (
      <>
        <this.Tabs />
        <this.Case1 />
        <this.Case2 />
      </>
    );
  }
}

export default MatchCarouselContainer;
