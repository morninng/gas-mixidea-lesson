import { SpreadSheet, SHEET_NAME } from './SpreadSheet';



export class User {



  constructor(){}

  private getMailList(userNameArr: string[]){
    const email_arr: string[] = [];
    userNameArr.forEach((name: string)=>{
      const email = this.getMail(name);
      email_arr.push(email);
    })
    return email_arr;
  }

  private getMail(userName: string): string{
    

    return;
  }
  
  
  



}