import { SpreadSheet, SHEET_NAME } from './SpreadSheet';


const UserListRowNum = 200;


export class User {



  user_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheet;
  user_data : {[key: string]: string[]} | null = null;


  constructor(){
    this.spread_sheet = SpreadSheet.instance;
    this.user_sheet = this.spread_sheet.getSheet(SHEET_NAME.User);
  }

  retrieveUserdata(){
    if(!this.user_data){
      Logger.log('userdata retrieve');
      const range = this.user_sheet.getRange( 1 , 1, 100, 10 );
      const item_map = range.getValues();
      // Logger.log(item_map);

      const title_row_arr = item_map[0];
      const mail_column_num_1 = title_row_arr.indexOf('メールアドレス１');
      const mail_column_num_2 = title_row_arr.indexOf('メールアドレス２');
      const username_column_num = title_row_arr.indexOf('ユーザ名');
      Logger.log(`メールアドレス num1 ${mail_column_num_1}`)
      Logger.log(`メールアドレス num2 ${mail_column_num_2}`)
      Logger.log(`ユーザ名 num ${username_column_num}`)

      const user_data: {[key: string]: string[]} = {};

      const item_map_filtered = item_map.filter((element_arr)=>{ return !!element_arr[username_column_num]})

      item_map_filtered.forEach((item_row_arr)=>{
        user_data[ String(item_row_arr[username_column_num]) ] = 
          [ 
            String(item_row_arr[mail_column_num_1]),  
            String(item_row_arr[mail_column_num_2]) 
          ]
          .filter((element)=>{return !!element;});

      })
      this.user_data = user_data;
      // Logger.log(user_data);
    }
  }

  getMailList(userNameArr: string[]){
    this.retrieveUserdata();
    let email_arr: string[] = [];
    userNameArr.forEach((name: string)=>{
      const user_email_arr: string[] = this.getMail(name);
      if(user_email_arr && user_email_arr.length > 0){
        email_arr = [ ...[], ...email_arr, ...user_email_arr];
      }
    })
    return email_arr;
  }

  getMail(userName: string): string[]{
    if(!this.user_data){
      this.retrieveUserdata();
    }
    this.user_data = this.user_data || {}
    if(!this.user_data[userName] || this.user_data[userName].length === 0 ){
      Browser.msgBox(`!!!!!!!!!!!!!!!!!!!!!!! ${userName} do not have email`);
    }
    return this.user_data[userName] || [];
  }
  
  

}