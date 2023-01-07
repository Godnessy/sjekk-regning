import React from "react";

function Error() {
  return (
    <div className="d-flex justify-content-center align-content-center card m-5 flex-row ">
      <h2> Oops! Feil side! Trykk her for å komme deg til frontside: </h2>
      <a href="http://www.sjekkregning.no" className="align-self-center">
        <button className="btn btn-success">SjekkRegning.no</button>
      </a>
    </div>
  );
}

export default Error;
