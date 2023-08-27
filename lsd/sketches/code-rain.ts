import p5 from "p5";

export const sketch = (p: p5) => {
  let streams: Stream[] = [];
  let symbolSize = 26;

  class Symbol {
    x: number;
    y: number;
    value: string;
    speed: number;
    first: boolean;
    opacity: number;
    switchInterval: number;

    constructor(x: number, y: number, speed: number, first: boolean, opacity: number) {
      this.x = x;
      this.y = y;
      this.value = '';
      this.speed = speed;
      this.first = first;
      this.opacity = opacity;
      this.switchInterval = first ? 0 : p.random(5, 25);
      this.setRandomSymbol();
    }

    setRandomSymbol() {
      if (p.frameCount % Math.round(this.switchInterval) === 0) {
        this.value = String.fromCharCode(
          0x30A0 + Math.round(p.random(0, 96))
        );
      }
    }

    rain() {
      this.y = (this.y >= p.height) ? 0 : this.y += this.speed;
    }
  }

  class Stream {
    symbols: Symbol[] = [];

    constructor(x: number) {
      let y = p.random(-1000, 0);
      let speed = p.random(5, 10); // Increased speed
      let length = Math.round(p.random(5, 30));
      let first = true; 

      let opacity = p.random(50, 255);
      for (let i = 0; i <= length; i++) {
        let symbol = new Symbol(x, y, speed, first, opacity);
        symbol.setRandomSymbol();
        this.symbols.push(symbol);
        opacity -= (255/length)/2; 
        y -= symbolSize;
        first = false;
      }
    }

    render() {
      this.symbols.forEach(symbol => {
        if (symbol.first) {
          p.fill(180, 255, 180, symbol.opacity);
        } else {
          p.fill(0, 255, 70, symbol.opacity);
        }
        p.text(symbol.value, symbol.x, symbol.y);
        symbol.rain();
        symbol.setRandomSymbol();
      });
    }
  }

//   let font;
//   p.preload = () => {
//     font = p.loadFont('/fonts/Matrix Code Font.ttf');
//   }

  p.setup = () => {
    p.createCanvas(
      p.windowWidth,
      p.windowHeight
    );
    p.background(0);
    p.textSize(symbolSize);
    p.textStyle(p.BOLD); // Made text bold
    p.textFont('monospace');

    for (let i = 0; i <= p.width / symbolSize; i++) {
      let x = i * symbolSize;
      let stream = new Stream(x);
      streams.push(stream);
    }
  };

  p.draw = () => {
    p.background(0, 150);
    streams.forEach(stream => stream.render());
  };
};
