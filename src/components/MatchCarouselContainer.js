import { Component } from "react";
import { fetchData } from "../data/ApiFetch";
import MatchCarousel from "./MatchCarousel";

class MatchCarouselContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiData: [],
    };

    this.MatchCarouselWrapper = this.MatchCarouselWrapper.bind(this);
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

  render() {
    return (
      <>
        <this.MatchCarouselWrapper sportId={1} max={2} />
        <this.MatchCarouselWrapper sportId={2} />
      </>
    );
  }
}

export default MatchCarouselContainer;
