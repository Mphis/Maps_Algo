import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar.js";
import MainMap from "./components/MainMap.js";
import MainInpAlgo from "./components/MainInpAlgo.js";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

ReactDOM.render(<MainMap />, document.querySelector("#main"));
ReactDOM.render(<MainInpAlgo />, document.querySelector("#input"));
ReactDOM.render(<Navbar />, document.querySelector("#navbar"));
