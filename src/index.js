import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square はstateを持たないコンポーネントのため、classではなく関数コンポーネントにする
// 関数コンポーネントはいわゆるJSのためrenderとか使わない
function Square(props) {
    // renderが読み込まれることでタグが描画される
    // buttonタグにonClickアロー関数でイベント設定
    // Squareコンポーネントは、クリックされたと言う事象をBoardコンポーネントに伝えるだけの役割（制御されたコンポーネント）になった
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // renderSquareに配列squaresの値を持たせる
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
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
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    // 9マスのsquareにnull（初期値）をいれるためのconstructorを作成
    // fillは配列中の開始位置から終了位置までを固定値で埋める関数
    // constructorの最初はsuper(props)を呼ぶ必要がある
    // history にsquares[i]の値を保持する
    constructor(props) {
        super(props);
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
        // sliceは配列の開始位置から終了位置までをシャローコピーして新しい配列オブジェクトを返す
        // データを直接変更しない（イミュータブル）ので、変更以前のヒストリをそのまま保つことができる
        // イミュータブルにすることで変更の検出や、再renderのタイミング検出が用意になる。
        // setStateを使うことで、stateが変化した時、再renderされる
        const squares = current.squares.slice();

        // 勝利者がいる場合や、クリックした箇所がnullでない場合は何もせず終了
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // xIsNextがtrueのときX、falseのときOをsquares[i]に代入
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // squaresの更新、xIsNextの値を!で反転
        // concatを使ってhistory配列にsquaresを追加
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // stepNumberを更新。stepNumberが偶数の時、xIsNextにtrueを設定
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        // 勝利者がいるかどうか判定。勝利者がいなければNextplayerを表示
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    // 勝利できるパターンを全通りlinesに代入
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
        // 勝利パターン（８通り）のうち1つを[a,b,c]に代入
        const [a, b, c] = lines[i];
        // a,b,cそれぞれのvalueが等しい（全部Xor全部O）かどうかを判定し、勝利プレイヤー（XorO）を返す
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}