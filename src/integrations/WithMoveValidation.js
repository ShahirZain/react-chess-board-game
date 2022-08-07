import React, { useState } from "react";
import Chess from "chess.js"; 
import Chessboard from "chessboardjsx";

export const WithMoveValidation = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [dropSquareStyle, setDropSquareStyle] = useState({});
  const [squareStyles, setSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState("");
  const [square, setSquare] = useState("");

  const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
    };
  };

  // keep clicked square style and remove hint squares
  const removeHighlightSquare = () => {
    setDropSquareStyle(squareStyling({ pieceSquare, history }));
  };

  // show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%",
            },
          },
          ...squareStyling({
            history: history,
            pieceSquare: pieceSquare,
          }),
        };
      },
      {}
    );
    setSquareStyles({
      ...highlightStyles,
    });
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    setHistory(game.history());
    setFen(game.fen());
    setPieceSquare(squareStyling({ pieceSquare, history }));
  };

  const onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    let moves = game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  const onDragOverSquare = (square) => {
    let style =
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" };
    setDropSquareStyle(style);
  };

  const onSquareClick = (square) => {
    setSquare(square);
    setSquareStyles(squareStyling({ pieceSquare, history }));

    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    setHistory(game.history());
    setFen(game.fen());
    setPieceSquare("");
  };

  const onSquareRightClick = (square) =>
    setPieceSquare({
      ...pieceSquare,
      [square]: { backgroundColor: "deepPink" },
    });

  return (
    <Chessboard
      id="humanVsHuman"
      width={320}
      position={fen}
      onDrop={onDrop}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      boardStyle={{
        borderRadius: "5px",
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
      }}
      squareStyles={squareStyles}
      dropSquareStyle={dropSquareStyle}
      onDragOverSquare={onDragOverSquare}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
    />
  );
};
