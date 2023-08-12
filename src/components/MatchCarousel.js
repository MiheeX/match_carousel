import { Component, componentDidMount } from "react";
import React from "react"; //zaradi compilerja, da ne javi napake pri <div> znotraj render/return
import { CarouselData } from "../data/CarouselData";
import "./MatchCarousel.css";

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
      page: 0,
      data2: {},
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
    if (!response.ok) {
      throw new Error("Error getting data!");
    } else {
      return response.json;
    }
  };

  getData() {
    this.fetchData()
      /*
      .then(() => {
        console.log("getting data inside promise...");
      })
      */
      .then((data) => {
        console.log("Loading data...");
        this.setState({
          matchData: data,
          dataIsRead: true,
        });
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
      //console.log(this.FetchData());
      this.getData();
      const data = this.state.matchData; //json
      //const parsedData = JSON.parse(data);//parsed

      this.setState({ data2: data });

      //console.log(parsedData.doc[0].event);
      //console.log(JSON.parse(JSON.parse(data.doc[0])));
      /*data.doc.map((item, index)=>{
        console.log('data log:' + item.event);
      });
      */

      /*
      data.map((_data) => {
        const selectedJson = _data.doc.event;
        selectedJson.map((_sel) => {
          if (_sel._doc === "sport" && _sel.name === "Soccer") {
            console.log("Selected is soccer");
          }
        });
      });
    }    
    */
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

  //button handles start
  handleNext() {
    let handledPage = this.state.page;
    if (!(handledPage + 1 > CarouselData.length)) {
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
    for (let i = 0; i < CarouselData.length; i++) {
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

  InitCarouselData() {
    let vCarouselData = [];
    for (let i = 0; i < CarouselData.length; i++) {
      vCarouselData.push(this.CarouselData(i));
    }

    return vCarouselData;
  }

  CarouselData(index) {
    //return <p>SCENKA DELA</p>;

    //console.log(this.state.page);
    console.log("index: " + index);

    return (
      <img
        key={index}
        src={CarouselData[index].image}
        className={index === this.state.page ? "carousel-content" : "hidden"}
      ></img>
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
