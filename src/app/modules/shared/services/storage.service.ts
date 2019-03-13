import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Cloud } from '../models/cloud.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { 

  }

  setClouds(clouds: Array<Cloud>) {
    this.storage.set('clouds', clouds);
  }

  getClouds(): Promise<any> {
    return this.storage.get('clouds');
  }

  /***********
   * Cloud Settings 
  ***********/
  // // CREATE
  // addCloud(item: Item): Promise<any> {
  //   return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
  //     if (items) {
  //       items.push(item);
  //       return this.storage.set(ITEMS_KEY, items);
  //     } else {
  //       return this.storage.set(ITEMS_KEY, [item]);
  //     }
  //   });
  // }
 
  // // READ
  // getItems(): Promise<Item[]> {
  //   return this.storage.get(ITEMS_KEY);
  // }
 
  // // UPDATE
  // updateItem(item: Item): Promise<any> {
  //   return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
  //     if (!items || items.length === 0) {
  //       return null;
  //     }
 
  //     let newItems: Item[] = [];
 
  //     for (let i of items) {
  //       if (i.id === item.id) {
  //         newItems.push(item);
  //       } else {
  //         newItems.push(i);
  //       }
  //     }
 
  //     return this.storage.set(ITEMS_KEY, newItems);
  //   });
  // }
 
  // // DELETE
  // deleteItem(id: number): Promise<Item> {
  //   return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
  //     if (!items || items.length === 0) {
  //       return null;
  //     }
 
  //     let toKeep: Item[] = [];
 
  //     for (let i of items) {
  //       if (i.id !== id) {
  //         toKeep.push(i);
  //       }
  //     }
  //     return this.storage.set(ITEMS_KEY, toKeep);
  //   });
  // }
  

}
