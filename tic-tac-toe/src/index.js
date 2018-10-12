import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    //z - last step. if props.active === true, then set a style or class here that will make this individual button be highlighted
    var appliedClass = "square"
    if(props.active) {
        appliedClass = "square active"
    }
    return (
        <button className={appliedClass} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component { 
//    constructor(props) {
//        super()
//        console.log(props)
//        this.state = {
//            selectedSquare: props.squares[0]
//        }
//    }
    //z - Board will have access to props.indexes
  renderSquare(i) {
      //z - for each time this function is called, i will be an index so you will want to loop through this.props.indexes to check and see if the passed in i index matches any of the indexes coming from props. if so you have a winning match. 
      //z - pass a prop down to the square component called active initially set to false. If i passed in matches a winning index then set that variable to true
    let active = false;
    for(var j = 0; j < this.props.indexes.length; j++) {
        if(this.props.indexes[j] === i) {
            active = true
        }
    }
    return ( 
        <Square 
            value={this.props.squares[i]}
            active={active}
            onClick={() => this.props.onClick(i)}
        />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
        </div>
        <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
        </div>
        <div className="board-row board-row-bottom">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);  /*what does this mean*/
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
      };
  }
    
  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      let obj = calculateWinner(squares) 
      if (obj.type || squares[i]) {
          return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({ 
             history: history.concat([{
                 squares: squares,
             }]),
             stepNumber: history.length,
             xIsNext: !this.state.xIsNext,
      });
  }
    
  jumpTo(step) {
      this.setState ({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      });
  }
    
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
//    console.log(current.squares)
    const winner = calculateWinner(current.squares);
    //Z - take winner.indexes and pass it to the Board component via props
    
//    const moves = history.map((step, move) => {
//        const desc = move ?
//            'MOVE ' + move :
//            'NEW GAME';
//        
//        if (move===0) {
//            return (
//                <button className="time start" onClick={() => this.jumpTo(move)}>{desc}</button>
//            );
//        } else if (move <=4) {
//             return (
//                <button className="time moves left" onClick={() => this.jumpTo(move)}>{desc}</button>
//            );                                   
//        } else {
//            return (
//                <button className="time moves right" onClick={() => this.jumpTo(move)}>{desc}</button>
//            );        
//        }
//    });
      
            let left = []
            let middle = []
            let right = []
            let start = ''
            history.forEach((e,i) => {
                if (i===0) {
                    start = <button className="time start" onClick={() => this.jumpTo(i)}>NEW GAME</button>
                } else if (i<4) {
                    left.push(<button className="time left" onClick={() => this.jumpTo(i)}>MOVE {i}</button>)
                } else if (i<7) {
                    middle.push(<button className="time  middle" onClick={() => this.jumpTo(i)}>MOVE {i}</button>)    
                } else {
                    right.push(<button className="time  right" onClick={() => this.jumpTo(i)}>MOVE {i}</button>)            
                }
            })
            
      let status;
      if (winner.type) {
          
          status = 'Winner: ' + winner.type;
      } else if (this.state.stepNumber < 9){
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
          status = 'Draw'
      }

    return (
      <div className="game">
        <div className="game-component game-board">
          <Board 
            squares={current.squares}
            indexes={winner.indexes}
        onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-component game-info">
          <div className="winner">{status}</div>
          <div>
                    <div className="start">
                        {start}
                    </div>

                    <div className="container">
                        <div className="moves">
                            {left}
                        </div>
                            {middle.length?
                             <div className="moves">{middle}</div>
                            : null}
                            {right.length ? 
                             <div className="moves">{right}</div> 
                            : null}
                    </div>
                </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//            return squares[a];
            return {
                indexes: [a, b, c],
                type: squares[a]
            }
        }
    }
    return {
        indexes: [],
        type: ''
    };
}