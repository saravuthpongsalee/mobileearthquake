function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("3D Earthquake Viewer");
}

function saveSensorData(data) {
  try {
    const sheet = SpreadsheetApp.openById("xxxxx").getSheetByName("xxx");
    const timestamp = new Date();
    const accX = parseFloat(data.accX) || 0;
    const accY = parseFloat(data.accY) || 0;
    const accZ = parseFloat(data.accZ) || 0;
    const gForce = parseFloat(data.gForce) || 0;
    const gThreshold = parseFloat(data.gThreshold) || 2.0;
    const rotAlpha = parseFloat(data.rotAlpha) || 0;
    const rotBeta = parseFloat(data.rotBeta) || 0;
    const rotGamma = parseFloat(data.rotGamma) || 0;

    // Filter extreme values
    if (gForce < 0.1 || gForce > 20) return;

    // บันทึกข้อมูลก่อนแจ้งเตือน
    sheet.appendRow([
      timestamp,
      data.name,
      data.location,
      data.deviceId,
      accX,
      accY,
      accZ,
      gForce,
      rotAlpha,
      rotBeta,
      rotGamma
    ]);

    // ตรวจสอบเงื่อนไขเพื่อแจ้งเตือนหลังบันทึกแล้ว
    if (gForce >= gThreshold && gForce > 1.0) {
      const props = PropertiesService.getScriptProperties();
      const last = Number(props.getProperty("lastAlert")) || 0;
      const now = Date.now();

      if ((now - last) > 10000) {
        const msg = `🚨 แจ้งเตือนแรงสั่น G สูงเกิน\n📍ผู้ใช้: ${data.name}\n📌 สถานที่: ${data.location}\n📱 ID: ${data.deviceId}\n📊 G-force: ${gForce.toFixed(2)}g`;
        sendTelegramMessage(msg);
        props.setProperty("lastAlert", now.toString());
      }
    }
  } catch (err) {
    Logger.log("❌ ERROR: " + err.message);
  }
}

function sendTelegramMessage(msg) {
  const token = "xxxxx";
  const chatId = "xxxxx";
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: msg
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log("❌ Telegram Error: " + error.message);
  }
}
