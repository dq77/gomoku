export default function checkFiveInARow(chessBoard) {
  // 检查是否有五个连续相同的棋子
  const checkLine = (x, y, dx, dy) => {
    let count = 0;
    let color = '';
    for (let i = 0; i < 5; i++) {
      let newX = x + i * dx;
      let newY = y + i * dy;
      let piece = chessBoard.find(p => p.x === newX && p.y === newY);
      if (!piece || (color && piece.color !== color)) {
        count = 0;
        break;
      }
      count++;
      color = piece.color;
    }
    return count === 5;
  }

  // 遍历棋盘上的所有棋子
  for (let i = 0; i < chessBoard.length; i++) {
    let piece = chessBoard[i];
    // 检查横向是否有五子连珠
    if (checkLine(piece.x, piece.y, 1, 0)) return true;
    // 检查纵向是否有五子连珠
    if (checkLine(piece.x, piece.y, 0, 1)) return true;
    // 检查斜线是否有五子连珠
    if (checkLine(piece.x, piece.y, 1, 1)) return true;
    // 检查反斜线是否有五子连珠
    if (checkLine(piece.x, piece.y, 1, -1)) return true;
  }
  return false;
}