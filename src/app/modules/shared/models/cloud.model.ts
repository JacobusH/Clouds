export interface Cloud {
  cloudID: string,
  numPixels: number;
  curBrightness: number;
  isActive: boolean
  buildingBlocks: Array<BuildingBlock>
}

export interface BuildingBlock {
  blockID: string,
  
}