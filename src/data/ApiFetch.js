import React, { Component } from "react";
//API data fetch start
//TODO in seperate packet /data/ApiFetch...
export var _apiData = [];
export var _sportId = 0;

export const fetchData = async () => {
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

///// naprej todo: da dela OK z MatchCarousel.js ////
export function getAndStoreDataApi(pSportId, pMax) {
  let apiData = [];

  fetchData()
    .then((data) => {
      console.log("Loading data...");
      const $data = getMatchesData(pSportId).slice(0, pMax);
      //create callback function here, to setState in different file (MatchCarousel)
      /*
      this.setState({
        apiData: data.doc[0].data,
        dataIsRead: true,
        matchesData: $data,
        matchesCount: $data.length,
      });
      */
      apiData = data.doc[0].data;
    })

    .then(() => {
      console.log("Data loaded!");
      return apiData;
    })
    .catch((e) => console.log("error getting data: " + e));
}

//API data fetch end

export function getRealCategoriesData(pData, pSportId) {
  //const parsedData = this.state.apiData;
  const parsedData = _apiData;
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

export function getRealCategoriesDataById(pRealCatId) {
  var realCategoryData = [];
  getRealCategoriesData(_sportId)
    .filter((filteredData) => filteredData._id === pRealCatId)
    .map((_data) => {
      realCategoryData = _data;
    });
  return realCategoryData;
}

export function getTournamentsDataById(pTournamentId) {
  var tournamentData = [];
  getTournamentsData(_sportId)
    .filter((filteredData) => filteredData._id === pTournamentId)
    .map((_data) => {
      tournamentData = _data;
    });
  return tournamentData;
}

//get tournaments data filtered by sport_id and country_id
export function getTournamentsData(pSportId, pCountryId) {
  var tournamentsData = [];
  if (pCountryId === undefined) {
    getRealCategoriesData(pSportId).map((_data) => {
      _data.tournaments.map((_data2) => {
        tournamentsData.push(_data2);
      });
    });
  } else {
    getRealCategoriesData(pSportId)
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
export function getMatchesData(pSportId, pCountryId) {
  var matchesData = [];
  getTournamentsData(pSportId, pCountryId).map((_data) => {
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
export function getMatchDataById(pMatchId) {
  var matchData = [];
  getMatchesData()
    .filter((filteredData) => filteredData._id === pMatchId)
    .map((_data) => {
      matchData = _data;
    });
  console.log("Single match data...");
  console.log(matchData);
  return matchData;
}
