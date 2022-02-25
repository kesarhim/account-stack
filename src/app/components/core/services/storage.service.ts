import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: any = {};

  constructor() {}

  get(key:string) {
    let data = this.storage[key];
    if (!data) {
      let d = localStorage.getItem(key);
      if (d || d !== undefined) {
        if (d) {
          data = JSON.parse(d);
        }
      }
    }
    return data;
  }

  set(key: string, data: any, storeInLocalStorage?: boolean) {
    this.storage[key] = data;
    if (storeInLocalStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    return delete this.storage[key];
  }

  clear() {
    localStorage.clear();
  }
}

export enum StorageKeys {
  CURRENT_ACCOUNT = 'account',
  CURRENT_USER = 'user',
  USER_TYPE = 'user_type',
  TOKEN = "Token"
}
