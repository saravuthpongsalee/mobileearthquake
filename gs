function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function logMotionData(data) {
  const sheet = SpreadsheetApp.openById("xxxxxxxx").getSheetByName("xxxxxx");
  sheet.appendRow([
    new Date(),
    data.accX,
    data.accY,
    data.accZ,
    data.rotAlpha,
    data.rotBeta,
    data.rotGamma
  ]);
}

