(function() {
	//begin constants
	var BOARD_WIDTH = 10;
	var BOARD_HEIGHT = 22;
    var piecebraille = [
    	["\u2830\u2806","\u2830\u2806","\u2830\u2806","\u2830\u2806"], // O
    	["\u2812\u2803","\u2838\u2804","\u2816\u2802","\u2839\u2800"], // L
    	["\u2813\u2802","\u2838\u2801","\u2812\u2806","\u283C\u2800"], // J
    	["\u281A\u2801","\u2818\u2806","\u2834\u2802","\u2833\u2800"], // S
    	["\u2819\u2802","\u2830\u2803","\u2832\u2804","\u281E\u2800"], // Z
    	["\u281A\u2802","\u2838\u2802","\u2832\u2802","\u283A\u2800"], // T
    	["\u2812\u2812","\u2800\u2847","\u2824\u2824","\u28B8\u2800"]  // I
    ];

    var piecedata = [
      [[6,6,0,0],[6,6,0,0],[6,6,0,0],[6,6,0,0]],
      [[4,4,12,0],[14,2,0,0],[6,4,4,0],[8,14,0,0]],
      [[12,4,4,0],[14,8,0,0],[4,4,6,0],[2,14,0,0]],
      [[4,12,8,0],[12,6,0,0],[2,6,4,0],[12,6,0,0]],
      [[8,12,4,0],[6,12,0,0],[4,6,2,0],[6,12,0,0]],
      [[4,12,4,0],[14,4,0,0],[4,6,4,0],[4,14,0,0]],
      [[4,4,4,4],[15,0,0,0],[2,2,2,2],[15,0,0,0]]
    ];


    var piecewidth = [
      [2,2,2,2], // O
      [3,2,3,2], // L
      [3,2,3,2], // J
      [3,2,3,2], // S
      [3,2,3,2], // Z
      [3,2,3,2], // T
      [4,1,4,1]  // I
    ];



    /*
    var table = document.createElement("table");
    piecebraille.forEach(function(r){ 
    	var row = document.createElement("tr");
    	r.forEach(function(i) {
    		var cell = document.createElement("td")
    		$(cell).text(i);
    		row.appendChild(cell);
    	});
    	table.appendChild(row);
    });
    document.body.appendChild(table);
    */

    var COLUMN_STATES = [[
    	"\u2800", // space
    	"\u2802", // 1
    	"\u2806", // 2
    	"\u2812", // 3
    	"\u2832", // 4
    	"\u2822", // 5
    	"\u2816", // 6
    	"\u2836", // 7
    	"\u2826", // 8
    	"\u2814", // 9
    	"\u2834", // 0
    	"\u2801", // a
    	"\u2803", // b
    	"\u2809", // c
    	"\u2819", // d
    	"\u2811", // e
    	"\u280B", // f
    	"\u281B", // g
    	"\u2813", // h
    	"\u280A", // i
    	"\u281A", // j
    	"\u2805", // k
    	"\u2807"  // l
    ],
    [ // this column for when piece is hovering over
    	"\u28C0", // space
    	"\u28C2", // 1
    	"\u28C6", // 2
    	"\u28D2", // 3
    	"\u28F2", // 4
    	"\u28E2", // 5
    	"\u28D6", // 6
    	"\u28F6", // 7
    	"\u28E6", // 8
    	"\u28D4", // 9
    	"\u28E4", // 0
    	"\u28C1", // a
    	"\u28C3", // b
    	"\u28C9", // c
    	"\u28D9", // d
    	"\u28D1", // e
    	"\u28CB", // f
    	"\u28DB", // g
    	"\u28D3", // h
    	"\u28CA", // i
    	"\u28DA", // j
    	"\u28C5", // k
    	"\u28C7"  // l
    ]];
	//end constants

    var board = window.board = [
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //top left corner here
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

	var currentPiece = {
		type : null,
		rotation : null,
    left : 0,
    width : 0
	}

  var score = 0;

   function runGameLoop() {
      calculateLines();
      if(isGameOver()) {
      	doGameEnd();
      } else {
      	doAddNextPiece();
        updateDisplay();
      }
   }

   function isGameOver() {
      return false;
   }

   function updateDisplay() {
   	var boardstring = "\u28B8"; //left wall

   		for(var i = 0; i < BOARD_WIDTH; i++) {
   			var h = 0;
   			for(var j = 0; j < BOARD_HEIGHT; j ++ ) {
   				if(board[i][j]) h = j + 1; 
   			}
   			boardstring += 
   				COLUMN_STATES[i >= currentPiece.left 
   				             && i < currentPiece.left + currentPiece.width 
   				             ? 1 : 0]
   				            [h]; 
   		}
   	boardstring += "\u2847\u2800\u2800"; //right wall and space
   	boardstring += getCurrentPieceBraille();
    $("#output").html(boardstring);
   }

   function calculateLines() {
      for(var i = BOARD_HEIGHT - 1; i >= 0; i--) {
        var fullLine = true;
        for(var j = 0; j < BOARD_WIDTH; j ++ ) {
          if(!board[j][i]) {
            fullLine = false;
            break;
          } 
        }
        if(fullLine) {
          for(var k = 0; k < BOARD_WIDTH; k++) {
            board[k].splice(i,1);
            board[k].push(0);
          }
          score++;
        }
      }
   }

   function doAddNextPiece() {
     currentPiece.type = Math.floor(Math.random() * 7);
     currentPiece.rotation = Math.floor(Math.random() * 4);
     currentPiece.left = 4;
     currentPiece.width = piecewidth[currentPiece.type][currentPiece.rotation];
   }

   function getCurrentPieceBraille() {
     return piecebraille[currentPiece.type][currentPiece.rotation];
   }

   //input : 4-tuple of integers 0-15
   //output : string of 2 characters, p[0]p[1] and p[2]p[3]
   /*
     p[0] p[1] p[2] p[3]
      8    8    8    8
      4    4    4    4
      2    2    2    2
      1    1    1    1
   */
   function convertPixelArrayToBraille(p) {
    return String.fromCharCode(0x2800
      + (p[0] >>> 3 & 1) * 1
      + (p[0] >>> 2 & 1) * 2
      + (p[0] >>> 1 & 1) * 4
      + (p[0] & 1) * 0x40
      + (p[1] >>> 3 & 1) * 8
      + (p[1] >>> 2 & 1) * 0x10
      + (p[1] >>> 1 & 1) * 0x20
      + (p[1] & 1) * 0x80
    ) + String.fromCharCode(0x2800
      + (p[2] >>> 3 & 1) * 1
      + (p[2] >>> 2 & 1) * 2
      + (p[2] >>> 1 & 1) * 4
      + (p[2] & 1) * 0x40
      + (p[3] >>> 3 & 1) * 8
      + (p[3] >>> 2 & 1) * 0x10
      + (p[3] >>> 1 & 1) * 0x20
      + (p[3] & 1) * 0x80
    );
   }

   function getColumnHeight(col) {
    var h = 0;
    for(var i = 0; i < BOARD_HEIGHT; i++) {
      if(board[col][i]) h = i + 1;
    }
    return h;
   }


   $(document.body).bind("keydown.left", function() {
   	//move piece left
   	if(currentPiece.left > 0) {
   		currentPiece.left--;
	   	updateDisplay();
   	}
   });

   $(document.body).bind("keydown.right", function() {
   	//move piece right
   	if(currentPiece.left + currentPiece.width < BOARD_WIDTH) {
   		currentPiece.left++;
   		updateDisplay();
   	}
   	//update display
   });

   $(document.body).bind("keydown.up", function() {
   	//rotate piece
    currentPiece.rotation = (currentPiece.rotation + 1) % 4;
    currentPiece.width = piecewidth[currentPiece.type][currentPiece.rotation];
    if(currentPiece.left + currentPiece.width > BOARD_WIDTH) {
      currentPiece.left = BOARD_WIDTH - currentPiece.width;
    }
   	updateDisplay();
   });

   $(document.body).bind("keydown.down", function() {
   	  //find pain point, i.e. where piece lands.
      var h = 0;
      var col = 0;
      var piece = piecedata[currentPiece.type][currentPiece.rotation];
      var baselines = $(piece).map(function(index, pd){ 
        switch(true) {
          case pd === 0 : return -1;
          case pd % 2 > 0 : return 3;
          case pd % 4 > 0 : return 2;
          case pd % 8 > 0 : return 1;
          default : return 0;
        }
      });
      for(var i = 0; i < currentPiece.width; i++) {
        if(getColumnHeight(i + currentPiece.left) + baselines[i] > h) {
          h = getColumnHeight(i + currentPiece.left) + baselines[i];
          col = i;
        }
      }
      //h = getColumnHeight(col + currentPiece.left) + baselines[col] - 1; //reset to baseline.
   	  //update blocks
      for(i = 0; i < currentPiece.width; i++) {
          board[i + currentPiece.left][h] |= (piece[i] & 8) ;
          h > 0 && (board[i + currentPiece.left][h - 1] |= (piece[i] & 4));
          h > 1 && (board[i + currentPiece.left][h - 2] |= (piece[i] & 2));
          h > 2 && (board[i + currentPiece.left][h - 3] |= (piece[i] & 1));
      }
   	  runGameLoop();
   });

   runGameLoop();
})();