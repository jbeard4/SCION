/**
* Copyright (C) 2011 Jacob Beard
* Released under GNU GPL, read the file 'COPYING' for more information
**/

function sum(a,b){
	return a + b;
}

function curry (fn, scope) {
	var scope = scope || window;
	var args = [];
	for (var i=2, len = arguments.length; i <len; ++i) {
		args.push(arguments[i]);
	};
	return function() {
		fn.apply(scope, args);
	};
}

SELECTION_MODE = {
	CHARACTER:0,
	LINE:1,
	BLOCK:2
}

CommandManager = {
	processCommand : function(cmdString){
		//very simple, only two commands now

		if(cmdString.length && cmdString[0] === "!"){
			//!	
			eval(cmdString.slice(1));
		}else{
			var cmds = cmdString.split();
			//help
			switch(cmds[0]){
				case "help":
					this.helpCmd();
					break;
				default:
					this.notRecongizedCmd();
					
			}
		}

	},

	helpCmd : function(){
		alert("Help command triggered");
	},

	notRecongizedCmd : function(){
		alert("Unrecognized command triggered");
	}
}

function SVGEditor(cursor,cmdCursor,modeText,scInstance,rootNode,selectionManager){

	this.SELECTION_MODE = SELECTION_MODE;	//expose enum on controller so that it can be used byt he statechart

	var register = {};	//each application instance has a register
	var DEFAULT_REGISTER_NAME = "default"
	register[DEFAULT_REGISTER_NAME] = ["",SELECTION_MODE.CHARACTER];

	function currentConfigurationToSelectionMode(){
		if(scInstance.isIn("character_mode")){
			return SELECTION_MODE.CHARACTER;
		}else if(scInstance.isIn("line_mode")){
			return SELECTION_MODE.LINE;
		}else if(scInstance.isIn("block_mode")){
			return SELECTION_MODE.BLOCK;
		}	
	}

	function doUpdateSelection(){
		selectionManager.setEndPos(cursor.colNum,cursor.rowNum);
	}

	function repeatCommand(fn,count){
		count = count || 1;

		for(var i=0; i<count; i++){
			fn();
		}
	}

	this.makeCursorFat = function(){
		cursor.makeCursorFat();
	};
	this.makeCursorThin = function(){
		cursor.makeCursorThin();
	};
	this.updateModeText = function(s){
		modeText.textContent = s; 
	};
	this.moveLeft = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveLeft,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveRight = function(includeRightmostChar,updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveRight,cursor,includeRightmostChar),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveUp = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveUp,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveDown = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveDown,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.writeChar = function(c){
		cursor.writeChar(c);
	};
	this.writeNewLine = function(){
		cursor.writeNewLine(); 
	};
	this.writeBackspace = function(){
		cursor.writeBackspace();
	};
	this.moveToStartOfNextWord = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveToStartOfNextWord,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveToEndOfNextWord = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveToEndOfNextWord,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveToStartOfPreviousWord = function(updateSelection,repeatInput){
		repeatCommand(curry(cursor.moveToStartOfPreviousWord,cursor),repeatInput)

		if(updateSelection){doUpdateSelection()};
	};
	this.moveToStartOfLine = function(updateSelection){
		cursor.moveCursorTo(0);

		if(updateSelection){doUpdateSelection()};
	};
	this.moveToEndOfLine = function(updateSelection){
		cursor.moveToEndOfLine();

		if(updateSelection){doUpdateSelection()};
	};
	this.moveToLastLineOfDocument = function(updateSelection){
		//TODO
		if(updateSelection){doUpdateSelection()};
	};
	this.moveToFirstLineOfDocument = function(updateSelection){
		cursor.moveToLine(0);
		if(updateSelection){doUpdateSelection()};
	};
	this.moveCursorToLine = function(line){
		cursor.moveToLine(line);
	}

	this.install = function(sc){

		//start mainloop
		scInstance.start();  

		//FIXME: how do we capture <esc>? requires crazy hack? maybe...
		var eventMap = {
			8:  "backspace",
			13: "enter",
			27: "esc",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
		}

		var charCodeEventMap = {
			34 : "double_quote",
			36: "bling",
			48 : "zero",
			49 : "one",
			50 : "two",
			51 : "three",
			52 : "four",
			58 : "colon",
			64 : "at"
		}

		rootNode.addEventListener("keydown",function(e){
			console.log(e);
			e.preventDefault();

			var scEvent = e.key.toLowerCase();

			if(!scEvent){
				console.error("Could not turn keyboard event into statechart event");
			}

			if(e.ctrlKey){
				scEvent = "ctrl_" + scEvent;
			}

			scEvent += "_keypress";

			//we use GEN as opposed to method calls because we use * event in the statechart, 
			//which means it can accept events which are not explicitly used
			//such events do not have a method defined, and there's no way that I am aware of to define a "catchall" method in JavaScript 
			scInstance.gen(scEvent,e)
		},true)

		//send init event
		scInstance.gen("init",this);

		/*
		var eventMap = {
			8:  this.writeBackspace,
			13: this.writeNewLine,
			37: this.moveLeft,
			38: this.moveUp,
			39: this.moveRight,
			40: this.moveDown
		}

		var self = this;
		rootNode.addEventListener("keypress",function(e){
			e.preventDefault();
			console.log(e)
			if(eventMap[e.keyCode]){
				eventMap[e.keyCode]()
			}else{
				self.writeChar(e.charCode);
			}
		},true)
		*/
	}

	this.startSelection = function(mode){
		//send this down to whowever is responsible for managing the selection
		selectionManager.startSelection(cursor.colNum,cursor.rowNum,mode);
	}

	this.clearSelection = function(){
		selectionManager.clearSelection();
	}

	this.setSelectionMode = function(mode){
		selectionManager.setMode(mode);
	}


	this.copySelectedTextIntoRegister = function(registerName){
		registerName = registerName || DEFAULT_REGISTER_NAME;

		var selectionText = selectionManager.getSelectionText();

		var mode = currentConfigurationToSelectionMode();

		register[registerName] = [selectionText,mode];
	}

	this.yankCurrentLineIntoRegister = function(registerName){
		registerName = registerName || DEFAULT_REGISTER_NAME;

		var lineTxt = cursor.getCurrentLineText()

		register[registerName] = [lineTxt,SELECTION_MODE.LINE];
	}
	
	this.deleteSelectedTextIntoRegister = function(registerName){
		registerName = registerName || DEFAULT_REGISTER_NAME;

		var sr =  selectionManager.getNormalizedSelectionRange();

		var selectionText = selectionManager.deleteSelectionText();

		var mode = currentConfigurationToSelectionMode();

		if(mode===SELECTION_MODE.LINE){
			cursor.moveCursorTo(0,sr.startRow);
		}else{
			cursor.moveCursorTo(sr.startCol,sr.startRow);
		}

		register[registerName] = [selectionText,mode];
	}

	this.deleteCurrentLineIntoRegister = function(registerName){
		registerName = registerName || DEFAULT_REGISTER_NAME;

		var lineTxt = cursor.deleteCurrentLineText()

		register[registerName] = [lineTxt,SELECTION_MODE.LINE];
	}

	//FIXME: lot of duplicate code between this and previous function
	this.replaceSelectedTextIntoRegister = function(charCode,registerName){
		registerName = registerName || DEFAULT_REGISTER_NAME;

		var c = String.fromCharCode(charCode);

		var sr =  selectionManager.getNormalizedSelectionRange();

		var selectionText = selectionManager.replaceSelectionText(c);

		var mode = currentConfigurationToSelectionMode();

		if(mode===SELECTION_MODE.LINE){
			cursor.moveCursorTo(1,sr.startRow);
		}else{
			cursor.moveCursorTo(sr.startCol+1,sr.startRow);
		}

		register[registerName] = [selectionText,mode];
	}

	this.putTextFromRegisterBeforeCursor = function(registerName){

		registerName = registerName || DEFAULT_REGISTER_NAME;
		
		var registerValue = register[registerName]

		cursor.writeString(registerValue[0],false,registerValue[1]);
	}

	this.putTextFromRegisterAfterCursor = function(registerName){

		registerName = registerName || DEFAULT_REGISTER_NAME;
		
		var registerValue = register[registerName]

		cursor.writeString(registerValue[0],true,registerValue[1]);
	}

	this.hideCursor = function(){
		cursor.hide();
	}

	this.unhideCursor = function(){
		cursor.unhide();
	}

	this.hideCmdCursor = function(){
		cmdCursor.hide();
	}

	this.unhideCmdCursor = function(){
		cmdCursor.unhide();
	}

	//command interface
	this.moveCmdLeft = function(){
		cmdCursor.moveLeft();
	};
	this.moveCmdRight = function(){
		cmdCursor.moveRight(true);
	};

	this.writeCmdChar = function(c){
		cmdCursor.writeChar(c);
	};

	this.writeCmdBackspace = function(){
		cmdCursor.writeBackspace();

		if(cmdCursor.colNum === 0){
			scInstance.gen("first_command_line_char_deleted");		
		}
	};

	this.clearCmdLine = function(){
		while(cmdCursor.colNum){
			cmdCursor.writeBackspace();
		}
	}

	this.executeCommand = function(){
		text = cmdCursor.getCurrentLineText();
		text = text.slice(1);	//remove the ":" at start
		CommandManager.processCommand(text);
	}

	this.appendToModeText = function(s){
		modeText.textContent += s; 
	}

	this.removeStringFromModeText = function(s){
		modeText.textContent = modeText.textContent.slice(0,modeText.textContent.indexOf(s));
	}

}

function Cursor(initialColNum,initialRowNum,lineManager,displayManager,cursorNode,startX,startY){
	this.colNum = initialColNum || 0;
	this.rowNum = initialRowNum || 0;
	startX = startX || 0;
	startY = startY || 0;

	cursorNode.y.baseVal.value=0;
	cursorNode.width.baseVal.value = displayManager.textExtent.width;


	function moveCursor(dx,dy){
			cursorNode.x.baseVal.value+=dx;
			cursorNode.y.baseVal.value+=dy;
	}

	function moveCursorTo(point){
			cursorNode.x.baseVal.value=point.x + startX;
			cursorNode.y.baseVal.value=point.y + startY;
	}

	this.hide = function(){
		cursorNode.setAttributeNS(null,"visibility","hidden");
	}

	this.unhide = function(){
		cursorNode.removeAttributeNS(null,"visibility");
	}

	this.getCurrentLineText = function(){
		return lineManager.getLine(this.rowNum).getTextContent();
	}

	this.deleteCurrentLineText = function(){
		return lineManager.deleteLine(this.rowNum);
	}

	this.moveToLine = function(lineNum,colNum){
		colNum = colNum || 0;
		var lineCount = lineManager.getLineCount();
		lineNum = Math.min(lineNum,lineCount-1);
		var line = lineManager.getLine(lineNum);
		colNum = Math.min(colNum,line.getTotalNumberOfChars()-1);
		this.moveCursorTo(colNum,lineNum);
	}

	this.writeChar = function(c,colOffset,rowOffset){
		c = (typeof c === "number" ? String.fromCharCode(c) : c);	//try to convert from charcode first
		colOffset = colOffset || 0;
		rowOffset = rowOffset || 0;

		lineManager.getLine(this.rowNum+rowOffset).writeCharAt(c,this.colNum+colOffset)
		this.moveRight(true);
	};

	this.writeString = function(s,afterCursor,mode){
		var colOffset = 0, 
			rowOffset = 0, 
			startCol,
			startRow;

		if(mode === SELECTION_MODE.LINE){
			if(afterCursor){
				this.moveToEndOfLine(); 
				this.writeNewLine();
			}else{
				this.moveCursorTo(0); 
				this.writeNewLine();
				this.moveUp();
			}
		}else if(mode ===  SELECTION_MODE.CHARACTER || mode ===  SELECTION_MODE.BLOCK){
			colOffset = afterCursor ? 1 : 0;
		}

		//capture these after possibly positioning them for line mode
		startCol = this.colNum; 
		startRow = this.rowNum;

		//FIXME: we could make this more efficient
		for(var i=0,l=s.length;i<l;i++){
			var c = s[i];

			if(mode === SELECTION_MODE.BLOCK){
				if(c==="\n"){
					//if we encounter a newline, go to the next line, if it exists
					//if it doesn't exist, create it and write spaces up to the startCol
					var line = lineManager.getLine(this.rowNum+1);
					if(!line){
						this.moveToEndOfLine();
						this.writeNewLine();
						line = lineManager.getLine(this.rowNum+1); //re-get the line, now that we've made it
					}else{
						this.moveDown();
						this.moveCursorTo(0);
					}

					//if the line is long enough, go to the startCol on this line
					//otherwise, append spaces to the end of the line until it is long enough
					this.moveToEndOfLine();
					while(this.colNum < startCol+1){
						this.writeChar(" ");
					}

					//move the cursor to the approprate position
					this.moveCursorTo(startCol);
				}else{
					this.writeChar(c,colOffset);
				}
			}else{
				if(c==="\n"){
					this.writeNewLine();	//FIXME: figure out newline wrt afterCursor
				}else{
					this.writeChar(c,colOffset);
				}
			}
		}

		//block mode and line mode moves him back to where he started
		if(mode === SELECTION_MODE.BLOCK || mode === SELECTION_MODE.LINE){
			this.moveCursorTo(startCol,startRow);
		}
	
	}

	this.writeNewLine = function(){
		//delete everything on current line from cursor position to the end
		var currentLine = lineManager.getLine(this.rowNum);
		var deletedChars = currentLine.deleteRange(this.colNum,currentLine.getTotalNumberOfChars())

		//create a new line with this text
		lineManager.createLine(this.rowNum+1,deletedChars)
		//this.moveDown()

		this.moveCursorTo(0,this.rowNum+1)
	};

	this.writeBackspace = function(){
		var line = lineManager.getLine(this.rowNum);
		if(this.colNum > 0){
			this.moveLeft();
			line.writeBackspace(this.colNum);
		}else{
			//we cannot delete the first line
			if(this.rowNum > 0){
				var deletedChars = lineManager.deleteLine(this.rowNum);
				this.moveUp();
				this.moveToEndOfLine();
				lineManager.getLine(this.rowNum).writeStringAt(deletedChars,this.colNum);
			}
		}
	};

	this.moveLeft=function(){
		if(this.colNum > 0){
			this.colNum-=1
			moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
		}
	}

	this.moveRight=function(includeRightmostChar){
		var numChars = lineManager.getLine(this.rowNum).getTotalNumberOfChars();
		var condition = includeRightmostChar ? 
			this.colNum < numChars : 
			this.colNum < numChars-1;

		if(condition){
			this.colNum+=1
			moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
		}
	}

	this.moveUp=function(){
		var nextLine = lineManager.getLine(this.rowNum-1);
		if(nextLine){

			this.rowNum-=1;

			var numChars = nextLine.getTotalNumberOfChars();
			if( this.colNum < numChars ){
				moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
			}else{
				this.colNum = numChars;
				moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
			}
		}
	}

	this.moveDown=function(){
		var nextLine = lineManager.getLine(this.rowNum+1);
		if(nextLine){

			this.rowNum+=1;

			var numChars = nextLine.getTotalNumberOfChars();
			if( this.colNum < numChars ){
				moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
			}else{
				this.colNum = numChars;
				moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
			}
		}
	}

	this.makeCursorFat = function(){
		cursorNode.width.baseVal.value = displayManager.textExtent.width;
	}

	this.makeCursorThin = function(){
		cursorNode.width.baseVal.value = 1;
	}

	this.moveCursorTo = function(pos,lineNumber){
		lineNumber = lineNumber === undefined ? this.rowNum  : lineNumber;	//default to this.rowNum

		var nextLine = lineManager.getLine(lineNumber);

		//TODO: make sure we are not moving him somewhere illegal
		if(nextLine){ 
			this.colNum = pos;
			this.rowNum = lineNumber;

			moveCursorTo(lineManager.getCoords(this.colNum,this.rowNum));
		}


	}

	this.moveToStartOfNextWord = function(){
		var currentLine = lineManager.getLine(this.rowNum);
		var tc = currentLine.getTextContent(); 
		var re = new RegExp("\\b\\w","g"); // /\b\w/g;

		var match;

		while ((match = re.exec(tc)) && (match.index <= this.colNum));

		if (match){
			this.moveCursorTo(match.index);
		}else{
			this.moveCursorTo(tc.length-1);	//move cursor to end of line
		}
		
	}

	this.moveToEndOfNextWord = function(){
		var currentLine = lineManager.getLine(this.rowNum);
		var tc = currentLine.getTextContent()  
		var re = new RegExp("\\w\\b","g"); // /\w\b/g;

		var match;

		while ((match = re.exec(tc)) && (match.index <= this.colNum));

		if (match){
			this.moveCursorTo(match.index);
		}else{
			this.moveCursorTo(tc.length-1);	//move cursor to end of line
		}
		
	}

	this.moveToStartOfPreviousWord = function(){
		var currentLine = lineManager.getLine(this.rowNum);
		var tc = currentLine.getTextContent()  
		var re = new RegExp("\\b\\w","g"); // /\b\w/g;

		var matches = [];
		var match;

		while (match = re.exec(tc)){
			matches.push(match)
		}

		var self = this;

		var matchBeforeCursor = matches.filter(function(m){return m.index < self.colNum}).pop()

		if (matchBeforeCursor){
			this.moveCursorTo(matchBeforeCursor.index);
		}else{
			this.moveCursorTo(0);	//move cursor to start of line
		}
		
	}

	this.moveToEndOfLine=function(){
		this.moveCursorTo(lineManager.getLine(this.rowNum).getTotalNumberOfChars()); 
	}


	this.makeCursorThin();
}

function SelectionManager(groupNode,displayManager,lineManager){
	var self = this;

	var startCol,startRow,endCol,endRow,selectionMode;

	function clear(){
		//remove all rects
		while(groupNode.childNodes.length){
			groupNode.removeChild(groupNode.childNodes[0]);
		}

	}

	function createRectNode(x,y,width,height){
		var rect = document.createElementNS(svgNS,"rect");
		rect.setAttributeNS(null,"x",x);
		rect.setAttributeNS(null,"y",y);
		rect.setAttributeNS(null,"width",width);
		rect.setAttributeNS(null,"height",height);
		return rect;
	}

	function createRectNodesForLine(rowNum){
		//FIXME: createRectNodesForLine  is in fact a specification of createRectNodesForRange. I should refactor createRectNodesForLine to simply call createRectNodesForRange.
		//a line should consist of a big rect and a small rect. 
		var line = lineManager.getLine(rowNum);
		var numChars = line.getTotalNumberOfChars();
		var numLines = Math.ceil(numChars / displayManager.displayCharWidth); 

		var bigRectXYCoords = lineManager.getCoords(0,rowNum);
		var bigRectWidth = displayManager.displayCharWidth * displayManager.textExtent.width;
		var bigRectHeight = (numLines-1) * displayManager.textExtent.height;

		var smallRectXYCoords = {x:0,y: bigRectXYCoords.y + bigRectHeight}; 
		var smallRectWidth = displayManager.textExtent.width * (numChars - (displayManager.displayCharWidth * (numLines-1)) )
		var smallRectHeight = displayManager.textExtent.height;

		return [createRectNode(bigRectXYCoords.x, bigRectXYCoords.y, bigRectWidth, bigRectHeight),
				createRectNode(smallRectXYCoords.x,smallRectXYCoords.y,smallRectWidth,smallRectHeight)];
	}

	function createRectNodesForRange(colFrom,colTo,rowNum){
		//same idea: select first part, last part, etc...
		var toReturn;

		var line = lineManager.getLine(rowNum);
		var numChars = line.getTotalNumberOfChars();
		var numLines = Math.ceil(numChars / displayManager.displayCharWidth); 

		//make it not possible to create a rect node that is longer than its line
		if(colTo > numChars){
			colTo = numChars; 
		}

		var yPosFrom = Math.floor(colFrom / displayManager.displayCharWidth);
		var xPosFrom = colFrom - (yPosFrom * displayManager.displayCharWidth);

		var yPosTo = Math.floor(colTo / displayManager.displayCharWidth);
		var xPosTo = colTo - (yPosTo * displayManager.displayCharWidth);

		if(yPosFrom == yPosTo){
			//create one rect
			var rectXYCoords = lineManager.getCoords(colFrom,rowNum);
			var rectWidth = (xPosTo - xPosFrom) * displayManager.textExtent.width;
			var rectHeight = displayManager.textExtent.height;

			toReturn = [createRectNode(rectXYCoords.x, rectXYCoords.y, rectWidth, rectHeight)];
		}else{
			var firstRectXYCoords,firstRectWidth,firstRectHeight,
				lastRectXYCoords,lastRectWidth,lastRectHeight,
				middleRectXYCoords,middleRectWidth,middleRectHeight;

			firstRectXYCoords = lineManager.getCoords(colFrom,rowNum);
			firstRectWidth = (displayManager.displayCharWidth - xPosFrom) * displayManager.textExtent.width;
			firstRectHeight = displayManager.textExtent.height;

			middleRectXYCoords = {x:0,y:firstRectXYCoords.y + firstRectHeight};
			middleRectWidth = displayManager.displayCharWidth * displayManager.textExtent.width;
			middleRectHeight = (yPosTo - yPosFrom - 1) * displayManager.textExtent.height;

			lastRectXYCoords = {x:0,y:firstRectXYCoords.y + firstRectHeight + middleRectHeight};
			lastRectWidth = xPosTo * displayManager.textExtent.width;
			lastRectHeight = displayManager.textExtent.height;

			toReturn = [createRectNode(firstRectXYCoords.x, firstRectXYCoords.y, firstRectWidth, firstRectHeight),
					createRectNode(middleRectXYCoords.x, middleRectXYCoords.y, middleRectWidth, middleRectHeight),
					createRectNode(lastRectXYCoords.x, lastRectXYCoords.y, lastRectWidth, lastRectHeight)];
		}

		return toReturn;
	}

	function createRectNodesForRangeUntilEndOfLine(colFrom,rowNum){
		var line = lineManager.getLine(rowNum);
		var numChars = line.getTotalNumberOfChars();
	
		//FIXME: off-by-one error?
		return createRectNodesForRange(colFrom,numChars,rowNum);
	}

	function computeCharModeRects(tmpStartCol,tmpStartRow,tmpEndCol,tmpEndRow){
		//create rects for all of the lines we have selected
		var toReturn = [],
			rects;

		if(tmpStartRow == tmpEndRow){
			//select range of the one selected line
			rects = createRectNodesForRange(tmpStartCol,tmpEndCol,tmpStartRow);
			toReturn = toReturn.concat(rects);
		}else{
			//select last part of first line
			rects = createRectNodesForRangeUntilEndOfLine(tmpStartCol,tmpStartRow);
			toReturn = toReturn.concat(rects);

			//select full line for middle lines
			for(var i = tmpStartRow+1; i<tmpEndRow; i++){
				rects = createRectNodesForLine(i);
				toReturn = toReturn.concat(rects); 
			}

			//select first part of last line
			rects = createRectNodesForRange(0,tmpEndCol,tmpEndRow);
			toReturn = toReturn.concat(rects);
		}


		return toReturn;

	}

	function computeLineModeRects(tmpStartRow,tmpEndRow){
		//create rects for all of the lines we have selected
		var toReturn = [];

		for(var i = tmpStartRow; i<tmpEndRow+1; i++){
			var rects = createRectNodesForLine(i);
			toReturn = toReturn.concat(rects); 
		}

		return toReturn;
	}

	function computeBlockModeRects(tmpStartCol,tmpStartRow,tmpEndCol,tmpEndRow){
		//when on same line, this is exactly like character select
		//for multiple lines, though... we simply use the range highlight mode for everything, instead of needing first and middle lines.
		var toReturn = [],
			rects;

		for(var i = tmpStartRow; i<tmpEndRow+1; i++){
			var rects = createRectNodesForRange(tmpStartCol,tmpEndCol,i);	//FIXME: do a bit of work to ensure that we don't highlight more than he has. constrained by end of line
			toReturn = toReturn.concat(rects); 
		}

		return toReturn;
	}

	function render(){
		//this is a simple, stupid, inefficient, naive, "big hammer" approach, where we rerender the entire highlighted region each time something changes
		//of course, we could be much more lcever and only change/add/remove the affected rects

		var sr = self.getNormalizedSelectionRange();

		var rects;
		switch(selectionMode){
			case SELECTION_MODE.CHARACTER:
				rects = computeCharModeRects(sr.startCol,sr.startRow,sr.endCol,sr.endRow);
				break; 
			case SELECTION_MODE.LINE:
				rects = computeLineModeRects(sr.startRow,sr.endRow);
				break; 
			case SELECTION_MODE.BLOCK:
				rects = computeBlockModeRects(sr.startCol,sr.startRow,sr.endCol,sr.endRow);
				break; 
		}

		//TODO stop rendering scene
		clear();

		rects.forEach(function(rect){groupNode.appendChild(rect)});
		
		//TODO start rendering scene again
	}

	this.getNormalizedSelectionRange = function(){
		var tmpEndRow, tmpStartRow,tmpStartCol,tmpEndCol;

		//if need be, swap startRow and endRow
		//varies depending on mode
		switch(selectionMode){
			case SELECTION_MODE.CHARACTER:
			case SELECTION_MODE.LINE:
				if(endRow < startRow || (endCol < startCol && endRow == startRow)){
					tmpEndRow = startRow;
					tmpStartRow = endRow;
					tmpStartCol = endCol;
					tmpEndCol = startCol;
				}else{
					tmpEndRow = endRow;
					tmpStartRow = startRow;
					tmpStartCol = startCol;
					tmpEndCol = endCol;
				}
				break; 
			case SELECTION_MODE.BLOCK:
				if(endCol < startCol){
					tmpStartCol = endCol;
					tmpEndCol = startCol;
				}else{
					tmpStartCol = startCol;
					tmpEndCol = endCol;
				}
				if(endRow < startRow){
					tmpEndRow = startRow;
					tmpStartRow = endRow;
				}else{
					tmpEndRow = endRow;
					tmpStartRow = startRow;
				}
		}

		tmpEndCol++;	//increment tmpEndCol to satisfy vim behaviour

		return {
			endRow:tmpEndRow, startRow:tmpStartRow,startCol:tmpStartCol,endCol:tmpEndCol
		}
	}


	this.startSelection = function(col,row,mode){
		endCol = startCol = col;
		endRow = startRow = row;
		selectionMode = mode;
	}

	this.setEndPos = function(col,row){
		//update private variables
		endCol = col;
		endRow = row;

		render();
	}

	this.setMode = function(mode){
		//update private variables
		selectionMode = mode;

		render();
	}

	this.clearSelection = function(){
		//all we do is clear text nodes, as Statechart guarantees we will call startSelection before calling any other method again
		clear();
	}

	function computeVirtualSelectionRange(sr){
		var numRows = sr.endRow - sr.startRow + 1;
		var toReturn = new Array(numRows);

		if(selectionMode === SELECTION_MODE.LINE){
			sr.startCol = 0;
			sr.endCol = lineManager.getLine(sr.endRow).getTotalNumberOfChars();
		}

		if(sr.startRow === sr.endRow){
			toReturn[0] = [ sr.startCol, sr.endCol ]
		}else{
			
			if(selectionMode === SELECTION_MODE.BLOCK){
				for(var i=sr.startRow,j=0; i < sr.endRow+1; i++,j++){
					toReturn[j] = [sr.startCol,
						Math.min(
							sr.endCol,
							lineManager.getLine(i).getTotalNumberOfChars()
						) ];	
				}
			}else{
				//first line
				toReturn[0] = [sr.startCol, 
								lineManager.getLine(sr.startRow).getTotalNumberOfChars() ];
	
				//middle lines
				for(var i=sr.startRow+1,j=1; i < sr.endRow; i++,j++){
					toReturn[j] = [0, lineManager.getLine(i).getTotalNumberOfChars() ];	
				}

				//last line
				toReturn[numRows-1] = [0,sr.endCol];
			}
				
		}

		return toReturn;
	}

	this.getSelectionText = function(){
		var toReturn = "";

		var sr = this.getNormalizedSelectionRange();
		var vsr = computeVirtualSelectionRange(sr);

		for(var i=sr.startRow,j=0;i<sr.endRow+1; i++,j++){
			toReturn += lineManager.getLine(i).getTextContent().slice(vsr[j][0],vsr[j][1]) + "\n";
		}
		toReturn = toReturn.slice(0,-1);

		return toReturn;
	}

	this.deleteSelectionText = function(){
		var toReturn = "";

		var sr = this.getNormalizedSelectionRange();
		var vsr = computeVirtualSelectionRange(sr);

		for(var i=sr.startRow,j=0;i<sr.endRow+1; i++,j++){
			toReturn += lineManager.getLine(i).deleteRange(vsr[j][0],vsr[j][1]) + "\n";
		}
		toReturn = toReturn.slice(0,-1);

		if(selectionMode === SELECTION_MODE.CHARACTER){ 
			if(startRow!==endRow){ 
				var lastLine = lineManager.getLine(sr.endRow);
				var lastLineTxt = lastLine.getTextContent();
				var firstLine = lineManager.getLine(sr.startRow);

				//delete middle and last lines
				lineManager.deleteLines(sr.startRow+1,sr.endRow+1);

				//delete last line and insert on first line
				firstLine.writeStringAt(lastLineTxt,sr.startCol); 
			}
		}else if(selectionMode === SELECTION_MODE.LINE){
			lineManager.deleteLines(sr.startRow,sr.endRow+1);
		}

		return toReturn;
	}

	this.replaceSelectionText = function(s){
		var toReturn = this.deleteSelectionText();

		var sr = this.getNormalizedSelectionRange();

		var startLine = lineManager.getLine(sr.startRow);


		if(selectionMode === SELECTION_MODE.CHARACTER){ 
			startLine.writeStringAt(s,sr.startCol);
		}else if(selectionMode === SELECTION_MODE.LINE){
			startLine.writeStringAt(s,0);
		}else{
			//FIXME: currently not supported. nontrivial behaviour
		}

		return toReturn;
	}

}

function LineManager(textNode,displayManager){

	var lines = [];

	this.getLine = function(pos){
		return lines[pos];
	}

	this.deleteLine = function(posOrLine){
		var pos = typeof posOrLine == "number" ? posOrLine : lines.indexOf(posOrLine); 

		var line = lines[pos];
		var toReturn = line.getTextContent();
		line.removeFromDOM();
		lines.splice(pos,1);

		if(!lines.length){
			this.createLine(0,"")
		}

		return toReturn;	//return character data
	}

	this.deleteLines = function(from,to){
		var linesToDelete = lines.slice(from,to);
		var toReturn = linesToDelete.map(function(line){return line.getTextContent() + "\n"}).reduce(sum,"").slice(0,-1); 
		linesToDelete.forEach(function(line){line.removeFromDOM()});
		lines.splice(from,to-from);

		if(!lines.length){
			this.createLine(0,"")
		}

		return toReturn;
	}

	this.createLine = function(pos, initialText){

		var lineToInsertBefore = lines[pos];

		//TODO: update params to constructor
		//lineToInsertBefore,initialText,isFirstLine,textNode,displayManager
		var newLine = new Line(lineToInsertBefore,initialText,!pos,textNode,displayManager)

		//put him into lines array
		lines.splice(pos,0,newLine);	
	}
	
	this.getCoords = function(colNum,rowNum){
		var linesExceptCurrent = lines.slice(0,rowNum)
		var heightOflinesExceptCurrent = 
			linesExceptCurrent.
				map(function(line){return line.getTotalHeight()}).
				reduce(sum,0); 

		var coords = lines[rowNum].getCoords(colNum);
		coords.y += heightOflinesExceptCurrent;

		return coords;
	}

	this.getLineCount = function(){
		return lines.length;
	}
}


function Line(lineToInsertBefore,initialText,isFirstLine,textNode,displayManager){

	//private vars
	var isEmpty,		//because we are relying on the tspan dy attribute for positioning, "empty" tspans will need to have a single whitespace. 
				//so we can't rely on simply using the length of the textContent to encode emptyness of a line, and need to use a separate
				//variable to keep track of changes in state
		tspans;

	var self = this;

	//private functions
	function init(){

		if(initialText && initialText.length){
			isEmpty = false;
		}else{
			isEmpty = true;
			initialText = " ";
		} 

		//TODO: move this initialization logic into its own function. would be cleaner
		//wordwrap the initial text
		tspans = [];
		do{
			var tmpTspanTxt = initialText.substring(0,displayManager.displayCharWidth);

			var currenttspan = createTspan(tmpTspanTxt);

			tspans.push(currenttspan);

			initialText = initialText.slice(displayManager.displayCharWidth);
		}while(initialText.length)

		var tspanToInsertBefore = lineToInsertBefore && lineToInsertBefore.getFirstTSpan(); 

		tspans.reverse().reduce(function(tmpTspanToInsertBefore,currenttspan){
			textNode.insertBefore(currenttspan,tmpTspanToInsertBefore);
			return currenttspan;
		},tspanToInsertBefore); 

		tspans.reverse();	//reverse changes the array, so we need to reverse him back to the right order
	}

	function createTspan(textContent){
			var tspan = document.createElementNS(svgNS,"tspan");
			tspan.setAttributeNS(null,"x",0);
			tspan.textContent = textContent;
			tspan.setAttributeNS(null,"dy",displayManager.textExtent.height);

			return tspan;
	}

	function deleteTspan(tspan){
		tspans.splice(tspans.indexOf(tspan),1);
		textNode.removeChild(tspan);
	}

	function deleteTspanIfEmpty(tspan){
		if(!tspan.textContent.length){
			deleteTspan(tspan);
		}
	}

	function deleteLastTspanIfEmpty(){
		deleteTspanIfEmpty(self.getLastTSpan());
	}

	function insertTspan(newtspan,tspanToInsertBefore){
		textNode.insertBefore(newtspan,tspanToInsertBefore);
		tspans.push(newtspan); //FIXME: instead of push, I think we need to use splice
	}

	function appendTspan(newtspan){
		var tspanToInsertBefore = self.getLastTSpan().nextSibling;

		insertTspan(newtspan,tspanToInsertBefore);
	}

	function wrapSingleChar(yPos){
		//apply wordwrap to all following rows by taking the first character of the next line and adding it to the end of the current line
		var charToAddToCurrentLine,tspanToUpdate,nextTspan;
		for(var i=yPos,l=tspans.length;i<l-1;i++){
			tspanToUpdate = tspans[i];
			nextTspan = tspans[i+1];
			charToAddToCurrentLine = nextTspan.textContent[0] || ""; 

			tspanToUpdate.textContent = tspanToUpdate.textContent + charToAddToCurrentLine;
			nextTspan.textContent = nextTspan.textContent.substring(1);
		}
	}

	//call init
	init();

	//public methods

	this.removeFromDOM = function(){
		tspans.forEach(function(tspan){
			textNode.removeChild(tspan);
		});
	}

	this.getFirstTSpan = function(){
		return tspans[0]; 
	}

	this.getLastTSpan = function(){
		return tspans[tspans.length-1]; 
	}

	this.getCoords = function(colNum){
		var yPos = Math.floor(colNum / displayManager.displayCharWidth);
		var xPos = colNum - (yPos * displayManager.displayCharWidth);
		//console.log("ypos :", yPos )
		//console.log("xpos :", xPos )

		var y = yPos * displayManager.textExtent.height;
		var x = xPos  * displayManager.textExtent.width;
		return {x:x,y:y};
	}

	this.getTotalHeight = function(){
		//FIXME: use dy instead? or maybe the greater of the two...
		return displayManager.textExtent.height * tspans.length;
	}

	this.writeCharAt = function(c,pos){
		//get the tspan where the cursor is at, and see if we've exceed the acceptable number of characters
		var yPos = Math.floor(pos / displayManager.displayCharWidth);
		var xPos = pos - (yPos * displayManager.displayCharWidth);

		var currenttspan = tspans[yPos];

		if(currenttspan === undefined){
			//create new tspan if we're starting a new line
			var newtspan = createTspan("");

			appendTspan(newtspan);

			currenttspan = newtspan;
		}

		var tv = isEmpty ? "" : currenttspan.textContent;
		currenttspan.textContent = tv.substring(0,xPos) + c + tv.substring(xPos,tv.length);

		//update isEmpty
		isEmpty = false;

		if(currenttspan.textContent.length > displayManager.displayCharWidth){
			//apply wordwrap if needed... actually letterwrap, as is currently done in vim
			//insert the character, then take the last character, and move him to the front of the next line. continue this for all other lines

			//check whether last line is full. if so, add a new tspan element to the end
			if(this.getLastTSpan().textContent.length+1 > displayManager.displayCharWidth){

				var newtspan = createTspan("");

				appendTspan(newtspan);
			}

			var charToAddToNextLine,tspanToUpdate;
			for(var i=yPos,l=tspans.length;i<l-1;i++){
				tspanToUpdate = tspans[i];

				//update text
				if(charToAddToNextLine){
					tspanToUpdate.textContent = charToAddToNextLine + tspanToUpdate.textContent;
				}

				var tc = tspanToUpdate.textContent;
				charToAddToNextLine = tc[tc.length-1];
				tspanToUpdate.textContent = tc.slice(0,tc.length-1);
			}

			tspanToUpdate = this.getLastTSpan();
			if(charToAddToNextLine){
				tspanToUpdate.textContent = charToAddToNextLine + tspanToUpdate.textContent;
			}

		}	
	}

	this.writeStringAt = function(str,pos){
		//TODO: this might be inefficient, especially for long lines. 
		for(var i=0,l=str.length;i<l;i++){
			this.writeCharAt(str[i],pos++);
		}
	}

	this.writeBackspace = function(pos){
		var yPos = Math.floor(pos / displayManager.displayCharWidth);
		var xPos = pos - (yPos * displayManager.displayCharWidth);

		var currenttspan = tspans[yPos];

		var tv = currenttspan.textContent;
		currenttspan.textContent = tv.substring(0,xPos) + tv.substring(xPos+1,tv.length);

		wrapSingleChar(yPos);

		var tspanToInsertBefore = this.getLastTSpan().nextSibling;

		deleteLastTspanIfEmpty();

		//if we have deleted all tspans, create new tspan, update isEmpty
		if(!tspans.length){

			var currenttspan = createTspan(" ");

			insertTspan(currenttspan,tspanToInsertBefore);

			isEmpty = true;
		}
	
	}

	this.getTotalNumberOfChars = function(){
		return isEmpty ? 0 : tspans.map(function(ts){return ts.textContent.length}).reduce(sum,0);
	}

	this.deleteRange = function(from,to){
		//up to, but not including "from" (like Array.slice or String.substring)
		//but does include "to"

		var totalNumChars = this.getTotalNumberOfChars();

		//FIXME: off by one error?
		var yPosFrom = totalNumChars == from ? tspans.length-1 : Math.floor(from / displayManager.displayCharWidth);
		var xPosFrom = from - (yPosFrom * displayManager.displayCharWidth);
		var currenttspanFrom = tspans[yPosFrom];

		var yPosTo = totalNumChars == to ? tspans.length-1 : Math.floor(to / displayManager.displayCharWidth);
		var xPosTo = to - (yPosTo * displayManager.displayCharWidth);
		var currenttspanTo = tspans[yPosTo];

		if(currenttspanTo === undefined){
			throw new Error("currenttspanTo is undefined");
		}

		//compute return value
		var toReturn;

		if(currenttspanFrom === currenttspanTo){
			var tspan = currenttspanFrom;
			toReturn = tspan.textContent.substring(xPosFrom,xPosTo);
			tspan.textContent = tspan.textContent.substring(0,xPosFrom) + tspan.textContent.substring(xPosTo); 
		}else{
			//remove all middle tspans
			var middleTspans = tspans.splice(yPosFrom+1,yPosTo-1 - yPosFrom);
			middleTspans.forEach(function(tspan){textNode.removeChild(tspan)});

			toReturn = "";
			toReturn += currenttspanFrom.textContent.substring(xPosFrom);
			toReturn += middleTspans.map(function(tspan){return tspan.textContent}).reduce(sum,"");
			toReturn += currenttspanTo.textContent.substring(0,xPosTo);

			//alter text on currenttspanFrom by slicing xPosFrom:
			currenttspanFrom.textContent = currenttspanFrom.textContent.substring(0,xPosFrom);

			//alter text on currenttspanTo by slicing :xPosTo
			currenttspanTo.textContent = currenttspanTo.textContent.substring(xPosTo);

			deleteTspanIfEmpty(currenttspanTo);

		}


		//then perform wordwrap... but we can't assume only one character has been deleted. 
		//have to do it for as many characters as have been deleted, or until until it is in a legal configuration
		while(!tspans.slice(0,-1).every(function(tspan){return tspan.textContent.length === displayManager.displayCharWidth})){
			
			wrapSingleChar(yPosFrom);

			//delete last tspan if it is empty
			deleteLastTspanIfEmpty();
		}

		//TODO: update isEmpty
		if(tspans[0].textContent.length === 0){
			tspans[0].textContent = " ";
			isEmpty = true;
		}
		
		return toReturn;
	}

	this.getTextContent = function(){
		return isEmpty ? "" : tspans.map(function(ts){return ts.textContent}).reduce(sum,"")
	}
}

function DisplayManager(textExtent,displayWidth){
	this.textExtent = textExtent;
	this.displayWidth = displayWidth;

	this.displayCharWidth = Math.floor(displayWidth/textExtent.width);	//derived attribute
}


SVGEditorFactory = {

	//responsible for bootstrapping the system
	createNewSVGEditorInstance : function(rootNode,textNode,cursorNode,commandCursorNode,modeTextNode,locationTextNode,commandTextNode,selectionGroupNode,textExtent,displayWidth,scInstance){

		var displayManager = new DisplayManager(textExtent,displayWidth);


		var lineManager = new LineManager(textNode,displayManager);

		lineManager.createLine(0); //create the initial line without text content 

		var selectionManager = new SelectionManager(selectionGroupNode,displayManager,lineManager);

		var cursor = new Cursor(0,0,lineManager,displayManager,cursorNode);


		var cmdLineManager = new LineManager(commandTextNode,displayManager);

		cmdLineManager.createLine(0);

		var cmdCursor = new Cursor(0,0,cmdLineManager,displayManager,commandCursorNode,commandCursorNode.x.baseVal.value,commandCursorNode.y.baseVal.value);

		var editor = new SVGEditor(cursor,cmdCursor,modeTextNode,scInstance,rootNode,selectionManager);

		return editor;
	}
}
