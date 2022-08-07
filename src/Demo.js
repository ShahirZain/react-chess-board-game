import React from "react";

import { WithMoveValidation } from "./integrations/WithMoveValidation";

function Demo() {
  return (
    <div>
      <div style={boardsContainer}>
        <WithMoveValidation />
      </div>
    </div>
  );
}

export default Demo;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50,
};
