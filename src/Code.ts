
function aaa(){
  console.log('bbb');
}

function myFunctionB() {
  Logger.log('Hello World6');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('受講確認メール');
  const range = sheet.getRange('A1');
  const value = range.getValue();
  Logger.log(value);

}

function getLessonId() {
  Logger.log('Hello World');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('受講確認メール');
  const range = sheet.getRange(1, 2, 100, 2 );
  const item_map = range.getValues();
  Logger.log(item_map);
  let lessonId = "";
  item_map.forEach((item)=>{
    if(item[0]=='レッスンID'){
      Logger.log(item);
      lessonId = String(item[1]);
    }
  })
  Logger.log(lessonId);
  return lessonId;


}
