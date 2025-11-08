import React from "react";
import "./Home.css";

function Home() {
  return (
    <div
      className="background"
      style={{
        backgroundImage: "url('/assets/nyc-skyline.png')"
      }}
    >
      <h1 className="title">CBRE</h1>
    </div>
  );
}

export default Home;