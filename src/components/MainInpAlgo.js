import React from "react";
import "./MainInpAlgo.css";
import { Dropdown } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

export default class MainInpAlgo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: {
        lat: 0,
        long: 0
      },
      destination: {
        lat: 0,
        long: 0
      }
    };

    var distanceMatrix = 0;

    this.createDistmatrix = this.createDistmatrix.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getPoints = this.getPoints.bind(this);
  }

  //Function to get points for distance matrix
  getPoints = () => {
    let request = new XMLHttpRequest();
    var coord = [];
    coord.push([Number(this.state.source.lat), Number(this.state.source.long)]);
    coord.push([
      Number(this.state.destination.lat),
      Number(this.state.destination.long)
    ]);

    request.open("POST", "https://api.openrouteservice.org/pois");

    request.setRequestHeader(
      "Accept",
      "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
    );
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader(
      "Authorization",
      "5b3ce3597851110001cf624865b3cde11f4c45beacf13294afa398bb"
    );

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        var value = JSON.parse(this.responseText);

        setTimeout(function() {
          for (var point of value["features"]) {
            coord.push([
              point["geometry"]["coordinates"]["0"],
              point["geometry"]["coordinates"]["1"]
            ]);
          }
          console.log(coord);
          this.coord = coord;
        }, 2000);
      }
    };

    const body =
      '{"request":"pois","geometry":{"bbox":[[' +
      this.state.source.lat +
      "," +
      this.state.source.long +
      "],[" +
      this.state.destination.lat +
      "," +
      this.state.destination.long +
      ']],"geojson":{"type":"Point","coordinates":[' +
      this.state.source.lat +
      "," +
      this.state.source.long +
      ']},"buffer":200}}';

    request.send(body);
  };

  //Distance matrix creation
  createDistmatrix = () => {
    let request = new XMLHttpRequest();
    var coord = 0;
    var mat = [];

    request.open(
      "POST",
      "https://api.openrouteservice.org/v2/matrix/driving-car"
    );

    request.setRequestHeader(
      "Accept",
      "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
    );
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader(
      "Authorization",
      "5b3ce3597851110001cf624865b3cde11f4c45beacf13294afa398bb"
    );

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        var v = JSON.parse(this.responseText);

        setTimeout(function() {
          this.distanceMatrix = v["distances"];
          console.log("Body:", v["distances"]);
          console.log(this.distanceMatrix);
        }, 2000);
      }
    };

    setTimeout(function() {
      console.log(this.coord);
      coord = this.coord;
      const body = {
        locations: coord,
        metrics: ["distance"],
        units: "m"
      };
      request.send(JSON.stringify(body));
    }, 4000);
  };

  handleClick = () => {
    this.state.source.lat = document.getElementById("sLat").value;
    this.state.source.long = document.getElementById("sLong").value;
    this.state.destination.lat = document.getElementById("dLat").value;
    this.state.destination.long = document.getElementById("dLong").value;
    this.getPoints();
    this.createDistmatrix();
    setTimeout(function() {
      console.log(this.distanceMatrix);
      var t = new ShortestPath();
      t.dijkstra(this.distanceMatrix, 0);
    }, 9000);
  };

  render() {
    const dropdown = (
      <div>
        Source: &ensp;
        <Input id="sLat" placeholder="Lat" /> &ensp;
        <Input id="sLong" placeholder="Long" />
        &ensp; Destination: &ensp;
        <Input id="dLat" placeholder="Lat" /> &ensp;
        <Input id="dLong" placeholder="Long" />
        <br /> <br />
        <Dropdown text="Algorithm">
          <Dropdown.Menu>
            <Dropdown.Item key="d" text="Dijkstra" />
            <Dropdown.Item text="Bellman-Ford" description="" />
            <Dropdown.Item text="Floyyd-Warshall" description="" />
          </Dropdown.Menu>
        </Dropdown>
        &ensp; &ensp;
        <Button onClick={this.handleClick}>Get Path</Button>
      </div>
    );

    return dropdown;
  }
}

//Djikstra's Algorithm

class ShortestPath {
  minDistance = (dist, sptSet, V) => {
    var max = 99999;
    var min = max;
    var min_index = -1;
    for (var v = 0; v < V; v++) {
      if (sptSet[v] == false && dist[v] <= min) {
        min = dist[v];
        min_index = v;
      }
    }
    console.log(min_index);
    return min_index;
  };

  dijkstra = (graph, src) => {
    var V = graph.length;
    var max = 99999;
    var prev_vert = new Array(V).fill(-1);
    var dist = new Array(V).fill(max);
    var sptSet = new Array(V).fill(false);
    var path = [];
    dist[src] = 0;

    for (var count = 0; count < V - 1; count++) {
      var u = this.minDistance(dist, sptSet, V);
      sptSet[u] = true;

      for (var v = 0; v < V; v++) {
        if (
          !sptSet[v] &&
          graph[u][v] != 0 &&
          dist[u] != max &&
          dist[u] + graph[u][v] < dist[v]
        ) {
          prev_vert[v] = u;
          dist[v] = dist[u] + graph[u][v];
        }
      }
    }
    // getting the path for node 1 (dest node)
    prev_vert.shift();
    dist.shift();
    var pv = -1;

    var n = 0;

    while (pv != 0) {
      pv = prev_vert[n];
      path.push(pv);
    }
    console.log(path);
    console.log(dist);
    console.log(prev_vert);
  };
}
