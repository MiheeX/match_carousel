import { Component, componentDidMount } from "react";
import React from "react"; //zaradi compilerja, da ne javi napake pri <div> znotraj render/return
import { CarouselData } from "../data/CarouselData";

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
      matchData: {},
      dataIsRead: false,
      selectedData: {},
    };
  }

  //API data fetch start
  //TODO in seperate packet /data/ApiFetch...
  FetchData = () => {
    fetch(
      "https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          matchData: data,
          dataIsRead: true,
        });
        //return data.json();
      });
  };
  //API data fetch end

  componentDidMount() {
    if (!this.state.dataIsRead) {
      console.log("getting data");
      //console.log(this.FetchData());
      this.FetchData();
      const data = this.state.matchData;
      console.log(data);

      data.map((_data) => {
        const selectedJson = _data.doc.event;
        selectedJson.map((_sel) => {
          if (_sel._doc === "sport" && _sel.name === "Soccer") {
            console.log("Selected is soccer");
          }
        });
      });
    }
  }

  //TODO Could go to utils packet
  //utils data start
  GetDataBySportCategory(category) {
    const selected = Object.values(this.state.matchData).find(
      (j) => j._doc === "sport" && j._name === { category }
    );
    //this.setState({ selectedData: selected });
    //console.log("getting data for category " + { category });
    //console.log(this.state.selectedData);
  }
  //utils data end

  //da se izogneš side effectom ali subscriptionov v konstruktorju, uporabi componentDidMount instead
  //componentDidMount() is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here.
  //If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
  //This method is a good place to set up any subscriptions. If you do that, don’t forget to unsubscribe in componentWillUnmount().
  //You may call setState() immediately in componentDidMount(). It will trigger an extra rendering, but it will happen before the browser updates the screen.
  // In most cases, you should be able to assign the initial state in the constructor().
  //It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

  //slike: display:none oz. block,
  //dotsi: "className="active" oz. ""

  InitCarouselData = () => {
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
  };

  InitTest = () => {
    return <p>DELAA</p>;
  };

  doRender() {
    //this.GetDataBySportCategory("Soccer");
    return (
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-content-wrapper">
            <div className="carousel-content">{this.InitCarouselData()}</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.doRender();
  }
}

export default MatchCarousel;
