import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square1 extends React.Component {
//
//     render() {
//         return (
//             <button className="square"
//                     onClick={() => {
//                         this.props.onClick()
//                     }}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// square class is reduced to a function
function Square(props) {
    console.log(props.position);
    return (
        <button className={props.position ? 'square-selected' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square value={this.props.current.squares[i]}
                    position={(i + 1) === this.props.current.position ? this.props.current.position : null}
                    onClick={() => {
                        this.props.onClick(i)
                    }}/>
        )
    }

    createSquare(i) {
        let squares = [];
        let start;
        let limit;
        switch (i) {
            case 0:
                start = 0;
                limit = 3;
                break;
            case 1:
                start = 3;
                limit = 6;
                break;
            default:
                start = 6;
                limit = 9;

        }
        for (let j = start; j < limit; j++) {
            squares.push(
                this.renderSquare(j)
            )
        }
        return squares
    }

    createBoard() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            rows.push(
                <div className="board-row">
                    {this.createSquare(i)}
                </div>
            )
        }
        return rows
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: 0
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    position: i + 1
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let position;

            switch (step.position) {
                case 1:
                    position = '(1, 1)';
                    break;
                case 2:
                    position = '(1, 2)';
                    break;
                case 3:
                    position = '(1, 3)';
                    break;
                case 4:
                    position = '(2, 1)';
                    break;
                case 5:
                    position = '(2, 2)';
                    break;
                case 6:
                    position = '(2, 3)';
                    break;
                case 7:
                    position = '(3, 1)';
                    break;
                case 8:
                    position = '(3, 2)';
                    break;
                default:
                    position = '(3, 3)'
            }

            const desc = move ? 'Go to move #' + move + ' position: ' + position :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner is: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        current={current}
                        onClick={(i) => {
                            this.handleClick(i)
                        }}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
