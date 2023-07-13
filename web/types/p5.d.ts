// types/p5.d.ts

declare module "p5" {
  import p5 = require("p5");
  export = p5;
}

export interface P5Instance extends p5 {
  myCustomRedrawAccordingToNewPropsHandler?: (props: any) => void;
}
