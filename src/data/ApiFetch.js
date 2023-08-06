import React, { Component } from "react";

class ApiFetch extends Component() {
  constructor(props) {
    super(props);

    this.state = {
      matchData: {},
    };

    this.state = this.state.bind(this);
  }

  //private readonly apiUrl: String = "https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074";

  FetchData() {
    fetch(
      "https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // this.setState = {
        //  matchData: data.json(),
        //};
        return data.json();
      });
  }

  /*
  render() {
    return <></>;
  }
  */
}

export default ApiFetch;
