export interface Cloud {
  cloudID: string,
  cloudNum: number,
  numPixels: number;
  curBrightness: number;
  isActive: boolean
  buildingBlocks: Array<PatternBlock>
}

export interface PatternBlock {
  blockID: string,
  name: string,
  pixels: Array<string>, // arr of pixel color hex-codes in position
  coordinates: { x: number, y: number },
  height: number,
  blockPatLet: string,
  brightness: number,
  hasSent?: boolean
}

export interface FunctionBlock {
  blockID: string,
}