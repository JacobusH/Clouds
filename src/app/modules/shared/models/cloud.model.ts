export interface Cloud {
  cloudID: string,
  numPixels: number;
  curBrightness: number;
  isActive: boolean
  buildingBlocks: Array<PatternBlock>
}

export interface PatternBlock {
  blockID: string,
  pixels: Array<string> // arr of pixel color hex-codes in position
}

export interface FunctionBlock {
  blockID: string,
}