class Simple_Draw {
    constructor(containerId, resolution =540, scale = 0.5 ,maxHistory = 51) { // maxHistory define the max step undo can perform
        this.container = document.getElementById(containerId);
        this.real_width = resolution;
        this.real_height = resolution;
        this.canvas_scale = Math.round(1080/resolution);
        this.scale = scale;

        if (this.container.querySelector("canvas")) {
            console.warn("Canvas already exists in", containerId);
            return;
        }

        //the width and height of the style of the canvas
        this.canvas_height = Math.round(1080 * this.scale);
        this.canvas_width = Math.round(1080 * this.scale);

        //the width and height of the tool area
        this.tool_w= this.canvas_width/5 + (5 * (scale));
        this.tool_h= this.canvas_height;

        //the distance between tool(canvas) and border
        this.back_distance = 16 * scale;

        //the distance between tool area and canvas
        this.tool_canvas_distance = 10*scale;

        //the width and height of the whole tool
        this.back_w = this.canvas_width + this.tool_w + this.back_distance*2 + this.tool_canvas_distance ;
        this.back_h = this.canvas_height + this.back_distance*2;

        this.back_border = 4 * scale;
        this.backgroundColor = '#ffffff';
        this.isDrawing = false;

        this.savedCanvasState = null; 

        this.strokeColor = '#111111';
        this.current_tool = 1; // 1 brush 2 eraser 3 text 4 bucket 5 square 6 circl 7 hollow_square  8 hollow circle 9 clear 10 straight line
        this.maxHistory = maxHistory;

        this.canvasHistory = [];
        this.historyIndex = -1;

        //white, gray
        // this.outside_border = '#7F7F7F';
        // this.back_background = '#D0D1D0';

        // this.canvas_border = 'white'
        // this.tool_canvas_border = '#B5B6B5';
        // this.tool_area_background = '#E1E2E1';

        // this.button_color = '#ffffff';

        // this.select_color = '#51A3FA';
        // this.select_static_color = '#ffffff';

        //yellow, orange
        // this.outside_border = '#f26430';
        // this.back_background = '#f28705';

        // this.canvas_border = '#f28705'
        // this.tool_canvas_border = '#f2b705';
        // this.tool_area_background = '#f2b705';

        // this.button_color = ' #f2e205';

        // this.select_color = '#024959';
        // this.select_static_color = 'white';

        //blue
        // this.outside_border = ' #0460d9';
        // this.back_background = ' #0460d9';

        // this.canvas_border = '#0476d9'
        // this.tool_canvas_border = '  #0476d9';
        // this.tool_area_background = '  #5eadf2';

        // this.button_color = '#99d9f2';

        // this.select_color = ' rgb(224, 246, 255)';
        // this.select_static_color = 'rgb(224, 246, 255)';

        //green, brown
        //  this.outside_border = '  #402f20';
        //  this.back_background = 'rgb(76, 63, 38)';
 
        //  this.canvas_border = ' #403c04'
        //  this.tool_canvas_border = ' #403c04';
        //  this.tool_area_background = '  #4f5904';
 
        //  this.button_color = 'rgb(139, 156, 11)';
 
        //  this.select_color = ' rgb(233, 246, 132)';
        //  this.select_static_color = 'rgb(233, 246, 132)';

        //green, dark gree
         this.outside_border = ' #172126';
         this.back_background = '#2e5955';
 
         this.canvas_border = '#2e5955'
         this.tool_canvas_border = '    #7ca69e';
         this.tool_area_background = '   #7ca69e';
 
         this.button_color = '#bad9d3';
 
         this.select_color = 'rgb(91, 45, 45)';
         this.select_static_color = 'rgb(254, 215, 199)';



        this.initCanvas();
        this.init_tool_set();
    }
  
    initCanvas() {
        //create the background part
        const backgroundDiv = document.createElement('div');
        backgroundDiv.style.width = this.back_w + 'px';
        backgroundDiv.style.height = this.back_h + 'px';
        backgroundDiv.style.backgroundColor = this.backgroundColor;
        backgroundDiv.style.position = 'relative';
        backgroundDiv.style.border = this.back_border + `px solid ${this.outside_border}`;
        backgroundDiv.style.borderRadius = '10px';
        backgroundDiv.style.background = this.back_background;
        backgroundDiv.style.display = 'flex';
        backgroundDiv.style.alignItems = 'center'; 
        backgroundDiv.style.justifyContent = 'center'; 

        //create the tool part
        this.tool_set = document.createElement('div');
        this.tool_set.style.width = this.tool_w + 'px';
        this.tool_set.style.height = this.tool_h + 'px';
        this.tool_set.style.backgroundColor = this.tool_area_background;
        this.tool_set.style.border = 4*this.scale+`px solid ${this.tool_area_border}`;
        this.tool_set.style.borderRadius = '10px';
        this.tool_set.style.display = 'inline-block';

        //create the canvas part
        const canvas_div = document.createElement('div');
        canvas_div.style.display = 'flex';
        canvas_div.style.alignItems = 'center';
        canvas_div.style.justifyContent = 'center';
        canvas_div.style.gap = this.tool_canvas_distance + 'px';
        canvas_div.style.margin = 20*this.scale+'px';

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.real_width;
        this.canvas.height = this.real_height;
        this.canvas.style.width = this.canvas_width + 'px';
        this.canvas.style.height = this.canvas_height + 'px';
        this.canvas.style.background = '#ffffff';
        this.canvas.style.border = 4*this.scale+`px solid ${this.canvas_border}`;
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.imageRendering = "pixelated";
        this.canvas.style.imageRendering = "optimizeSpeed";
        this.ctx = this.canvas.getContext("2d");     
        // const dpr = window.devicePixelRatio || 1;
        // this.canvas.width = this.real_width * dpr;
        // this.canvas.height = this.real_height * dpr;
        // this.canvas.style.width = `${this.canvas_width}px`;
        // this.canvas.style.height = `${this.canvas_height}px`;
        // this.ctx.scale(dpr, dpr);
        this.ctx.lineWidth = 10;
        this.strokeSize = 10;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round"; 
        this.fillbucket(0,0,'#ffffff');
        this.saveCanvasState();
        
        this.canvas.addEventListener('mousedown',this.startDrawing.bind(this));
        this.canvas.addEventListener('mouseup',this.stopDrawing.bind(this));
        this.canvas.addEventListener('mousemove',this.draw.bind(this));
        this.canvas.addEventListener('mouseleave',this.stopDrawing.bind(this));
        this.canvas.addEventListener('click', this.clickevent.bind(this));

        document.addEventListener('keydown', this.handleTyping.bind(this));

        canvas_div.appendChild(this.tool_set);
        canvas_div.appendChild(this.canvas);
        backgroundDiv.appendChild(canvas_div);
        this.container.appendChild(backgroundDiv);
    }

    clickevent(event) {
        // the clickevent handle the text and bucket
        let x = Math.round(event.offsetX / this.scale / this.canvas_scale );
        let y = Math.round(event.offsetY / this.scale / this.canvas_scale);
        if (this.current_tool == 3){
            //text part
            this.isTyping = true;
            this.textX = x;
            this.textY = y;
            this.textInput = '';
            this.savedCanvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
        if(this.current_tool == 4){
            //bucket part
            this.fillbucket(x,y,this.strokeColor);
        }
    }

    fillbucket(x, y, targetColor) {
        let ctx = this.ctx;
        let width = this.canvas.width;
        let height = this.canvas.height;
    
        let imgData = ctx.getImageData(0, 0, width, height);
        let pixels = imgData.data;
    
        let startPos = (Math.floor(y) * width + Math.floor(x)) * 4;
        let startColor = {
            r: pixels[startPos],
            g: pixels[startPos + 1],
            b: pixels[startPos + 2],
            a: pixels[startPos + 3]
        };
        // make sure the targetColor is in the format of rgba and a is 255
        let fillColor = this.parseRGB(targetColor);
        
        if (this.colorsMatch(fillColor, startColor)) {
            return;
        }
        
        let stack = [[Math.floor(x), Math.floor(y)]];
    
        let visited = new Set();
        visited.add(`${Math.floor(x)},${Math.floor(y)}`);

        //use dfs to fill the area
        while (stack.length > 0) {
            let [nowX, nowY] = stack.pop();
            let nowPos = (nowY * width + nowX) * 4;
    
            let nowColor = {
                r: pixels[nowPos],
                g: pixels[nowPos + 1],
                b: pixels[nowPos + 2],
                a: pixels[nowPos + 3]
            };
    
            if (this.colorsMatch(nowColor, startColor)) {
                pixels[nowPos] = fillColor.r;
                pixels[nowPos + 1] = fillColor.g;
                pixels[nowPos + 2] = fillColor.b;
                pixels[nowPos + 3] = fillColor.a;
    
                let neighbors = [
                    [nowX, nowY + 1], [nowX, nowY - 1],
                    [nowX + 1, nowY], [nowX - 1, nowY],
                ];
    
                for (let [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx},${ny}`)) {
                        visited.add(`${nx},${ny}`);
                        stack.push([nx, ny]);
                    }
                }
            }
        }
    
        ctx.putImageData(imgData, 0, 0);
        this.saveCanvasState();
    }
    
    //check whether two colors are similar
    colorsMatch(color1, color2) {
        const tolerance = 10;
        
        const clamp = (val) => Math.max(0, Math.min(255, val));
    
        return Math.abs(clamp(color1.r) - clamp(color2.r)) <= tolerance &&
               Math.abs(clamp(color1.g) - clamp(color2.g)) <= tolerance &&
               Math.abs(clamp(color1.b) - clamp(color2.b)) <= tolerance;
    }
    //make the color in the format of rgba
    parseRGB(color) {
        if (color.startsWith("#")) {
            let bigint = parseInt(color.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
                a: 255
            };
        } else {
            let match = color.match(/\d+/g);
            return {
                r: parseInt(match[0], 10),
                g: parseInt(match[1], 10),
                b: parseInt(match[2], 10),
                a: 255
            };
        }
    }

    handleTyping(event) {
        //handle the text tool
        if (!this.isTyping) return;
        this.ctx.putImageData(this.savedCanvasState, 0, 0);
        this.ctx.fillStyle = this.strokeColor;
        this.ctx.font = this.strokeSize * 10 + 'px Arial';
        if (event.key === 'Enter') {
            this.textInput = '';
            this.isTyping = false;
        } 
        else if (event.key === 'Backspace') {
            this.textInput = this.textInput.slice(0, -1);
        } 
        else {
            this.textInput += event.key;
            this.ctx.fillText(this.textInput, this.textX, this.textY);
        }
        this.saveCanvasState();
    }
  
    startDrawing(event) {
        //when mousedown on the canvas, start to draw
        //initialize the start position and the set isDrawing to true
        //save the current canvas state for rectangle, oval and straight line tool
        let x = Math.round(event.offsetX / this.scale / this.canvas_scale);
        let y = Math.round(event.offsetY / this.scale / this.canvas_scale);

        if (this.current_tool === 1 || this.current_tool === 2) {
            this.isDrawing = true;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
        } else if (this.current_tool === 5 || this.current_tool === 7) {
            this.isDrawing = true;
            this.startX = x;
            this.startY = y;
            this.savedCanvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
        else if (this.current_tool === 6 || this.current_tool === 8) {
            this.isDrawing = true;
            this.startX = x;
            this.startY = y;
            this.savedCanvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
        else if(this.current_tool == 10){
            this.isDrawing = true;
            this.startX = x;
            this.startY = y;
            this.savedCanvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
    }
  
    draw(event) {
        //when mousemove on the canvas, draw the line
        let x = Math.round(event.offsetX / this.scale / this.canvas_scale);
        let y = Math.round(event.offsetY / this.scale / this.canvas_scale);

        // let imgData = this.ctx.getImageData(x, y, 1, 1);
        // let [r, g, b, a] = imgData.data;
        // console.log(`Pixel at (${x}, ${y}): rgba(${r}, ${g}, ${b}, ${a})`);

        if (this.current_tool === 1 || this.current_tool === 2) {
            // brush and eraser
            if (!this.isDrawing) return;
            this.ctx.strokeStyle = this.current_tool === 2 ? "#ffffff" : this.strokeColor;
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.moveTo(x, y);
        } else if (this.current_tool === 5 || this.current_tool === 7) {
            // square and hollow square
            if (!this.isDrawing) return;

            this.ctx.putImageData(this.savedCanvasState, 0, 0);

            let width = x - this.startX;
            let height = y - this.startY;

            this.ctx.strokeStyle = this.strokeColor;

            if (this.current_tool === 5) {
                this.ctx.fillStyle = this.strokeColor;
                //this.ctx.fillRect(this.startX, this.startY, width, height);
                this.ctx.fillRect(Math.round(this.startX), Math.round(this.startY), Math.round(width), Math.round(height));
            } else if (this.current_tool === 7) {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }
        }
        else if (this.current_tool === 6 || this.current_tool === 8) {
            // circle and hollow circle
            if (!this.isDrawing) return;

            this.ctx.putImageData(this.savedCanvasState, 0, 0);

            let width = Math.abs(x - this.startX);
            let height = Math.abs(y - this.startY);
            let center_x = Math.min(this.startX,x) + Math.abs(width/2);
            let center_y = Math.min(this.startY,y) + Math.abs(height/2);
            this.ctx.strokeStyle = this.strokeColor;

            if (this.current_tool === 6) {
                this.ctx.fillStyle = this.strokeColor;
                this.ctx.beginPath();
                // this.ctx.ellipse(center_x, center_y, width / 2, height / 2, 0, 0, 2 * Math.PI);
                this.ctx.ellipse(Math.round(center_x), Math.round(center_y), Math.round(width / 2), Math.round(height / 2), 0, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (this.current_tool === 8) {
                this.ctx.fillStyle = this.strokeColor;
                this.ctx.beginPath();
                // this.ctx.ellipse(center_x, center_y, width / 2, height / 2, 0, 0, 2 * Math.PI);
                this.ctx.ellipse(Math.round(center_x), Math.round(center_y), Math.round(width / 2), Math.round(height / 2), 0, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
        else if(this.current_tool == 10){
            //straight line
            if (!this.isDrawing) return;
            this.ctx.putImageData(this.savedCanvasState, 0, 0);
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.round(this.startX), Math.round(this.startY));
            this.ctx.lineTo(Math.round(x), Math.round(y));
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
  
    stopDrawing(event) {
        //when mouseup on the canvas, stop drawing
        let x = Math.round(event.offsetX / this.scale / this.canvas_scale);
        let y = Math.round(event.offsetY / this.scale / this.canvas_scale);
        if(this.isDrawing){
            this.saveCanvasState();
        }
        if (this.current_tool === 1 || this.current_tool === 2) {
            this.isDrawing = false;
            this.ctx.closePath();
        } else if (this.current_tool === 5 || this.current_tool === 7) {
            if (!this.isDrawing) return;
            this.isDrawing = false;
        }
        else if (this.current_tool === 6 || this.current_tool === 8) {
            if (!this.isDrawing) return;
            this.isDrawing = false;
        }
        else if (this.current_tool === 10) {
            if (!this.isDrawing) return;
            this.isDrawing = false;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const previousState = this.canvasHistory[this.historyIndex];
            this.ctx.putImageData(previousState, 0, 0);
        }
    }
    
    redo() {
        if (this.historyIndex < this.canvasHistory.length - 1) {
            this.historyIndex++;
            const nextState = this.canvasHistory[this.historyIndex];
            this.ctx.putImageData(nextState, 0, 0);
        }
    }

    saveCanvasState() {
        //save the state of the canvas for undo and redo
        const ctx = this.canvas.getContext('2d');
    
        const canvasState = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height );
    
        if (this.historyIndex < this.canvasHistory.length - 1) {
            this.canvasHistory = this.canvasHistory.slice(0, this.historyIndex + 1);
        }
    
        if (this.canvasHistory.length >= this.maxHistory) {
            this.canvasHistory.shift(); 
        } else {
            this.historyIndex++;
        }
    
        this.canvasHistory.push(canvasState);
    }

    init_tool_set() {
        //the default static color
        const static_color = [
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd","#ffffff"],
            ["#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79","#bdbdbd"],
            ["#660000","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130","#111111"],
        ];
        //create the color tool area
        const color_tool_area = document.createElement('div');
        color_tool_area.style.width = this.tool_w + 'px';
        color_tool_area.style.height = this.tool_h / 2 + 'px';
        color_tool_area.style.display = 'grid';
        color_tool_area.style.gridTemplateColumns = 'repeat(3, 1fr)';
        color_tool_area.style.gridAutoRows = `${this.box_width_height}px`;
        color_tool_area.style.alignContent = 'space-evenly';
        color_tool_area.style.justifyContent = 'center';
        color_tool_area.style.placeItems = 'center'; 
        
        this.box_width_height = 12 * (this.scale * 4);
        
        const rows = static_color[0].length;
        const cols = static_color.length;   
        
        let selectedColorElement = null;
        //create the color box
        for (let row = 0; row < rows; row++) { 
            for (let col = 0; col < cols; col++) { 
                if (static_color[col][row] !== undefined) { 
                    const color = document.createElement('div');
                    color.style.width = this.box_width_height + 'px';
                    color.style.height = this.box_width_height + 'px';
                    color.style.backgroundColor = static_color[col][row];
                    color.style.borderRadius = '50%';
                    color.style.cursor = 'pointer';
                    color.style.boxSizing = 'border-box';
                    color.addEventListener('click', (event) => {
                        if (selectedColorElement) {
                            selectedColorElement.style.border = "none";
                        }
        
                        this.strokeColor = event.target.style.backgroundColor;
                        
                        event.target.style.border = 5*this.scale + `px solid ${this.select_static_color}`;
                        selectedColorElement = event.target;
                    });
        
                    color_tool_area.appendChild(color); 
                }
            }
        }
        
        this.tool_set.appendChild(color_tool_area);      
        //create the other tool area
        this.other_tool_width_height = 18 * (this.scale * 4);

        const other_tool_area = document.createElement('div');
        other_tool_area.style.width = this.tool_w + 'px';
        other_tool_area.style.height = this.tool_h*4/10 + 'px';
        other_tool_area.style.display = 'grid';
        other_tool_area.style.gridTemplateColumns = 'repeat(2, 1fr)'; 
        other_tool_area.style.gridTemplateRows = 'repeat(5, 1fr)'; 
        // other_tool_area.style.gap = '2px'; 
        other_tool_area.style.placeItems = 'center'; 
        color_tool_area.style.justifyContent = 'center';


        //the svg image for the tools
        const brush_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTQ4MDMgNTEwNSBjLTE3OSAtNTAgLTQzMiAtMjAxIC04MDQgLTQ4MSAtMzg2IC0yOTAgLTUyNSAtNDE3IC0xMjIxCi0xMTE3IC0zMjkgLTMyOSAtNTk4IC02MDMgLTU5OCAtNjA2IDAgLTQgMTkgLTE4IDQyIC0zMSAxMTkgLTY2IDI3OSAtMTg1IDQwNwotMzA1IDExNCAtMTA3IDI4MiAtMzIzIDM0OSAtNDUwIDEyIC0yMiAyNiAtNDYgMzEgLTU0IDcgLTExIDM3IDE0IDEzMyAxMTUKMjg2IDI5NyA1MTUgNTY5IDkyNyAxMDk5IDg1NyAxMTAyIDEwNDIgMTM4OCAxMDQ1IDE2MTcgMSA2OSAtMiA4MCAtMjkgMTE5Ci00OCA2OCAtMTA0IDEwMiAtMTcyIDEwNiAtMzIgMSAtODEgLTQgLTExMCAtMTJ6Ii8+CjxwYXRoIGQ9Ik0xODU5IDI1NzIgYy0yMDUgLTIxMiAtMzQxIC0zNjQgLTMzMyAtMzcxIDUgLTQgMzggLTE4IDc0IC0zMSAyMDkKLTczIDQyMyAtMjQxIDU1MCAtNDI5IDYyIC05NCAxMTAgLTE4MyAxMzAgLTI0NiA3IC0yMiAxOSAtNTUgMjcgLTczIGwxNCAtMzQKNTIgNDkgYzI5IDI2IDEzNCAxMjQgMjM0IDIxNyBsMTgxIDE2OSAtMzAgNjUgYy0xMTEgMjQ0IC0zNDQgNTAzIC02MDkgNjc1Ci03MiA0NyAtMTgwIDEwNyAtMTkyIDEwNyAtMiAwIC00NiAtNDQgLTk4IC05OHoiLz4KPHBhdGggZD0iTTEwNjcgMTk0OSBjLTMxOSAtMzIgLTYwNiAtMjUwIC03MjkgLTU1NCAtNDUgLTEwOSAtNTggLTE4NyAtNjgKLTM4NSAtMTcgLTMyNyAtNTMgLTU2NCAtMTA4IC03MDYgLTEwIC0yNyAtNTEgLTEwMSAtOTAgLTE2NCBsLTcxIC0xMTUgNzcgLTYKYzQyIC00IDE1OCAtMTAgMjU3IC0xNCA2ODIgLTI4IDEzNjEgMTk0IDE1ODMgNTE3IDExNiAxNjkgMTcyIDQxNSAxNDMgNjMyCi0zNyAyNzcgLTE4MCA1MTAgLTQwMCA2NTEgLTEyNSA4MCAtMjY0IDEyOSAtMzk2IDE0MCAtMzggMyAtODEgNyAtOTUgOSAtMTQgMQotNjAgLTEgLTEwMyAtNXoiLz4KPC9nPgo8L3N2Zz4K"
        const eraser_base64 ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTMwNTcgNDYyOCBjLTQ3IC00IC05MiAtMTggLTE0NSAtNDMgLTc1IC0zNSAtOTMgLTUyIC04MzcgLTc5NQpsLTc2MCAtNzYwIDEwMTcgLTEwMTcgMTAxOCAtMTAxOCA3NDYgNzQ1IGM0NjIgNDYxIDc2MSA3NjcgNzg0IDgwMyA1OSA4OSA3NQoxNDYgNzQgMjYyIDAgMTExIC0yMSAxODEgLTc3IDI2NSAtMzggNTcgLTEzODIgMTQwNiAtMTQ2MCAxNDY1IC0xMDAgNzYgLTIyMQoxMDcgLTM2MCA5M3oiLz4KPHBhdGggZD0iTTc3NCAyNDg4IGMtMzI5IC0zMzMgLTM1MCAtMzU5IC0zNzkgLTQ3OSAtMjcgLTExNyAtMTYgLTIxNiAzOCAtMzI5CjI4IC01OCA3NSAtMTA5IDQzNiAtNDcyIGw0MDQgLTQwNyAtNTA2IC0zIGMtNDkzIC0zIC01MDYgLTQgLTUzMyAtMjQgLTUzIC0zOQotNjkgLTcxIC02OSAtMTM0IDAgLTYzIDE2IC05NSA2OSAtMTM0IGwyNyAtMjEgMjIxOSAwIDIyMTkgMCAyNyAyMSBjNTMgMzkgNjkKNzEgNjkgMTM0IDAgNjMgLTE2IDk1IC02OSAxMzQgLTI3IDIxIC0zNyAyMSAtODM0IDI0IGwtODA3IDIgLTEwMDAgMTAwMAotMTAwMCAxMDAwIC0zMTEgLTMxMnoiLz4KPC9nPgo8L3N2Zz4K"
        const text_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTc4IDUwOTkgYy0yMyAtMTIgLTQ2IC0zNSAtNTggLTU5IC0xOSAtMzggLTIwIC01OCAtMjAgLTQ5MiAwIC00MjIKMSAtNDU2IDE5IC00ODggMjkgLTU1IDY0IC03NSAxMzEgLTc1IDY3IDAgMTAyIDIwIDEzMSA3NSAxOCAzMiAxOSA2MyAxOSAzOTcKbDAgMzYzIDM2MyAwIGMzMzQgMCAzNjUgMSAzOTcgMTkgNTUgMjkgNzUgNjQgNzUgMTMxIDAgNjcgLTIwIDEwMiAtNzUgMTMxCi0zMiAxOCAtNjUgMTkgLTQ5MCAxOSAtNDMzIC0xIC00NTcgLTIgLTQ5MiAtMjF6Ii8+CjxwYXRoIGQ9Ik00MDYwIDUxMDEgYy01NSAtMjkgLTc1IC02NCAtNzUgLTEzMSAwIC02NyAyMCAtMTAyIDc1IC0xMzEgMzIgLTE4CjYzIC0xOSAzOTcgLTE5IGwzNjMgMCAwIC0zNjMgYzAgLTMzNCAxIC0zNjUgMTkgLTM5NyAyOSAtNTUgNjQgLTc1IDEzMSAtNzUKNjcgMCAxMDIgMjAgMTMxIDc1IDE4IDMyIDE5IDY2IDE5IDQ4OCAwIDQzNCAtMSA0NTQgLTIwIDQ5MiAtMTMgMjYgLTM0IDQ3Ci02MCA2MCAtMzggMTkgLTU4IDIwIC00OTIgMjAgLTQyMiAwIC00NTYgLTEgLTQ4OCAtMTl6Ii8+CjxwYXRoIGQ9Ik05NzAgNDIyNyBjLTUwIC0yNSAtNTAgLTI2IC00OCAtNTYwIGwzIC00OTkgMjggLTI0IGMyOCAtMjQgMjggLTI0CjI3OCAtMjQgMTYwIDAgMjU4IDQgMjcxIDExIDM5IDIxIDQ4IDY3IDQ4IDI1NyBsMCAxNzkgMjYgMjQgMjYgMjQgMjc4IDMgYzMwNwozIDM0MSAtMiAzNjAgLTUzIDE0IC0zNiAxNCAtMjM3NCAwIC0yNDEwIC0xNiAtNDMgLTYzIC01NSAtMjEzIC01NSAtMTkwIDAKLTE3NyAyMiAtMTc3IC0zMDIgMCAtMTQxIDMgLTI2NCA2IC0yNzMgMTcgLTQ0IDI2IC00NSA3MDQgLTQ1IDY3OCAwIDY4NyAxCjcwNCA0NSAzIDkgNiAxMzIgNiAyNzQgMCAzMjMgMTMgMzAxIC0xNzggMzAxIC0xNDkgMCAtMTk2IDEyIC0yMTIgNTUgLTE0IDM2Ci0xNCAyMzc0IDAgMjQxMCAxOSA1MSA1MyA1NiAzNjAgNTMgMzYwIC00IDMyNyAyMSAzMzIgLTI1MCBsMyAtMjAwIDI4IC0yNCAyOAotMjQgMjU0IDAgMjU0IDAgMjggMjQgMjggMjQgMCA1MTEgMCA1MTAgLTIzIDIzIC0yMyAyMyAtMTU3NyAyIGMtMTI1MiAyCi0xNTgyIDAgLTE2MDIgLTEweiIvPgo8cGF0aCBkPSJNODQgMTEyNiBjLTE3IC03IC00MiAtMjkgLTU1IC00NyBsLTI0IC0zNCAtMyAtNDYyIGMtMiAtNDQ5IC0yIC00NjQKMTggLTUwMyAxMyAtMjYgMzQgLTQ3IDYwIC02MCAzOCAtMTkgNTggLTIwIDQ5MiAtMjAgNDIyIDAgNDU2IDEgNDg4IDE5IDU1IDI5Cjc1IDY0IDc1IDEzMSAwIDY3IC0yMCAxMDIgLTc1IDEzMSAtMzIgMTggLTYzIDE5IC0zOTcgMTkgbC0zNjMgMCAwIDM2MyBjMAozMzQgLTEgMzY1IC0xOSAzOTcgLTEwIDE5IC0zMCA0MyAtNDQgNTQgLTMzIDI0IC0xMTIgMzEgLTE1MyAxMnoiLz4KPHBhdGggZD0iTTQ5MDQgMTEyNiBjLTE3IC03IC00MiAtMjkgLTU1IC00NyBsLTI0IC0zNCAtMyAtMzcyIC0zIC0zNzMgLTM2MiAwCmMtMzM0IDAgLTM2NSAtMSAtMzk3IC0xOSAtNTUgLTI5IC03NSAtNjQgLTc1IC0xMzEgMCAtNjcgMjAgLTEwMiA3NSAtMTMxIDMyCi0xOCA2NiAtMTkgNDg4IC0xOSA0MzQgMCA0NTQgMSA0OTIgMjAgMjYgMTMgNDcgMzQgNjAgNjAgMTkgMzggMjAgNTggMjAgNDkyCjAgNDIyIC0xIDQ1NiAtMTkgNDg4IC0xMCAxOSAtMzAgNDMgLTQ0IDU0IC0zMyAyNCAtMTEyIDMxIC0xNTMgMTJ6Ii8+CjwvZz4KPC9zdmc+Cg=="
        const bucket_base64 ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTE3MDUgNDQ4MCBsLTE1MCAtMTUwIDI0NSAtMjQ1IDI0NSAtMjQ1IC02MjIgLTYyMiBjLTM5NCAtMzk2IC02MjgKLTYzOCAtNjQxIC02NjMgLTcwIC0xNDEgLTY4IC0yOTUgNSAtNDI1IDMwIC01MiAxMjE2IC0xMjQ3IDEzMDYgLTEzMTYgMTI5Ci05NyAzMDUgLTExMSA0NTcgLTM1IDMyIDE3IDI2NyAyNDUgODE4IDc5NSBsNzcyIDc3MSAtMTE0MyAxMTQzIC0xMTQyIDExNDIKLTE1MCAtMTUweiBtMTIzNSAtMTUzNSBsNTk1IC01OTUgLTExOTAgMCAtMTE5MCAwIDU5NSA1OTUgYzMyNyAzMjcgNTk1IDU5NQo1OTUgNTk1IDAgMCAyNjggLTI2OCA1OTUgLTU5NXoiLz4KPHBhdGggZD0iTTQyMDkgMjA3MyBjLTEzMyAtMTQ1IC0yNjQgLTM0NiAtMzI5IC01MDIgLTMzIC04MiAtMzUgLTkxIC0zNCAtMjAxCjAgLTk3IDUgLTEyNiAyNiAtMTg4IDY0IC0xODAgMTkwIC0yOTQgMzU2IC0zMjMgMTkxIC0zNCAzOTAgMTMyIDQ0NyAzNzIgNDgKMjA1IC02IDM4NiAtMTkyIDY0NiAtNjMgODggLTIwMiAyNTMgLTIxNCAyNTMgLTQgMCAtMzEgLTI2IC02MCAtNTd6Ii8+CjwvZz4KPC9zdmc+Cg=="
        const square_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPgo8cGF0aCBkPSJNMCAwIEMwLjgzODAyODI0IC0wLjAwNDY1OTkyIDEuNjc2MDU2NDkgLTAuMDA5MzE5ODQgMi41Mzk0Nzk1MiAtMC4wMTQxMjA5NyBDNS4zNjAzNDAwOCAtMC4wMjYxMTQ5MiA4LjE4MDcyMjkgLTAuMDE2NjU4NTkgMTEuMDAxNTg3ODcgLTAuMDA3MzYzMzIgQzEzLjAzOTI4MTM2IC0wLjAxMTUzNDMxIDE1LjA3Njk3MjUzIC0wLjAxNzAxMDUyIDE3LjExNDY1OTM3IC0wLjAyMzY4MzEzIEMyMi43MjQyMDI0MiAtMC4wMzgxODcyNiAyOC4zMzM1OTkxNyAtMC4wMzM4Nzc1MiAzMy45NDMxNTA0IC0wLjAyNjUxNjMyIEMzOS45ODg5MTkzOCAtMC4wMjE3OTkyMyA0Ni4wMzQ2NTYwNCAtMC4wMzQyODE1MyA1Mi4wODA0MTQ3NyAtMC4wNDQ1MzM3MyBDNjMuMjQzMDk2ODUgLTAuMDYwNzU5NTcgNzQuNDA1NzMzNCAtMC4wNjMxNjExMSA4NS41Njg0MjEwNCAtMC4wNTgyMjg3NCBDOTUuODgwNjg4NzIgLTAuMDUzNjc0MyAxMDYuMTkyOTM4OTkgLTAuMDU0MjY3MzIgMTE2LjUwNTIwNjExIC0wLjA2MDA2OTA4IEMxMTcuODg3NjQ5MiAtMC4wNjA4MjU5NCAxMTkuMjcwMDkyMyAtMC4wNjE1ODE5MiAxMjAuNjUyNTM1NCAtMC4wNjIzMzcwMyBDMTIyLjczNTY2NjU5IC0wLjA2MzQ4MjIgMTI0LjgxODc5Nzc3IC0wLjA2NDYzMjA4IDEyNi45MDE5Mjg5NSAtMC4wNjU3OTYyNyBDMTQ2LjI3Mjk5NzAxIC0wLjA3NjUwMzc5IDE2NS42NDQwNTkyNSAtMC4wODEyMjM5MyAxODUuMDE1MTI5MDkgLTAuMDczMzI2MTEgQzE4NS43NDU1ODA2NyAtMC4wNzMwMjg5NCAxODYuNDc2MDMyMjUgLTAuMDcyNzMxNzYgMTg3LjIyODYxODcyIC0wLjA3MjQyNTU5IEMxOTMuMTYwNjc1MiAtMC4wNjk5NzY1NyAxOTkuMDkyNzMxNiAtMC4wNjczNjUwMiAyMDUuMDI0Nzg4IC0wLjA2NDc0MTQ1IEMyMjguMTY2MjE2NSAtMC4wNTQ2MzgxMiAyNTEuMzA3NTcyNDQgLTAuMDYyOTk1MDIgMjc0LjQ0ODk5MDgyIC0wLjA4NjIzNiBDMzAwLjQ0MDM2NDA5IC0wLjExMjI5Njg3IDMyNi40MzE2OTM2OCAtMC4xMjUxNTk3IDM1Mi40MjMwODA1IC0wLjExODA0ODI1IEMzNTUuMTkzNDA2MTQgLTAuMTE3MzMyMTcgMzU3Ljk2MzczMTc4IC0wLjExNjY1Nzc5IDM2MC43MzQwNTc0MyAtMC4xMTYwMDc4IEMzNjEuNDE2MTk2NzIgLTAuMTE1ODM4IDM2Mi4wOTgzMzYwMiAtMC4xMTU2NjgxOSAzNjIuODAxMTQ2MjEgLTAuMTE1NDkzMjMgQzM3My4xMDY4NDcyNCAtMC4xMTMxODg0MSAzODMuNDEyNTA3NzggLTAuMTIxMTc1OTUgMzkzLjcxODE5OTczIC0wLjEzNDI5OTI4IEM0MDUuNDM1ODE2MjMgLTAuMTQ5MTkzODIgNDE3LjE1MzM1Mzk3IC0wLjE0OTcwMDc5IDQyOC44NzA5NzQyNCAtMC4xMzIyMjgzNyBDNDM0Ljg1MjQyNzk4IC0wLjEyMzY4ODM1IDQ0MC44MzM3MDAwNSAtMC4xMjE2NDE5IDQ0Ni44MTUxNDQ1NCAtMC4xMzY4Nzk5MiBDNDUyLjI4NzA3OTA2IC0wLjE1MDY0NzY4IDQ1Ny43NTg2NzQ5MiAtMC4xNDYwNjYyNCA0NjMuMjMwNTg5NDYgLTAuMTI2NjQwNjggQzQ2NS4yMTM3MDg5MyAtMC4xMjI4NTU5NiA0NjcuMTk2ODU1MDIgLTAuMTI1ODczMTQgNDY5LjE3OTk1MDk1IC0wLjEzNjI1MjM0IEM0NzEuODY5NDU4ODggLTAuMTQ5MzMxNTUgNDc0LjU1Nzc4MjE1IC0wLjEzNzkyMDMxIDQ3Ny4yNDcyMzgxNiAtMC4xMjAyNTQ1MiBDNDc4LjAyMjU5MzQ5IC0wLjEyOTkwNTAzIDQ3OC43OTc5NDg4MiAtMC4xMzk1NTU1NCA0NzkuNTk2Nzk5NzYgLTAuMTQ5NDk4NDkgQzQ4NC43Nzc3OTUyOSAtMC4wNzkzMTI5OSA0ODcuNzU4MjQ1MzIgMS4wMTE0NjkzMyA0OTEuNjg2NTM5NjUgNC4zODAzMTY3MyBDNDk0LjM5OTEyNDY1IDcuOTA4ODEyMjMgNDk1LjA2MjA0MjE1IDEwLjQ0MTgyMDYyIDQ5NS4wNjY4NTYzOCAxNC44NTE0MTU2MyBDNDk1LjA3NTI5NjMzIDE1Ljk0NDQ5MDEgNDk1LjA4MzczNjI3IDE3LjAzNzU2NDU3IDQ5NS4wOTI0MzE5NiAxOC4xNjM3NjI1MSBDNDk1LjA4NjQyMTkyIDE5LjM1OTA4MTQ1IDQ5NS4wODA0MTE4NyAyMC41NTQ0MDA0IDQ5NS4wNzQyMTk3IDIxLjc4NTk0MTEyIEM0OTUuMDgyMjk4MDEgMjMuNjk3MTAxNzIgNDk1LjA4MjI5ODAxIDIzLjY5NzEwMTcyIDQ5NS4wOTA1Mzk1MiAyNS42NDY4NzE2MyBDNDk1LjEwNTAxMDAxIDI5LjE4MTM1NTU0IDQ5NS4xMDA3NDQ0OSAzMi43MTU2MDY2IDQ5NS4wOTMzNzI3IDM2LjI1MDEwMzM1IEM0OTUuMDg4NjQ3MjggNDAuMDYyNzMwODEgNDk1LjEwMTE0NTMyIDQzLjg3NTMwNzQ0IDQ5NS4xMTEzOTAxMSA0Ny42ODc5MTg2NiBDNDk1LjEyODU5NTY5IDU1LjE1NjI5NzY3IDQ5NS4xMjk0MTQ1IDYyLjYyNDU5MjYgNDk1LjEyNDE3NzIxIDcwLjA5Mjk4NjI4IEM0OTUuMTIwMTM3NTkgNzYuMTYyNjE4ODYgNDk1LjEyMTU3NjU5IDgyLjIzMjIyNjU2IDQ5NS4xMjY5MjU0NyA4OC4zMDE4NTc5NSBDNDk1LjEyNzY3Mzg5IDg5LjE2NTM2MDg3IDQ5NS4xMjg0MjIzMSA5MC4wMjg4NjM3OSA0OTUuMTI5MTkzNDEgOTAuOTE4NTMzNDYgQzQ5NS4xMzA3MjQ4NyA5Mi42NzI2NzU0MSA0OTUuMTMyMjYzMjIgOTQuNDI2ODE3MzUgNDk1LjEzMzgwODM4IDk2LjE4MDk1OTI5IEM0OTUuMTQ3NTM5NzYgMTEyLjYzNDk0MTgyIDQ5NS4xNDIwOTEyMyAxMjkuMDg4ODc2ODEgNDk1LjEzMDYyMzE3IDE0NS41NDI4NTgyNSBDNDk1LjEyMDY4OTg0IDE2MC41OTkwNzQzOCA0OTUuMTMzNjMyMDQgMTc1LjY1NTE2NzYzIDQ5NS4xNTc1NTczNiAxOTAuNzExMzY0OCBDNDk1LjE4MTkzMzkzIDIwNi4xNjc4NzQ0OCA0OTUuMTkxNTU5OCAyMjEuNjI0MzI2OSA0OTUuMTg0OTA0NjMgMjM3LjA4MDg1NTQzIEM0OTUuMTgxNDA5MjQgMjQ1Ljc1OTgxODIyIDQ5NS4xODM2NjU1OSAyNTQuNDM4Njg2NSA0OTUuMjAxMTU1NjYgMjYzLjExNzYzNDc3IEM0OTUuMjE1ODU5NjIgMjcwLjUwNTc2MTA1IDQ5NS4yMTY1MzY4MSAyNzcuODkzNzI2MjYgNDk1LjE5OTA4NDc1IDI4NS4yODE4NDkzMiBDNDk1LjE5MDU1NzQzIDI4OS4wNTE3NDkzNSA0OTUuMTg4NDY3MDkgMjkyLjgyMTM2MTQxIDQ5NS4yMDM3MzYzMSAyOTYuNTkxMjQ2NiBDNDk1LjIyMDA3OTk4IDMwMC42NzY5Njg2OCA0OTUuMjA1NDcwNyAzMDQuNzYxOTkyNTkgNDk1LjE4Nzc0NTA5IDMwOC44NDc3MDg3IEM0OTUuMTk3MzUwMSAzMTAuMDQwNzk2OTIgNDk1LjIwNjk1NTExIDMxMS4yMzM4ODUxNCA0OTUuMjE2ODUxMTcgMzEyLjQ2MzEyNzU1IEM0OTUuMTYyMzg3NCAzMTguNTQzNTQ2MTggNDk1LjA4MDkyNDkzIDMyMi43NDg5MTYwOCA0OTAuNjg2NTM5NjUgMzI3LjM4MDMxNjczIEM0ODYuNDE0NDkzMjIgMzMwLjY1MzI4NjEyIDQ4Mi41NjgyNzEwOSAzMzAuODA1NjQyNTMgNDc3LjM3MzA3OTMgMzMwLjc2MDYzMzQ3IEM0NzYuNTM1MDUxMDYgMzMwLjc2NTI5MzM5IDQ3NS42OTcwMjI4MSAzMzAuNzY5OTUzMzEgNDc0LjgzMzU5OTc4IDMzMC43NzQ3NTQ0MyBDNDcyLjAxMjczOTIyIDMzMC43ODY3NDgzOSA0NjkuMTkyMzU2NCAzMzAuNzc3MjkyMDYgNDY2LjM3MTQ5MTQzIDMzMC43Njc5OTY3OSBDNDY0LjMzMzc5Nzk0IDMzMC43NzIxNjc3NyA0NjIuMjk2MTA2NzcgMzMwLjc3NzY0Mzk5IDQ2MC4yNTg0MTk5MyAzMzAuNzg0MzE2NiBDNDU0LjY0ODg3Njg4IDMzMC43OTg4MjA3MyA0NDkuMDM5NDgwMTMgMzMwLjc5NDUxMDk5IDQ0My40Mjk5Mjg5IDMzMC43ODcxNDk3OSBDNDM3LjM4NDE1OTkyIDMzMC43ODI0MzI2OSA0MzEuMzM4NDIzMjYgMzMwLjc5NDkxNSA0MjUuMjkyNjY0NTMgMzMwLjgwNTE2NzIgQzQxNC4xMjk5ODI0NSAzMzAuODIxMzkzMDQgNDAyLjk2NzM0NTkgMzMwLjgyMzc5NDU4IDM5MS44MDQ2NTgyNiAzMzAuODE4ODYyMjEgQzM4MS40OTIzOTA1OCAzMzAuODE0MzA3NzcgMzcxLjE4MDE0MDMxIDMzMC44MTQ5MDA3OSAzNjAuODY3ODczMTkgMzMwLjgyMDcwMjU1IEMzNTkuNDg1NDMwMSAzMzAuODIxNDU5NDEgMzU4LjEwMjk4NyAzMzAuODIyMjE1MzkgMzU2LjcyMDU0MzkgMzMwLjgyMjk3MDUgQzM1NC42Mzc0MTI3MSAzMzAuODI0MTE1NjcgMzUyLjU1NDI4MTUzIDMzMC44MjUyNjU1NSAzNTAuNDcxMTUwMzUgMzMwLjgyNjQyOTc0IEMzMzEuMTAwMDgyMjkgMzMwLjgzNzEzNzI1IDMxMS43MjkwMjAwNSAzMzAuODQxODU3NCAyOTIuMzU3OTUwMjEgMzMwLjgzMzk1OTU4IEMyOTEuNjI3NDk4NjMgMzMwLjgzMzY2MjQxIDI5MC44OTcwNDcwNSAzMzAuODMzMzY1MjMgMjkwLjE0NDQ2MDU4IDMzMC44MzMwNTkwNSBDMjg0LjIxMjQwNDEgMzMwLjgzMDYxMDAzIDI3OC4yODAzNDc3IDMzMC44Mjc5OTg0OSAyNzIuMzQ4MjkxMyAzMzAuODI1Mzc0OTIgQzI0OS4yMDY4NjI4IDMzMC44MTUyNzE1OSAyMjYuMDY1NTA2ODYgMzMwLjgyMzYyODQ5IDIwMi45MjQwODg0OCAzMzAuODQ2ODY5NDcgQzE3Ni45MzI3MTUyMSAzMzAuODcyOTMwMzQgMTUwLjk0MTM4NTYyIDMzMC44ODU3OTMxNyAxMjQuOTQ5OTk4OCAzMzAuODc4NjgxNzIgQzEyMi4xNzk2NzMxNiAzMzAuODc3OTY1NjQgMTE5LjQwOTM0NzUyIDMzMC44NzcyOTEyNiAxMTYuNjM5MDIxODcgMzMwLjg3NjY0MTI3IEMxMTUuOTU2ODgyNTggMzMwLjg3NjQ3MTQ2IDExNS4yNzQ3NDMyOCAzMzAuODc2MzAxNjYgMTE0LjU3MTkzMzA5IDMzMC44NzYxMjY3IEMxMDQuMjY2MjMyMDYgMzMwLjg3MzgyMTg4IDkzLjk2MDU3MTUyIDMzMC44ODE4MDk0MiA4My42NTQ4Nzk1NyAzMzAuODk0OTMyNzUgQzcxLjkzNzI2MzA3IDMzMC45MDk4MjcyOSA2MC4yMTk3MjUzMiAzMzAuOTEwMzM0MjYgNDguNTAyMTA1MDYgMzMwLjg5Mjg2MTg0IEM0Mi41MjA2NTEzMiAzMzAuODg0MzIxODIgMzYuNTM5Mzc5MjUgMzMwLjg4MjI3NTM3IDMwLjU1NzkzNDc2IDMzMC44OTc1MTMzOSBDMjUuMDg2MDAwMjQgMzMwLjkxMTI4MTE1IDE5LjYxNDQwNDM4IDMzMC45MDY2OTk3MSAxNC4xNDI0ODk4NCAzMzAuODg3Mjc0MTUgQzEyLjE1OTM3MDM3IDMzMC44ODM0ODk0MyAxMC4xNzYyMjQyOCAzMzAuODg2NTA2NjEgOC4xOTMxMjgzNSAzMzAuODk2ODg1OCBDNS41MDM2MjA0MiAzMzAuOTA5OTY1MDEgMi44MTUyOTcxNSAzMzAuODk4NTUzNzggMC4xMjU4NDExNCAzMzAuODgwODg3OTkgQy0wLjY0OTUxNDE5IDMzMC44OTA1Mzg1IC0xLjQyNDg2OTUyIDMzMC45MDAxODkwMSAtMi4yMjM3MjA0NiAzMzAuOTEwMTMxOTYgQy03LjQwNDcxNTk5IDMzMC44Mzk5NDY0NiAtMTAuMzg1MTY2MDIgMzI5Ljc0OTE2NDE0IC0xNC4zMTM0NjAzNSAzMjYuMzgwMzE2NzMgQy0xNy4wMjYwNDUzNSAzMjIuODUxODIxMjMgLTE3LjY4ODk2Mjg1IDMyMC4zMTg4MTI4NSAtMTcuNjkzNzc3MDggMzE1LjkwOTIxNzgzIEMtMTcuNzA2NDM3IDMxNC4yNjk2MDYxMyAtMTcuNzA2NDM3IDMxNC4yNjk2MDYxMyAtMTcuNzE5MzUyNjYgMzEyLjU5Njg3MDk2IEMtMTcuNzEzMzQyNjIgMzExLjQwMTU1MjAyIC0xNy43MDczMzI1NyAzMTAuMjA2MjMzMDcgLTE3LjcwMTE0MDQgMzA4Ljk3NDY5MjM0IEMtMTcuNzA2NTI1OTQgMzA3LjcwMDU4NTI4IC0xNy43MTE5MTE0OCAzMDYuNDI2NDc4MjEgLTE3LjcxNzQ2MDIyIDMwNS4xMTM3NjE4NCBDLTE3LjczMTkzMDcxIDMwMS41NzkyNzc5MiAtMTcuNzI3NjY1MTkgMjk4LjA0NTAyNjg3IC0xNy43MjAyOTM0IDI5NC41MTA1MzAxMSBDLTE3LjcxNTU2Nzk4IDI5MC42OTc5MDI2NiAtMTcuNzI4MDY2MDIgMjg2Ljg4NTMyNjAzIC0xNy43MzgzMTA4MSAyODMuMDcyNzE0ODEgQy0xNy43NTU1MTYzOSAyNzUuNjA0MzM1OCAtMTcuNzU2MzM1MiAyNjguMTM2MDQwODcgLTE3Ljc1MTA5NzkxIDI2MC42Njc2NDcxOSBDLTE3Ljc0NzA1ODI5IDI1NC41OTgwMTQ2MSAtMTcuNzQ4NDk3MjkgMjQ4LjUyODQwNjkxIC0xNy43NTM4NDYxNyAyNDIuNDU4Nzc1NTIgQy0xNy43NTQ1OTQ1OSAyNDEuNTk1MjcyNiAtMTcuNzU1MzQzMDEgMjQwLjczMTc2OTY4IC0xNy43NTYxMTQxMSAyMzkuODQyMTAwMDEgQy0xNy43NTc2NDU1NyAyMzguMDg3OTU4MDYgLTE3Ljc1OTE4MzkyIDIzNi4zMzM4MTYxMSAtMTcuNzYwNzI5MDggMjM0LjU3OTY3NDE4IEMtMTcuNzc0NDYwNDYgMjE4LjEyNTY5MTY1IC0xNy43NjkwMTE5MyAyMDEuNjcxNzU2NjYgLTE3Ljc1NzU0Mzg3IDE4NS4yMTc3NzUyMiBDLTE3Ljc0NzYxMDU0IDE3MC4xNjE1NTkwOSAtMTcuNzYwNTUyNzQgMTU1LjEwNTQ2NTg0IC0xNy43ODQ0NzgwNiAxNDAuMDQ5MjY4NjcgQy0xNy44MDg4NTQ2MyAxMjQuNTkyNzU4OTkgLTE3LjgxODQ4MDUgMTA5LjEzNjMwNjU3IC0xNy44MTE4MjUzNCA5My42Nzk3NzgwNCBDLTE3LjgwODMyOTk0IDg1LjAwMDgxNTI1IC0xNy44MTA1ODYyOSA3Ni4zMjE5NDY5NyAtMTcuODI4MDc2MzYgNjcuNjQyOTk4NyBDLTE3Ljg0Mjc4MDMyIDYwLjI1NDg3MjQxIC0xNy44NDM0NTc1MSA1Mi44NjY5MDcyMSAtMTcuODI2MDA1NDUgNDUuNDc4Nzg0MTUgQy0xNy44MTc0NzgxMyA0MS43MDg4ODQxMiAtMTcuODE1Mzg3NzkgMzcuOTM5MjcyMDYgLTE3LjgzMDY1NzAxIDM0LjE2OTM4Njg2IEMtMTcuODQ3MDAwNjggMzAuMDgzNjY0NzggLTE3LjgzMjM5MTQgMjUuOTk4NjQwODggLTE3LjgxNDY2NTc5IDIxLjkxMjkyNDc3IEMtMTcuODI0MjcwOCAyMC43MTk4MzY1NSAtMTcuODMzODc1ODEgMTkuNTI2NzQ4MzIgLTE3Ljg0Mzc3MTg3IDE4LjI5NzUwNTkyIEMtMTcuNzg5MzA4MSAxMi4yMTcwODcyOSAtMTcuNzA3ODQ1NjMgOC4wMTE3MTczOSAtMTMuMzEzNDYwMzUgMy4zODAzMTY3MyBDLTkuMDQxNDEzOTIgMC4xMDczNDczNSAtNS4xOTUxOTE3OSAtMC4wNDUwMDkwNiAwIDAgWiAiIGZpbGw9IiMwMDAwMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3LjMxMzQ2MDM1MDAzNjYyLDkwLjYxOTY4MzI2NTY4NjA0KSIvPgo8L3N2Zz4K"
        const circle_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTIzMjEgNTExMCBjLTQ5NyAtNDggLTk5MCAtMjUxIC0xMzc2IC01NjUgLTExNCAtOTIgLTI5NCAtMjc0IC0zODQKLTM4NyAtMjI5IC0yODcgLTQxNyAtNjc1IC00OTUgLTEwMjMgLTQ5IC0yMTggLTYwIC0zMjUgLTYwIC01NzUgMCAtMjUwIDExCi0zNTcgNjAgLTU3NSA3OSAtMzU1IDI3MiAtNzQ5IDUwOSAtMTA0MCA5MiAtMTE0IDI3NCAtMjk0IDM4NyAtMzg0IDI4NyAtMjI5CjY3NSAtNDE3IDEwMjMgLTQ5NSAyMTggLTQ5IDMyNSAtNjAgNTc1IC02MCAyNTAgMCAzNTcgMTEgNTc1IDYwIDI2MSA1OCA2MDMKMjA0IDgyOCAzNTMgMzg5IDI1OSA2ODggNTk5IDg5MyAxMDE2IDEyNSAyNTUgMTk2IDQ4NCAyNDEgNzc1IDI0IDE2MSAyNCA1MzkKMCA3MDAgLTQ1IDI5MSAtMTE2IDUyMCAtMjQxIDc3NSAtMTM0IDI3MiAtMjgzIDQ4MCAtNDk4IDY5MiAtMjExIDIwOSAtNDA0CjM0NiAtNjczIDQ3OCAtMjUyIDEyNCAtNDg2IDE5NyAtNzY1IDI0MCAtMTI2IDE5IC00NjggMjcgLTU5OSAxNXoiLz4KPC9nPgo8L3N2Zz4K"
        const hollow_square_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPgo8cGF0aCBkPSJNMCAwIEMwLjgzODAyODI0IC0wLjAwNDY1OTkyIDEuNjc2MDU2NDkgLTAuMDA5MzE5ODQgMi41Mzk0Nzk1MiAtMC4wMTQxMjA5NyBDNS4zNjAzNDAwOCAtMC4wMjYxMTQ5MiA4LjE4MDcyMjkgLTAuMDE2NjU4NTkgMTEuMDAxNTg3ODcgLTAuMDA3MzYzMzIgQzEzLjAzOTI4MTM2IC0wLjAxMTUzNDMxIDE1LjA3Njk3MjUzIC0wLjAxNzAxMDUyIDE3LjExNDY1OTM3IC0wLjAyMzY4MzEzIEMyMi43MjQyMDI0MiAtMC4wMzgxODcyNiAyOC4zMzM1OTkxNyAtMC4wMzM4Nzc1MiAzMy45NDMxNTA0IC0wLjAyNjUxNjMyIEMzOS45ODg5MTkzOCAtMC4wMjE3OTkyMyA0Ni4wMzQ2NTYwNCAtMC4wMzQyODE1MyA1Mi4wODA0MTQ3NyAtMC4wNDQ1MzM3MyBDNjMuMjQzMDk2ODUgLTAuMDYwNzU5NTcgNzQuNDA1NzMzNCAtMC4wNjMxNjExMSA4NS41Njg0MjEwNCAtMC4wNTgyMjg3NCBDOTUuODgwNjg4NzIgLTAuMDUzNjc0MyAxMDYuMTkyOTM4OTkgLTAuMDU0MjY3MzIgMTE2LjUwNTIwNjExIC0wLjA2MDA2OTA4IEMxMTcuODg3NjQ5MiAtMC4wNjA4MjU5NCAxMTkuMjcwMDkyMyAtMC4wNjE1ODE5MiAxMjAuNjUyNTM1NCAtMC4wNjIzMzcwMyBDMTIyLjczNTY2NjU5IC0wLjA2MzQ4MjIgMTI0LjgxODc5Nzc3IC0wLjA2NDYzMjA4IDEyNi45MDE5Mjg5NSAtMC4wNjU3OTYyNyBDMTQ2LjI3Mjk5NzAxIC0wLjA3NjUwMzc5IDE2NS42NDQwNTkyNSAtMC4wODEyMjM5MyAxODUuMDE1MTI5MDkgLTAuMDczMzI2MTEgQzE4NS43NDU1ODA2NyAtMC4wNzMwMjg5NCAxODYuNDc2MDMyMjUgLTAuMDcyNzMxNzYgMTg3LjIyODYxODcyIC0wLjA3MjQyNTU5IEMxOTMuMTYwNjc1MiAtMC4wNjk5NzY1NyAxOTkuMDkyNzMxNiAtMC4wNjczNjUwMiAyMDUuMDI0Nzg4IC0wLjA2NDc0MTQ1IEMyMjguMTY2MjE2NSAtMC4wNTQ2MzgxMiAyNTEuMzA3NTcyNDQgLTAuMDYyOTk1MDIgMjc0LjQ0ODk5MDgyIC0wLjA4NjIzNiBDMzAwLjQ0MDM2NDA5IC0wLjExMjI5Njg3IDMyNi40MzE2OTM2OCAtMC4xMjUxNTk3IDM1Mi40MjMwODA1IC0wLjExODA0ODI1IEMzNTUuMTkzNDA2MTQgLTAuMTE3MzMyMTcgMzU3Ljk2MzczMTc4IC0wLjExNjY1Nzc5IDM2MC43MzQwNTc0MyAtMC4xMTYwMDc4IEMzNjEuNDE2MTk2NzIgLTAuMTE1ODM4IDM2Mi4wOTgzMzYwMiAtMC4xMTU2NjgxOSAzNjIuODAxMTQ2MjEgLTAuMTE1NDkzMjMgQzM3My4xMDY4NDcyNCAtMC4xMTMxODg0MSAzODMuNDEyNTA3NzggLTAuMTIxMTc1OTUgMzkzLjcxODE5OTczIC0wLjEzNDI5OTI4IEM0MDUuNDM1ODE2MjMgLTAuMTQ5MTkzODIgNDE3LjE1MzM1Mzk3IC0wLjE0OTcwMDc5IDQyOC44NzA5NzQyNCAtMC4xMzIyMjgzNyBDNDM0Ljg1MjQyNzk4IC0wLjEyMzY4ODM1IDQ0MC44MzM3MDAwNSAtMC4xMjE2NDE5IDQ0Ni44MTUxNDQ1NCAtMC4xMzY4Nzk5MiBDNDUyLjI4NzA3OTA2IC0wLjE1MDY0NzY4IDQ1Ny43NTg2NzQ5MiAtMC4xNDYwNjYyNCA0NjMuMjMwNTg5NDYgLTAuMTI2NjQwNjggQzQ2NS4yMTM3MDg5MyAtMC4xMjI4NTU5NiA0NjcuMTk2ODU1MDIgLTAuMTI1ODczMTQgNDY5LjE3OTk1MDk1IC0wLjEzNjI1MjM0IEM0NzEuODY5NDU4ODggLTAuMTQ5MzMxNTUgNDc0LjU1Nzc4MjE1IC0wLjEzNzkyMDMxIDQ3Ny4yNDcyMzgxNiAtMC4xMjAyNTQ1MiBDNDc4LjAyMjU5MzQ5IC0wLjEyOTkwNTAzIDQ3OC43OTc5NDg4MiAtMC4xMzk1NTU1NCA0NzkuNTk2Nzk5NzYgLTAuMTQ5NDk4NDkgQzQ4NC43Nzc3OTUyOSAtMC4wNzkzMTI5OSA0ODcuNzU4MjQ1MzIgMS4wMTE0NjkzMyA0OTEuNjg2NTM5NjUgNC4zODAzMTY3MyBDNDk0LjM5OTEyNDY1IDcuOTA4ODEyMjMgNDk1LjA2MjA0MjE1IDEwLjQ0MTgyMDYyIDQ5NS4wNjY4NTYzOCAxNC44NTE0MTU2MyBDNDk1LjA3NTI5NjMzIDE1Ljk0NDQ5MDEgNDk1LjA4MzczNjI3IDE3LjAzNzU2NDU3IDQ5NS4wOTI0MzE5NiAxOC4xNjM3NjI1MSBDNDk1LjA4NjQyMTkyIDE5LjM1OTA4MTQ1IDQ5NS4wODA0MTE4NyAyMC41NTQ0MDA0IDQ5NS4wNzQyMTk3IDIxLjc4NTk0MTEyIEM0OTUuMDgyMjk4MDEgMjMuNjk3MTAxNzIgNDk1LjA4MjI5ODAxIDIzLjY5NzEwMTcyIDQ5NS4wOTA1Mzk1MiAyNS42NDY4NzE2MyBDNDk1LjEwNTAxMDAxIDI5LjE4MTM1NTU0IDQ5NS4xMDA3NDQ0OSAzMi43MTU2MDY2IDQ5NS4wOTMzNzI3IDM2LjI1MDEwMzM1IEM0OTUuMDg4NjQ3MjggNDAuMDYyNzMwODEgNDk1LjEwMTE0NTMyIDQzLjg3NTMwNzQ0IDQ5NS4xMTEzOTAxMSA0Ny42ODc5MTg2NiBDNDk1LjEyODU5NTY5IDU1LjE1NjI5NzY3IDQ5NS4xMjk0MTQ1IDYyLjYyNDU5MjYgNDk1LjEyNDE3NzIxIDcwLjA5Mjk4NjI4IEM0OTUuMTIwMTM3NTkgNzYuMTYyNjE4ODYgNDk1LjEyMTU3NjU5IDgyLjIzMjIyNjU2IDQ5NS4xMjY5MjU0NyA4OC4zMDE4NTc5NSBDNDk1LjEyNzY3Mzg5IDg5LjE2NTM2MDg3IDQ5NS4xMjg0MjIzMSA5MC4wMjg4NjM3OSA0OTUuMTI5MTkzNDEgOTAuOTE4NTMzNDYgQzQ5NS4xMzA3MjQ4NyA5Mi42NzI2NzU0MSA0OTUuMTMyMjYzMjIgOTQuNDI2ODE3MzUgNDk1LjEzMzgwODM4IDk2LjE4MDk1OTI5IEM0OTUuMTQ3NTM5NzYgMTEyLjYzNDk0MTgyIDQ5NS4xNDIwOTEyMyAxMjkuMDg4ODc2ODEgNDk1LjEzMDYyMzE3IDE0NS41NDI4NTgyNSBDNDk1LjEyMDY4OTg0IDE2MC41OTkwNzQzOCA0OTUuMTMzNjMyMDQgMTc1LjY1NTE2NzYzIDQ5NS4xNTc1NTczNiAxOTAuNzExMzY0OCBDNDk1LjE4MTkzMzkzIDIwNi4xNjc4NzQ0OCA0OTUuMTkxNTU5OCAyMjEuNjI0MzI2OSA0OTUuMTg0OTA0NjMgMjM3LjA4MDg1NTQzIEM0OTUuMTgxNDA5MjQgMjQ1Ljc1OTgxODIyIDQ5NS4xODM2NjU1OSAyNTQuNDM4Njg2NSA0OTUuMjAxMTU1NjYgMjYzLjExNzYzNDc3IEM0OTUuMjE1ODU5NjIgMjcwLjUwNTc2MTA1IDQ5NS4yMTY1MzY4MSAyNzcuODkzNzI2MjYgNDk1LjE5OTA4NDc1IDI4NS4yODE4NDkzMiBDNDk1LjE5MDU1NzQzIDI4OS4wNTE3NDkzNSA0OTUuMTg4NDY3MDkgMjkyLjgyMTM2MTQxIDQ5NS4yMDM3MzYzMSAyOTYuNTkxMjQ2NiBDNDk1LjIyMDA3OTk4IDMwMC42NzY5Njg2OCA0OTUuMjA1NDcwNyAzMDQuNzYxOTkyNTkgNDk1LjE4Nzc0NTA5IDMwOC44NDc3MDg3IEM0OTUuMTk3MzUwMSAzMTAuMDQwNzk2OTIgNDk1LjIwNjk1NTExIDMxMS4yMzM4ODUxNCA0OTUuMjE2ODUxMTcgMzEyLjQ2MzEyNzU1IEM0OTUuMTYyMzg3NCAzMTguNTQzNTQ2MTggNDk1LjA4MDkyNDkzIDMyMi43NDg5MTYwOCA0OTAuNjg2NTM5NjUgMzI3LjM4MDMxNjczIEM0ODYuNDE0NDkzMjIgMzMwLjY1MzI4NjEyIDQ4Mi41NjgyNzEwOSAzMzAuODA1NjQyNTMgNDc3LjM3MzA3OTMgMzMwLjc2MDYzMzQ3IEM0NzYuNTM1MDUxMDYgMzMwLjc2NTI5MzM5IDQ3NS42OTcwMjI4MSAzMzAuNzY5OTUzMzEgNDc0LjgzMzU5OTc4IDMzMC43NzQ3NTQ0MyBDNDcyLjAxMjczOTIyIDMzMC43ODY3NDgzOSA0NjkuMTkyMzU2NCAzMzAuNzc3MjkyMDYgNDY2LjM3MTQ5MTQzIDMzMC43Njc5OTY3OSBDNDY0LjMzMzc5Nzk0IDMzMC43NzIxNjc3NyA0NjIuMjk2MTA2NzcgMzMwLjc3NzY0Mzk5IDQ2MC4yNTg0MTk5MyAzMzAuNzg0MzE2NiBDNDU0LjY0ODg3Njg4IDMzMC43OTg4MjA3MyA0NDkuMDM5NDgwMTMgMzMwLjc5NDUxMDk5IDQ0My40Mjk5Mjg5IDMzMC43ODcxNDk3OSBDNDM3LjM4NDE1OTkyIDMzMC43ODI0MzI2OSA0MzEuMzM4NDIzMjYgMzMwLjc5NDkxNSA0MjUuMjkyNjY0NTMgMzMwLjgwNTE2NzIgQzQxNC4xMjk5ODI0NSAzMzAuODIxMzkzMDQgNDAyLjk2NzM0NTkgMzMwLjgyMzc5NDU4IDM5MS44MDQ2NTgyNiAzMzAuODE4ODYyMjEgQzM4MS40OTIzOTA1OCAzMzAuODE0MzA3NzcgMzcxLjE4MDE0MDMxIDMzMC44MTQ5MDA3OSAzNjAuODY3ODczMTkgMzMwLjgyMDcwMjU1IEMzNTkuNDg1NDMwMSAzMzAuODIxNDU5NDEgMzU4LjEwMjk4NyAzMzAuODIyMjE1MzkgMzU2LjcyMDU0MzkgMzMwLjgyMjk3MDUgQzM1NC42Mzc0MTI3MSAzMzAuODI0MTE1NjcgMzUyLjU1NDI4MTUzIDMzMC44MjUyNjU1NSAzNTAuNDcxMTUwMzUgMzMwLjgyNjQyOTc0IEMzMzEuMTAwMDgyMjkgMzMwLjgzNzEzNzI1IDMxMS43MjkwMjAwNSAzMzAuODQxODU3NCAyOTIuMzU3OTUwMjEgMzMwLjgzMzk1OTU4IEMyOTEuNjI3NDk4NjMgMzMwLjgzMzY2MjQxIDI5MC44OTcwNDcwNSAzMzAuODMzMzY1MjMgMjkwLjE0NDQ2MDU4IDMzMC44MzMwNTkwNSBDMjg0LjIxMjQwNDEgMzMwLjgzMDYxMDAzIDI3OC4yODAzNDc3IDMzMC44Mjc5OTg0OSAyNzIuMzQ4MjkxMyAzMzAuODI1Mzc0OTIgQzI0OS4yMDY4NjI4IDMzMC44MTUyNzE1OSAyMjYuMDY1NTA2ODYgMzMwLjgyMzYyODQ5IDIwMi45MjQwODg0OCAzMzAuODQ2ODY5NDcgQzE3Ni45MzI3MTUyMSAzMzAuODcyOTMwMzQgMTUwLjk0MTM4NTYyIDMzMC44ODU3OTMxNyAxMjQuOTQ5OTk4OCAzMzAuODc4NjgxNzIgQzEyMi4xNzk2NzMxNiAzMzAuODc3OTY1NjQgMTE5LjQwOTM0NzUyIDMzMC44NzcyOTEyNiAxMTYuNjM5MDIxODcgMzMwLjg3NjY0MTI3IEMxMTUuOTU2ODgyNTggMzMwLjg3NjQ3MTQ2IDExNS4yNzQ3NDMyOCAzMzAuODc2MzAxNjYgMTE0LjU3MTkzMzA5IDMzMC44NzYxMjY3IEMxMDQuMjY2MjMyMDYgMzMwLjg3MzgyMTg4IDkzLjk2MDU3MTUyIDMzMC44ODE4MDk0MiA4My42NTQ4Nzk1NyAzMzAuODk0OTMyNzUgQzcxLjkzNzI2MzA3IDMzMC45MDk4MjcyOSA2MC4yMTk3MjUzMiAzMzAuOTEwMzM0MjYgNDguNTAyMTA1MDYgMzMwLjg5Mjg2MTg0IEM0Mi41MjA2NTEzMiAzMzAuODg0MzIxODIgMzYuNTM5Mzc5MjUgMzMwLjg4MjI3NTM3IDMwLjU1NzkzNDc2IDMzMC44OTc1MTMzOSBDMjUuMDg2MDAwMjQgMzMwLjkxMTI4MTE1IDE5LjYxNDQwNDM4IDMzMC45MDY2OTk3MSAxNC4xNDI0ODk4NCAzMzAuODg3Mjc0MTUgQzEyLjE1OTM3MDM3IDMzMC44ODM0ODk0MyAxMC4xNzYyMjQyOCAzMzAuODg2NTA2NjEgOC4xOTMxMjgzNSAzMzAuODk2ODg1OCBDNS41MDM2MjA0MiAzMzAuOTA5OTY1MDEgMi44MTUyOTcxNSAzMzAuODk4NTUzNzggMC4xMjU4NDExNCAzMzAuODgwODg3OTkgQy0wLjY0OTUxNDE5IDMzMC44OTA1Mzg1IC0xLjQyNDg2OTUyIDMzMC45MDAxODkwMSAtMi4yMjM3MjA0NiAzMzAuOTEwMTMxOTYgQy03LjQwNDcxNTk5IDMzMC44Mzk5NDY0NiAtMTAuMzg1MTY2MDIgMzI5Ljc0OTE2NDE0IC0xNC4zMTM0NjAzNSAzMjYuMzgwMzE2NzMgQy0xNy4wMjYwNDUzNSAzMjIuODUxODIxMjMgLTE3LjY4ODk2Mjg1IDMyMC4zMTg4MTI4NSAtMTcuNjkzNzc3MDggMzE1LjkwOTIxNzgzIEMtMTcuNzA2NDM3IDMxNC4yNjk2MDYxMyAtMTcuNzA2NDM3IDMxNC4yNjk2MDYxMyAtMTcuNzE5MzUyNjYgMzEyLjU5Njg3MDk2IEMtMTcuNzEzMzQyNjIgMzExLjQwMTU1MjAyIC0xNy43MDczMzI1NyAzMTAuMjA2MjMzMDcgLTE3LjcwMTE0MDQgMzA4Ljk3NDY5MjM0IEMtMTcuNzA2NTI1OTQgMzA3LjcwMDU4NTI4IC0xNy43MTE5MTE0OCAzMDYuNDI2NDc4MjEgLTE3LjcxNzQ2MDIyIDMwNS4xMTM3NjE4NCBDLTE3LjczMTkzMDcxIDMwMS41NzkyNzc5MiAtMTcuNzI3NjY1MTkgMjk4LjA0NTAyNjg3IC0xNy43MjAyOTM0IDI5NC41MTA1MzAxMSBDLTE3LjcxNTU2Nzk4IDI5MC42OTc5MDI2NiAtMTcuNzI4MDY2MDIgMjg2Ljg4NTMyNjAzIC0xNy43MzgzMTA4MSAyODMuMDcyNzE0ODEgQy0xNy43NTU1MTYzOSAyNzUuNjA0MzM1OCAtMTcuNzU2MzM1MiAyNjguMTM2MDQwODcgLTE3Ljc1MTA5NzkxIDI2MC42Njc2NDcxOSBDLTE3Ljc0NzA1ODI5IDI1NC41OTgwMTQ2MSAtMTcuNzQ4NDk3MjkgMjQ4LjUyODQwNjkxIC0xNy43NTM4NDYxNyAyNDIuNDU4Nzc1NTIgQy0xNy43NTQ1OTQ1OSAyNDEuNTk1MjcyNiAtMTcuNzU1MzQzMDEgMjQwLjczMTc2OTY4IC0xNy43NTYxMTQxMSAyMzkuODQyMTAwMDEgQy0xNy43NTc2NDU1NyAyMzguMDg3OTU4MDYgLTE3Ljc1OTE4MzkyIDIzNi4zMzM4MTYxMSAtMTcuNzYwNzI5MDggMjM0LjU3OTY3NDE4IEMtMTcuNzc0NDYwNDYgMjE4LjEyNTY5MTY1IC0xNy43NjkwMTE5MyAyMDEuNjcxNzU2NjYgLTE3Ljc1NzU0Mzg3IDE4NS4yMTc3NzUyMiBDLTE3Ljc0NzYxMDU0IDE3MC4xNjE1NTkwOSAtMTcuNzYwNTUyNzQgMTU1LjEwNTQ2NTg0IC0xNy43ODQ0NzgwNiAxNDAuMDQ5MjY4NjcgQy0xNy44MDg4NTQ2MyAxMjQuNTkyNzU4OTkgLTE3LjgxODQ4MDUgMTA5LjEzNjMwNjU3IC0xNy44MTE4MjUzNCA5My42Nzk3NzgwNCBDLTE3LjgwODMyOTk0IDg1LjAwMDgxNTI1IC0xNy44MTA1ODYyOSA3Ni4zMjE5NDY5NyAtMTcuODI4MDc2MzYgNjcuNjQyOTk4NyBDLTE3Ljg0Mjc4MDMyIDYwLjI1NDg3MjQxIC0xNy44NDM0NTc1MSA1Mi44NjY5MDcyMSAtMTcuODI2MDA1NDUgNDUuNDc4Nzg0MTUgQy0xNy44MTc0NzgxMyA0MS43MDg4ODQxMiAtMTcuODE1Mzg3NzkgMzcuOTM5MjcyMDYgLTE3LjgzMDY1NzAxIDM0LjE2OTM4Njg2IEMtMTcuODQ3MDAwNjggMzAuMDgzNjY0NzggLTE3LjgzMjM5MTQgMjUuOTk4NjQwODggLTE3LjgxNDY2NTc5IDIxLjkxMjkyNDc3IEMtMTcuODI0MjcwOCAyMC43MTk4MzY1NSAtMTcuODMzODc1ODEgMTkuNTI2NzQ4MzIgLTE3Ljg0Mzc3MTg3IDE4LjI5NzUwNTkyIEMtMTcuNzg5MzA4MSAxMi4yMTcwODcyOSAtMTcuNzA3ODQ1NjMgOC4wMTE3MTczOSAtMTMuMzEzNDYwMzUgMy4zODAzMTY3MyBDLTkuMDQxNDEzOTIgMC4xMDczNDczNSAtNS4xOTUxOTE3OSAtMC4wNDUwMDkwNiAwIDAgWiBNMTIuNjg2NTM5NjUgMzAuMzgwMzE2NzMgQzEyLjY4NjUzOTY1IDExOS40ODAzMTY3MyAxMi42ODY1Mzk2NSAyMDguNTgwMzE2NzMgMTIuNjg2NTM5NjUgMzAwLjM4MDMxNjczIEMxNjEuODQ2NTM5NjUgMzAwLjM4MDMxNjczIDMxMS4wMDY1Mzk2NSAzMDAuMzgwMzE2NzMgNDY0LjY4NjUzOTY1IDMwMC4zODAzMTY3MyBDNDY0LjY4NjUzOTY1IDIxMS4yODAzMTY3MyA0NjQuNjg2NTM5NjUgMTIyLjE4MDMxNjczIDQ2NC42ODY1Mzk2NSAzMC4zODAzMTY3MyBDMzE1LjUyNjUzOTY1IDMwLjM4MDMxNjczIDE2Ni4zNjY1Mzk2NSAzMC4zODAzMTY3MyAxMi42ODY1Mzk2NSAzMC4zODAzMTY3MyBaICIgZmlsbD0iIzAwMDAwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMzEzNDYwMzUwMDM2NjIsOTAuNjE5NjgzMjY1Njg2MDQpIi8+Cjwvc3ZnPgo="
        const hollow_circle_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPgo8cGF0aCBkPSJNMCAwIEMxLjAyNjA5Mzc1IDAuMjAzOTk0MTQgMi4wNTIxODc1IDAuNDA3OTg4MjggMy4xMDkzNzUgMC42MTgxNjQwNiBDNDAuOTA4MzA5NjcgOC4zMTAwNjgxMyA3NS45MDYyOTYwMSAyMi45OTIzNDg5MiAxMDcgNDYgQzEwNy44ODU1ODU5NCA0Ni42NTIzNDYxOSAxMDcuODg1NTg1OTQgNDYuNjUyMzQ2MTkgMTA4Ljc4OTA2MjUgNDcuMzE3ODcxMDkgQzExOC40OTM1MDc2OSA1NC41MzQ3NTA2MiAxMjcuMzA1NjY0NDEgNjIuNjA4Nzc4OTUgMTM2IDcxIEMxMzYuOTQxMDE1NjIgNzEuODk5NzY1NjMgMTM3Ljg4MjAzMTI1IDcyLjc5OTUzMTI1IDEzOC44NTE1NjI1IDczLjcyNjU2MjUgQzE0NC43MjUwNDYzOSA3OS40NTQ1NzMxMSAxNDkuOTM1NDM5NDcgODUuNTUxODIyNDIgMTU1IDkyIEMxNTUuNzkxNDg0MzcgOTIuOTg2MTMyODEgMTU2LjU4Mjk2ODc1IDkzLjk3MjI2NTYzIDE1Ny4zOTg0Mzc1IDk0Ljk4ODI4MTI1IEMxODMuNjU3NTM4NjggMTI4LjI0NzA0ODIgMTk5LjY5MDc3MTY1IDE2Ni42MzI5NjQgMjA4IDIwOCBDMjA4LjI3MzM2MTgyIDIwOS4zMzY4MzgzOCAyMDguMjczMzYxODIgMjA5LjMzNjgzODM4IDIwOC41NTIyNDYwOSAyMTAuNzAwNjgzNTkgQzIxMy44NzY0NDk2NiAyMzguMTQ4MTQ0OTYgMjEzLjU3OTQ3NDA0IDI3MC42Mjk3NDU4OSAyMDggMjk4IEMyMDcuNzk2MDA1ODYgMjk5LjAyNjA5Mzc1IDIwNy41OTIwMTE3MiAzMDAuMDUyMTg3NSAyMDcuMzgxODM1OTQgMzAxLjEwOTM3NSBDMTk5LjY4OTkzMTg3IDMzOC45MDgzMDk2NyAxODUuMDA3NjUxMDggMzczLjkwNjI5NjAxIDE2MiA0MDUgQzE2MS41NjUxMDI1NCA0MDUuNTkwMzkwNjIgMTYxLjEzMDIwNTA4IDQwNi4xODA3ODEyNSAxNjAuNjgyMTI4OTEgNDA2Ljc4OTA2MjUgQzE1My40NjUyNDkzOCA0MTYuNDkzNTA3NjkgMTQ1LjM5MTIyMTA1IDQyNS4zMDU2NjQ0MSAxMzcgNDM0IEMxMzYuMTAwMjM0MzggNDM0Ljk0MTAxNTYyIDEzNS4yMDA0Njg3NSA0MzUuODgyMDMxMjUgMTM0LjI3MzQzNzUgNDM2Ljg1MTU2MjUgQzEyOC41NDU0MjY4OSA0NDIuNzI1MDQ2MzkgMTIyLjQ0ODE3NzU4IDQ0Ny45MzU0Mzk0NyAxMTYgNDUzIEMxMTUuMDEzODY3MTkgNDUzLjc5MTQ4NDM3IDExNC4wMjc3MzQzOCA0NTQuNTgyOTY4NzUgMTEzLjAxMTcxODc1IDQ1NS4zOTg0Mzc1IEM3OS43NTI5NTE4IDQ4MS42NTc1Mzg2OCA0MS4zNjcwMzYgNDk3LjY5MDc3MTY1IDAgNTA2IEMtMS4zMzY4MzgzOCA1MDYuMjczMzYxODIgLTEuMzM2ODM4MzggNTA2LjI3MzM2MTgyIC0yLjcwMDY4MzU5IDUwNi41NTIyNDYwOSBDLTMwLjE0ODE0NDk2IDUxMS44NzY0NDk2NiAtNjIuNjI5NzQ1ODkgNTExLjU3OTQ3NDA0IC05MCA1MDYgQy05MS41MzkxNDA2MyA1MDUuNjk0MDA4NzkgLTkxLjUzOTE0MDYzIDUwNS42OTQwMDg3OSAtOTMuMTA5Mzc1IDUwNS4zODE4MzU5NCBDLTEzMC45MDgzMDk2NyA0OTcuNjg5OTMxODcgLTE2NS45MDYyOTYwMSA0ODMuMDA3NjUxMDggLTE5NyA0NjAgQy0xOTcuNTkwMzkwNjIgNDU5LjU2NTEwMjU0IC0xOTguMTgwNzgxMjUgNDU5LjEzMDIwNTA4IC0xOTguNzg5MDYyNSA0NTguNjgyMTI4OTEgQy0yMDguNDkzNTA3NjkgNDUxLjQ2NTI0OTM4IC0yMTcuMzA1NjY0NDEgNDQzLjM5MTIyMTA1IC0yMjYgNDM1IEMtMjI2Ljk0MTAxNTYzIDQzNC4xMDAyMzQzOCAtMjI3Ljg4MjAzMTI1IDQzMy4yMDA0Njg3NSAtMjI4Ljg1MTU2MjUgNDMyLjI3MzQzNzUgQy0yMzQuNzI1MDQ2MzkgNDI2LjU0NTQyNjg5IC0yMzkuOTM1NDM5NDcgNDIwLjQ0ODE3NzU4IC0yNDUgNDE0IEMtMjQ1Ljc5MTQ4NDM4IDQxMy4wMTM4NjcxOSAtMjQ2LjU4Mjk2ODc1IDQxMi4wMjc3MzQzOCAtMjQ3LjM5ODQzNzUgNDExLjAxMTcxODc1IEMtMjczLjY1NzUzODY4IDM3Ny43NTI5NTE4IC0yODkuNjkwNzcxNjUgMzM5LjM2NzAzNiAtMjk4IDI5OCBDLTI5OC4xODIyNDEyMSAyOTcuMTA4Nzc0NDEgLTI5OC4zNjQ0ODI0MiAyOTYuMjE3NTQ4ODMgLTI5OC41NTIyNDYwOSAyOTUuMjk5MzE2NDEgQy0zMDMuODc2NDQ5NjYgMjY3Ljg1MTg1NTA0IC0zMDMuNTc5NDc0MDQgMjM1LjM3MDI1NDExIC0yOTggMjA4IEMtMjk3Ljc5NjAwNTg2IDIwNi45NzM5MDYyNSAtMjk3LjU5MjAxMTcyIDIwNS45NDc4MTI1IC0yOTcuMzgxODM1OTQgMjA0Ljg5MDYyNSBDLTI4OS42ODk5MzE4NyAxNjcuMDkxNjkwMzMgLTI3NS4wMDc2NTEwOCAxMzIuMDkzNzAzOTkgLTI1MiAxMDEgQy0yNTEuMzQ3NjUzODEgMTAwLjExNDQxNDA2IC0yNTEuMzQ3NjUzODEgMTAwLjExNDQxNDA2IC0yNTAuNjgyMTI4OTEgOTkuMjEwOTM3NSBDLTI0My40NjUyNDkzOCA4OS41MDY0OTIzMSAtMjM1LjM5MTIyMTA1IDgwLjY5NDMzNTU5IC0yMjcgNzIgQy0yMjYuMTAwMjM0MzggNzEuMDU4OTg0MzcgLTIyNS4yMDA0Njg3NSA3MC4xMTc5Njg3NSAtMjI0LjI3MzQzNzUgNjkuMTQ4NDM3NSBDLTIxOC41NDU0MjY4OSA2My4yNzQ5NTM2MSAtMjEyLjQ0ODE3NzU4IDU4LjA2NDU2MDUzIC0yMDYgNTMgQy0yMDUuMDEzODY3MTkgNTIuMjA4NTE1NjIgLTIwNC4wMjc3MzQzNyA1MS40MTcwMzEyNSAtMjAzLjAxMTcxODc1IDUwLjYwMTU2MjUgQy0xNjkuNzUyOTUxOCAyNC4zNDI0NjEzMiAtMTMxLjM2NzAzNiA4LjMwOTIyODM1IC05MCAwIEMtODkuMTA4Nzc0NDEgLTAuMTgyMjQxMjEgLTg4LjIxNzU0ODgzIC0wLjM2NDQ4MjQyIC04Ny4yOTkzMTY0MSAtMC41NTIyNDYwOSBDLTU5Ljg1MTg1NTA0IC01Ljg3NjQ0OTY2IC0yNy4zNzAyNTQxMSAtNS41Nzk0NzQwNCAwIDAgWiBNLTkyIDMyIEMtOTIuODQzODUyNTQgMzIuMTgxOTE4OTUgLTkzLjY4NzcwNTA4IDMyLjM2MzgzNzg5IC05NC41NTcxMjg5MSAzMi41NTEyNjk1MyBDLTE0NC4wMzE5NzUyMSA0My41MjkzMjg4MiAtMTkxLjEwMTYxOTQgNzIuNjI3NTUxNDggLTIyMiAxMTMgQy0yMjIuNDMwMjI0NjEgMTEzLjU1OTEzMDg2IC0yMjIuODYwNDQ5MjIgMTE0LjExODI2MTcyIC0yMjMuMzAzNzEwOTQgMTE0LjY5NDMzNTk0IEMtMjMwLjIzMjc5NDc4IDEyMy43NDc4Nzk4MyAtMjM2LjM4MTk4MTk5IDEzMy4wODM1NDQ5NiAtMjQyIDE0MyBDLTI0Mi4zNDEyNzkzIDE0My41OTIxNjMwOSAtMjQyLjY4MjU1ODU5IDE0NC4xODQzMjYxNyAtMjQzLjAzNDE3OTY5IDE0NC43OTQ0MzM1OSBDLTI1NS43NTgxNDI0NSAxNjYuOTg1MjY4MTYgLTI2My45MTcyNTM1OCAxOTEuODAyMDEwOTEgLTI2OCAyMTcgQy0yNjguMTc4MDUxNzYgMjE4LjA2Njk0MDkyIC0yNjguMzU2MTAzNTIgMjE5LjEzMzg4MTg0IC0yNjguNTM5NTUwNzggMjIwLjIzMzE1NDMgQy0yNzAuMTYxNDI2OTMgMjMwLjkzOTEzMTIxIC0yNzAuMzk3OTYxNCAyNDEuNTAxODEzMzkgLTI3MC4zNzUgMjUyLjMxMjUgQy0yNzAuMzc0Nzg4NTEgMjUzLjIzMzg2NzQ5IC0yNzAuMzc0NTc3MDMgMjU0LjE1NTIzNDk5IC0yNzAuMzc0MzU5MTMgMjU1LjEwNDUyMjcxIEMtMjcwLjMzOTQzODU1IDI3MC4zOTUyNjY2MiAtMjY5LjMyMjM4MTY5IDI4NS4wMjYwNzc1OCAtMjY2IDMwMCBDLTI2NS44MTgwODEwNSAzMDAuODQzODUyNTQgLTI2NS42MzYxNjIxMSAzMDEuNjg3NzA1MDggLTI2NS40NDg3MzA0NyAzMDIuNTU3MTI4OTEgQy0yNTQuNDcwNjcxMTggMzUyLjAzMTk3NTIxIC0yMjUuMzcyNDQ4NTIgMzk5LjEwMTYxOTQgLTE4NSA0MzAgQy0xODQuNDQwODY5MTQgNDMwLjQzMDIyNDYxIC0xODMuODgxNzM4MjggNDMwLjg2MDQ0OTIyIC0xODMuMzA1NjY0MDYgNDMxLjMwMzcxMDk0IEMtMTc0LjI1MjEyMDE3IDQzOC4yMzI3OTQ3OCAtMTY0LjkxNjQ1NTA0IDQ0NC4zODE5ODE5OSAtMTU1IDQ1MCBDLTE1NC40MDc4MzY5MSA0NTAuMzQxMjc5MyAtMTUzLjgxNTY3MzgzIDQ1MC42ODI1NTg1OSAtMTUzLjIwNTU2NjQxIDQ1MS4wMzQxNzk2OSBDLTEzMS4wMTQ3MzE4NCA0NjMuNzU4MTQyNDUgLTEwNi4xOTc5ODkwOSA0NzEuOTE3MjUzNTggLTgxIDQ3NiBDLTc5LjkzMzA1OTA4IDQ3Ni4xNzgwNTE3NiAtNzguODY2MTE4MTYgNDc2LjM1NjEwMzUyIC03Ny43NjY4NDU3IDQ3Ni41Mzk1NTA3OCBDLTY3LjA2MDg2ODc5IDQ3OC4xNjE0MjY5MyAtNTYuNDk4MTg2NjEgNDc4LjM5Nzk2MTQgLTQ1LjY4NzUgNDc4LjM3NSBDLTQ0Ljc2NjEzMjUxIDQ3OC4zNzQ3ODg1MSAtNDMuODQ0NzY1MDEgNDc4LjM3NDU3NzAzIC00Mi44OTU0NzcyOSA0NzguMzc0MzU5MTMgQy0yNy42MDQ3MzMzOCA0NzguMzM5NDM4NTUgLTEyLjk3MzkyMjQyIDQ3Ny4zMjIzODE2OSAyIDQ3NCBDMi44NDM4NTI1NCA0NzMuODE4MDgxMDUgMy42ODc3MDUwOCA0NzMuNjM2MTYyMTEgNC41NTcxMjg5MSA0NzMuNDQ4NzMwNDcgQzU0LjAzMTk3NTIxIDQ2Mi40NzA2NzExOCAxMDEuMTAxNjE5NCA0MzMuMzcyNDQ4NTIgMTMyIDM5MyBDMTMyLjQzMDIyNDYxIDM5Mi40NDA4NjkxNCAxMzIuODYwNDQ5MjIgMzkxLjg4MTczODI4IDEzMy4zMDM3MTA5NCAzOTEuMzA1NjY0MDYgQzE0MC4yMzI3OTQ3OCAzODIuMjUyMTIwMTcgMTQ2LjM4MTk4MTk5IDM3Mi45MTY0NTUwNCAxNTIgMzYzIEMxNTIuMzQxMjc5MyAzNjIuNDA3ODM2OTEgMTUyLjY4MjU1ODU5IDM2MS44MTU2NzM4MyAxNTMuMDM0MTc5NjkgMzYxLjIwNTU2NjQxIEMxNjUuNzU4MTQyNDUgMzM5LjAxNDczMTg0IDE3My45MTcyNTM1OCAzMTQuMTk3OTg5MDkgMTc4IDI4OSBDMTc4LjI2NzA3NzY0IDI4Ny4zOTk1ODg2MiAxNzguMjY3MDc3NjQgMjg3LjM5OTU4ODYyIDE3OC41Mzk1NTA3OCAyODUuNzY2ODQ1NyBDMTgwLjE2MTQyNjkzIDI3NS4wNjA4Njg3OSAxODAuMzk3OTYxNCAyNjQuNDk4MTg2NjEgMTgwLjM3NSAyNTMuNjg3NSBDMTgwLjM3NDY4Mjc3IDI1Mi4zMDU0NDg3NiAxODAuMzc0NjgyNzcgMjUyLjMwNTQ0ODc2IDE4MC4zNzQzNTkxMyAyNTAuODk1NDc3MjkgQzE4MC4zMzk0Mzg1NSAyMzUuNjA0NzMzMzggMTc5LjMyMjM4MTY5IDIyMC45NzM5MjI0MiAxNzYgMjA2IEMxNzUuODE4MDgxMDUgMjA1LjE1NjE0NzQ2IDE3NS42MzYxNjIxMSAyMDQuMzEyMjk0OTIgMTc1LjQ0ODczMDQ3IDIwMy40NDI4NzEwOSBDMTY0LjQ3MDY3MTE4IDE1My45NjgwMjQ3OSAxMzUuMzcyNDQ4NTIgMTA2Ljg5ODM4MDYgOTUgNzYgQzk0LjQ0MDg2OTE0IDc1LjU2OTc3NTM5IDkzLjg4MTczODI4IDc1LjEzOTU1MDc4IDkzLjMwNTY2NDA2IDc0LjY5NjI4OTA2IEM4NC4yNTIxMjAxNyA2Ny43NjcyMDUyMiA3NC45MTY0NTUwNCA2MS42MTgwMTgwMSA2NSA1NiBDNjQuNDA3ODM2OTEgNTUuNjU4NzIwNyA2My44MTU2NzM4MyA1NS4zMTc0NDE0MSA2My4yMDU1NjY0MSA1NC45NjU4MjAzMSBDNDEuMDE0NzMxODQgNDIuMjQxODU3NTUgMTYuMTk3OTg5MDkgMzQuMDgyNzQ2NDIgLTkgMzAgQy0xMC42MDA0MTEzOCAyOS43MzI5MjIzNiAtMTAuNjAwNDExMzggMjkuNzMyOTIyMzYgLTEyLjIzMzE1NDMgMjkuNDYwNDQ5MjIgQy0yMi45MzkxMzEyMSAyNy44Mzg1NzMwNyAtMzMuNTAxODEzMzkgMjcuNjAyMDM4NiAtNDQuMzEyNSAyNy42MjUgQy00NS42OTQ1NTEyNCAyNy42MjUzMTcyMyAtNDUuNjk0NTUxMjQgMjcuNjI1MzE3MjMgLTQ3LjEwNDUyMjcxIDI3LjYyNTY0MDg3IEMtNjIuMzk1MjY2NjIgMjcuNjYwNTYxNDUgLTc3LjAyNjA3NzU4IDI4LjY3NzYxODMxIC05MiAzMiBaICIgZmlsbD0iIzAwMDAwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAxLDMpIi8+Cjwvc3ZnPgo="
        const clear_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTE4MDAgNDkwMSBjLTY4IC0yMSAtMTE0IC01OSAtMTQ0IC0xMTggLTEzIC0yNyAtMTYgLTcxIC0xNiAtMjcyIGwwCi0yNDAgLTUzMiAtMyBjLTUyNCAtMyAtNTM0IC0zIC01NzMgLTI1IC03NyAtNDEgLTExNSAtMTA1IC0xMTUgLTE5MyAwIC04NCA1MwotMTYxIDEzMiAtMTk0IDMzIC0xNCAyNDkgLTE2IDIwMDggLTE2IDE3NTkgMCAxOTc1IDIgMjAwOCAxNiA3OSAzMyAxMzIgMTEwCjEzMiAxOTQgMCA4OCAtMzggMTUyIC0xMTUgMTkzIC0zOSAyMiAtNDkgMjIgLTU2MiAyNSBsLTUyMyAzIDAgMjQwIGMwIDIwMSAtMwoyNDUgLTE2IDI3MiAtMjMgNDUgLTUzIDc2IC05OSAxMDAgLTQwIDIyIC00MyAyMiAtODAwIDI0IC00MTggMSAtNzcxIC0yIC03ODUKLTZ6IG0xMjgwIC01MTEgbDAgLTkwIC01MTAgMCAtNTEwIDAgMCA5MCAwIDkwIDUxMCAwIDUxMCAwIDAgLTkweiIvPgo8cGF0aCBkPSJNODQyIDIxNTggbDMgLTEyNTMgMjMgLTgwIGM4MiAtMjk4IDI5MSAtNTA3IDU4MyAtNTg3IGw4NCAtMjMgMTAxNQowIDEwMTUgMCA4NSAyMyBjMjkwIDc5IDUwMCAyOTAgNTgyIDU4NyBsMjMgODAgMyAxMjUzIDMgMTI1MiAtMTcxMSAwIC0xNzExIDAKMyAtMTI1MnogbTEzMDYgNjkzIGM0MyAtMjIgNzIgLTUyIDk4IC0xMDEgMTggLTMzIDE5IC03MiAxOSAtODAwIGwwIC03NjUgLTI4Ci00OCBjLTM2IC02MSAtOTMgLTk5IC0xNTcgLTEwNSAtNzQgLTcgLTExMyA1IC0xNjMgNDggLTgyIDcyIC03OCAyNiAtNzUgODg2CmwzIDc2MSAzMCA0OCBjNDAgNjQgOTcgOTUgMTc3IDk1IDM4IDAgNzIgLTcgOTYgLTE5eiBtMTA0MCAtMTUgYzI2IC0xOCA1MQotNDcgNjcgLTc5IGwyNSAtNTEgMCAtNzU1IGMwIC04NTQgNCAtODAxIC04MCAtODc0IC05OSAtODUgLTI1NCAtNTQgLTMyMCA2MwpsLTI1IDQ1IDAgNzY1IGMwIDc2NCAwIDc2NSAyMiA4MDUgNDUgODQgMTAyIDExNiAxOTkgMTEzIDU5IC0zIDc4IC04IDExMiAtMzJ6Ii8+CjwvZz4KPC9zdmc+Cg=="
        const straight_line_base64 ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTQ1MDAgNTExMyBjLTIxOSAtMzcgLTQwOSAtMjMwIC00MzkgLTQ0NyAtMTYgLTExMyA4IC0yNDcgNjAgLTMzNQpsMjAgLTM1IC0xNjU5IC0xNjU4IC0xNjU4IC0xNjU5IC0zNSAyMCBjLTE0MCA4MyAtMzMxIDg3IC00ODYgMTEgLTE3NyAtODcKLTI4NiAtMjQ4IC0zMDAgLTQ0NSAtMTAgLTE1NCA0MyAtMjkxIDE1NyAtNDA1IDExNCAtMTE0IDI1MSAtMTY3IDQwNSAtMTU3CjE0MSAxMCAyNDUgNTggMzQ3IDE2MSAxNjMgMTYyIDIwMCA0MzMgODcgNjI1IGwtMjAgMzUgMTY1OSAxNjU4IDE2NTggMTY1OSAzNQotMjAgYzg4IC01MiAyMjIgLTc2IDMzNSAtNjEgMTQyIDIwIDMwNSAxMzAgMzc5IDI1NSA5MiAxNTkgOTcgMzU4IDEyIDUxOSAtNDEKNzggLTE0NSAxODIgLTIyMyAyMjMgLTk4IDUyIC0yMjggNzQgLTMzNCA1NnogbTIxNSAtMjM4IGMxMzUgLTU5IDIxMCAtMjAwCjE4MyAtMzQ1IC0xMyAtNzEgLTM3IC0xMTYgLTg4IC0xNjcgLTY3IC02OCAtMTE5IC04OCAtMjI1IC04OCAtNzUgMCAtOTggNAotMTM1IDI0IC02MSAzMiAtMTE2IDg2IC0xNDggMTQ2IC0yMyA0MyAtMjcgNjIgLTI3IDE0MCAwIDEwNiAyMCAxNTggODggMjI1CjUwIDUxIDg2IDcwIDE1NyA4NiA2OSAxNSAxMzAgOCAxOTUgLTIxeiBtLTQwNDAgLTQwNTcgYzYwIC0zMSAxMTQgLTg2IDE0NgotMTQ4IDM0IC02NSAzNCAtMjA0IDEgLTI3MiAtMjcgLTU1IC05MSAtMTIyIC0xNDIgLTE0OCAtODQgLTQzIC0yMDUgLTQzIC0yODkKLTEgLTE4MSA5MyAtMjMyIDMzMiAtMTAzIDQ4NiAzMyA0MCA5MiA4MiAxMzkgMTAwIDYxIDIzIDE4NiAxNSAyNDggLTE3eiIvPgo8L2c+Cjwvc3ZnPgo="
        const thickness = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTEzMiA1MTA5IGMtNDcgLTE0IC0xMDkgLTc5IC0xMjMgLTEzMSAtMjMgLTg5IDEyIC0xODIgODggLTIyOSBsMzgKLTI0IDI0MjUgMCAyNDI1IDAgMzggMjQgYzIxIDEzIDUwIDQyIDY1IDY0IDIzIDM0IDI3IDUyIDI3IDEwNyAwIDU1IC00IDczCi0yNyAxMDcgLTE1IDIyIC00NCA1MSAtNjUgNjQgbC0zOCAyNCAtMjQxMCAyIGMtMTUwMiAxIC0yNDIyIC0yIC0yNDQzIC04eiIvPgo8cGF0aCBkPSJNMjE1IDM5MzIgYy0yNTYgLTg4IC0yNzIgLTQ0MiAtMjYgLTU1NiBsNDYgLTIxIDIzMzAgMCAyMzMwIDAgNDYgMjEKYzYwIDI4IDEyNSA5MyAxNTIgMTUzIDMwIDY0IDMwIDE3OCAwIDI0MiAtMjcgNjAgLTkyIDEyNSAtMTUyIDE1MyBsLTQ2IDIxCi0yMzE1IDIgYy0yMTc1IDIgLTIzMTggMSAtMjM2NSAtMTV6Ii8+CjxwYXRoIGQ9Ik0zMTMgMjU2NSBjLTE1OSAtNDMgLTI2NSAtMTU5IC0yOTUgLTMyNSAtMzggLTIwMSAxMDcgLTQwNiAzMTcgLTQ1MAozNCAtNyA3NjUgLTkgMjI2MCAtOCBsMjIxMCAzIDU4IDIzIGMxNTcgNjQgMjUyIDIwNCAyNTIgMzcyIDAgMTY4IC05NSAzMDgKLTI1MiAzNzIgbC01OCAyMyAtMjIyMCAyIGMtMTg5MCAyIC0yMjI4IDAgLTIyNzIgLTEyeiIvPgo8cGF0aCBkPSJNMzkwIDk4NCBjLTkxIC0yNCAtMTYxIC02NSAtMjMwIC0xMzQgLTE1OCAtMTU5IC0xOTMgLTM3NSAtOTIgLTU4MAozNSAtNzAgMTQyIC0xNzcgMjEyIC0yMTIgMTI2IC02MiAtMjggLTU4IDIyODUgLTU4IDIzMTMgMCAyMTU5IC00IDIyODUgNTggNzAKMzUgMTc3IDE0MiAyMTIgMjEyIDc2IDE1NCA3NiAzMDYgMCA0NjAgLTM1IDcwIC0xNDIgMTc3IC0yMTIgMjEyIC0xMjYgNjIgMjkKNTggLTIyOTAgNTcgLTE4MjggMCAtMjEyMiAtMiAtMjE3MCAtMTV6Ii8+CjwvZz4KPC9zdmc+Cg=="
        const undo_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTE5MDYgNDQ5MyBjLTQxIC0yMiAtMTg1NyAtMTUxOSAtMTg4MCAtMTU0OSAtMjkgLTM5IC0zMiAtMTAzIC04Ci0xNTAgMTggLTM1IDg3IC04NCA2MTEgLTQyOSAzMjUgLTIxNSA3MzYgLTQ4NiA5MTQgLTYwMyAzNTkgLTIzOCAzODMgLTI1Mgo0MjcgLTI1MiA1MCAwIDEwNyAzNSAxMzAgODAgMTkgMzcgMjAgNTggMjAgNDMxIGwwIDM5MiAyMTMgLTYgYzExNiAtNCAyNjQKLTEzIDMyNyAtMjIgNDczIC02NCA5MjAgLTI1NiAxMjkwIC01NTEgMTE0IC05MSAzNDggLTMyNiA0NDEgLTQ0NCAxNTQgLTE5MwoyNzYgLTM4MCA0MDEgLTYxNSA1NCAtMTAwIDcxIC0xMjQgMTA0IC0xNDIgNDkgLTI4IDkzIC0yOSAxNDQgLTMgNzkgNDAgOTMKMTEzIDcwIDM2NSAtNTEgNTY3IC0yNTIgMTA3NyAtNjAxIDE1MjUgLTkzIDEyMSAtMjg1IDMxOCAtNDE0IDQyNyAtNTUgNDYKLTE2NyAxMjkgLTI0OCAxODMgLTQ3MSAzMTUgLTEwMTggNDgwIC0xNTg5IDQ4MCBsLTEzOCAwIDAgMzkwIGMwIDM3MiAtMSAzOTMKLTIwIDQzMCAtMzUgNjkgLTEyOCA5OSAtMTk0IDYzeiIvPgo8L2c+Cjwvc3ZnPgo=";
        const redo_base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNTEyLjAwMDAwMHB0IiBoZWlnaHQ9IjUxMi4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDUxMi4wMDAwMDAgNTEyLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNTEyLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTMwNzggNDQ4OSBjLTIzIC0xMiAtNDYgLTM1IC01OCAtNTkgLTE5IC0zNyAtMjAgLTU4IC0yMCAtNDI4IGwwCi0zODkgLTIwNyAtNiBjLTExNSAtMyAtMjYwIC0xMyAtMzIzIC0yMiAtNDk1IC02OCAtOTUxIC0yNTkgLTEzNjUgLTU3NCAtMTI2Ci05NSAtMzk5IC0zNjYgLTQ5NSAtNDkxIC0zNTAgLTQ1NSAtNTQ5IC05NTggLTYwMCAtMTUyNSAtMjMgLTI1MiAtOSAtMzI1IDcwCi0zNjUgNTEgLTI2IDk1IC0yNSAxNDQgMyAzMyAxOCA1MCA0MiAxMDMgMTQxIDEyOCAyNDAgMjQ2IDQyMCA0MDEgNjE2IDk0IDExOAozMjggMzUzIDQ0MiA0NDQgNDc3IDM4MSAxMDQ4IDU3NSAxNjkzIDU3NiBsMTM3IDAgMCAtMzkwIGMwIC0zNzIgMSAtMzkzIDIwCi00MzAgMzUgLTY5IDEyNSAtOTkgMTkzIC02MyAxOCA5IDIzNyAxNTEgNDg3IDMxNiAyNTAgMTY1IDY2MyA0MzcgOTE4IDYwNQo0MDAgMjY0IDQ2NiAzMTAgNDgyIDM0MyAyNiA1MCAyNSA5NSAtMyAxNDEgLTE1IDI1IC0zMjUgMjg3IC05NDIgNzk1IC01MDYKNDE3IC05MzMgNzY0IC05NDggNzcxIC00MCAxNyAtODYgMTQgLTEyOSAtOXoiLz4KPC9nPgo8L3N2Zz4K";

        // Create the tools
        const createTool = (base64Image, toolId) => {
            const tool = document.createElement('div');
            tool.setAttribute('data-tool-id', toolId);
            tool.style.width = this.other_tool_width_height + 'px';
            tool.style.height = this.other_tool_width_height + 'px';
            tool.style.backgroundColor = this.button_color;
            tool.style.borderRadius = '4px';
            tool.style.backgroundImage = `url(${base64Image})`;
            tool.style.backgroundSize = '50%';
            tool.style.backgroundRepeat = 'no-repeat';
            tool.style.backgroundPosition = 'center';
            tool.style.cursor = 'pointer';
            if(toolId == 1){
                tool.style.border = 4*this.scale + `px solid ${this.select_color}`;
            }
        
            tool.addEventListener('click', () => {
                if(toolId != 9 && toolId != 11 && toolId != 12){
                    //clear, redo, undo should not change the current tool
                    document.querySelectorAll('.simple_draw_canvas_tool').forEach(t => t.style.border = "none");
                    this.current_tool = toolId;
                }

                if (toolId === 3) {
                    this.canvas.style.cursor = "crosshair";
                } else {
                    this.canvas.style.cursor = "default";
                }
        
                tool.style.border = 4*this.scale + `px solid ${this.select_color}`;
            });
        
            tool.classList.add('simple_draw_canvas_tool'); 
            return tool;
        };
        // Create the toggle tools like rectangle, circle
        const createToggleTool = (solidImage, hollowImage, toolIdSolid, toolIdHollow) => {
            let isSolid = true; 
        
            const tool = document.createElement('div');
            tool.setAttribute('data-tool-id', toolIdSolid);
            tool.style.width = this.other_tool_width_height + 'px';
            tool.style.height = this.other_tool_width_height + 'px';
            tool.style.backgroundColor = this.button_color;
            tool.style.borderRadius = '4px';
            tool.style.backgroundImage = `url(${solidImage})`;
            tool.style.backgroundSize = '50%';
            tool.style.backgroundRepeat = 'no-repeat';
            tool.style.backgroundPosition = 'center';
            tool.style.cursor = 'pointer';
        
            tool.addEventListener('click', () => {
                document.querySelectorAll('.simple_draw_canvas_tool').forEach(t => t.style.border = "none");
                //toggle between solid and hollow
                if(this.current_tool == toolIdSolid || this.current_tool == toolIdHollow ){
                    isSolid = !isSolid;
                    this.current_tool = isSolid ? toolIdSolid : toolIdHollow;
                    tool.style.backgroundImage = `url(${isSolid ? solidImage : hollowImage})`;
                }
                else{
                    isSolid = true;
                    this.current_tool = toolIdSolid;
                    tool.style.backgroundImage = `url(${solidImage})`;
                }
                
                tool.style.border = 4*this.scale + `px solid ${this.select_color}`;
            });
        
            tool.classList.add('simple_draw_canvas_tool');
            return tool;
        };
        
        const brush_tool = createTool(brush_base64, 1);
        const eraser = createTool(eraser_base64, 2);
        const text = createTool(text_base64, 3);
        const bucket = createTool(bucket_base64, 4);
        const square = createToggleTool(square_base64,hollow_square_base64, 5,7);
        const circle = createToggleTool(circle_base64,hollow_circle_base64, 6,8);

        const undo = createTool(undo_base64, 11);
        undo.addEventListener('click', () => {
            const prevTool = this.current_tool;
            this.undo()
            setTimeout(() => {
                undo.style.border = "none";
            }, 150);
            this.current_tool = prevTool;
        });

        const redo = createTool(redo_base64, 12);
        redo.addEventListener('click', () => {
            const prevTool = this.current_tool;
            this.redo()
            setTimeout(() => {
                redo.style.border = "none";
            }, 150);
            this.current_tool = prevTool;
        });

        const straight_line = createTool(straight_line_base64, 10);
        
        const clear = createTool(clear_base64, 9);
        clear.addEventListener('click', () => {
            const prevTool = this.current_tool;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            setTimeout(() => {
                clear.style.border = "none";
            }, 150);
            this.current_tool = prevTool;
            this.saveCanvasState();
        });

        other_tool_area.appendChild(brush_tool);
        other_tool_area.appendChild(text);
        other_tool_area.appendChild(eraser);
        other_tool_area.appendChild(bucket);
        other_tool_area.appendChild(square);
        other_tool_area.appendChild(circle);
        other_tool_area.appendChild(clear);
        other_tool_area.appendChild(straight_line);
        other_tool_area.appendChild(undo);
        other_tool_area.appendChild(redo);

        this.tool_set.appendChild(other_tool_area);
        // Create the stroke thickness tool
        const thickness_area = document.createElement('div');
        thickness_area.style.width = this.tool_w + 'px';
        thickness_area.style.height = this.tool_h / 12 + 'px';
        thickness_area.style.display = 'flex';
        thickness_area.style.justifyContent = 'center';
        thickness_area.style.placeItems = 'center';
        thickness_area.style.position = 'relative';

        this.thickness_tool_width = this.tool_w * 5 / 6;
        this.thickness_tool_height = this.tool_h / 20;

        const thickness_tool = document.createElement('div');
        thickness_tool.style.width = this.thickness_tool_width + 'px';
        thickness_tool.style.height = this.thickness_tool_height + 'px';
        thickness_tool.style.borderRadius = '50px';
        thickness_tool.style.background = this.button_color;
        thickness_tool.style.cursor = 'pointer';
        thickness_tool.style.backgroundImage = `url(${thickness})`;
        thickness_tool.style.backgroundSize = '18%';
        thickness_tool.style.backgroundRepeat = 'no-repeat';
        thickness_tool.style.backgroundPosition = 'center';

        const panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.left = 'calc(100% + 10px)'; 
        // panel.style.bottom = '0%';
        panel.style.transform = 'translateY(-50%)'; 
        panel.style.padding = 10*this.scale+ 'px';
        panel.style.background = this.tool_area_background;
        panel.style.border = 4*this.scale + `px solid ${this.tool_canvas_border}`;
        panel.style.borderRadius = '10px';
        panel.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        panel.style.display = 'none';
        panel.style.zIndex = '1000';
        panel.style.flexDirection = 'column'; 
        panel.style.alignItems = 'center';
        panel.style.gap = 10*this.scale+ 'px';

        //the default stroke size, initially set to 10
        const sizes = [2, 4, 6, 8, 10, 15, 20];

        //create the buttons for the stroke sizes
        sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.innerText = size;
            btn.style.width = 120*this.scale + 'px';
            btn.style.height = 60*this.scale + 'px';
            btn.style.borderRadius = '10px';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.background = this.button_color;
            btn.style.color = '#111111';
            btn.style.fontSize = 28*this.scale + 'px';
            if (size == 10){
                btn.style.border = 4*this.scale + `px solid ${this.select_color}`;
            }

            btn.addEventListener('click', () => {
                this.strokeSize = size;
                this.ctx.lineWidth = size;
                panel.style.display = 'none';
                thickness_tool.style.border = (panel.style.display === 'none')? 'none':4*this.scale + `px solid ${this.select_color}`;

                document.querySelectorAll('.simple_draw_stroke_thickness').forEach(t => t.style.border = "none");
                btn.style.border = 4*this.scale + `px solid ${this.select_color}`;
            });
            btn.classList.add('simple_draw_stroke_thickness'); 
            panel.appendChild(btn);
        });

        thickness_area.appendChild(thickness_tool);
        thickness_area.appendChild(panel);
        this.tool_set.appendChild(thickness_area);

        document.addEventListener('click', (event) => {
            //check if the clicked target is not inside the panel or the thickness_tool
            if (!panel.contains(event.target) && event.target !== thickness_tool) {
                panel.style.display = 'none';
                thickness_tool.style.border = 'none';
            }
        });

        thickness_tool.addEventListener('click', () => {
            panel.style.display = (panel.style.display === 'none') ? 'flex' : 'none';
            thickness_tool.style.border = (panel.style.display === 'none')? 'none':4*this.scale + `px solid ${this.select_color}`;
        });
    }
    
}

// export default Simple_Draw;