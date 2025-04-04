🧱 ส่วนที่ 1: HTML (โครงสร้างหน้าเว็บ)
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>3D Earthquake Viewer</title>
ประกาศว่าเป็น HTML5
ตั้งค่ารหัสอักขระเป็น UTF-8 (รองรับภาษาไทย)
ตั้งชื่อหน้าเว็บบนแท็บเป็น “3D Earthquake Viewer”
🎨 ส่วนที่ 2: CSS (ออกแบบหน้าตา)
body {
  margin: 0;
  font-family: sans-serif;
  background: #f0f0f0;
}
ลบขอบของหน้าเว็บ
ใช้ฟอนต์เรียบง่าย
ตั้งพื้นหลังเป็นสีเทาอ่อน
canvas {
  display: block;
}
ให้ <canvas> กินพื้นที่เต็มหน้าจอ ไม่มีขอบขาว
css
#ui {
  position: absolute;
  top: 10px; left: 10px;
  background: rgba(255,255,255,0.9);
  padding: 15px;
  border-radius: 10px;
  z-index: 10;
  width: 300px;
}
กล่องควบคุมอยู่บนซ้ายของหน้า

เป็นกล่องสีขาวโปร่ง มีมุมโค้ง และอยู่เหนือกราฟ 3D
input {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 14px;
}
สไตล์กล่องกรอกข้อมูล
#startBtn {
  background: green; color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
ปุ่ม “เริ่มต้น” เป็นปุ่มเขียว กดง่าย ดูเด่น
#graph {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 200px;
  background: black;
  z-index: 5;
}
ส่วนกราฟ G-force อยู่ล่างสุดของจอ กว้างเต็มจอ สูง 200px พื้นหลังสีดำ
🔧 ส่วนที่ 3: HTML Body (องค์ประกอบ)
html
<div id="ui">
  ...
</div>
กล่องควบคุมเซ็นเซอร์ (UI)
ภายในมี:
ช่องกรอกชื่อ, สถานที่, รหัสเครื่อง
ช่องปรับค่าความแรง G ที่จะให้แจ้งเตือน
แสดงค่าต่าง ๆ แบบเรียลไทม์ (acceleration, rotation, G-force)
ปุ่มเริ่มการทำงาน

html
<canvas id="graph"></canvas>
พื้นที่วาดกราฟ G-force ด้านล่าง

🔬 ส่วนที่ 4: JavaScript (ควบคุมเซ็นเซอร์และ 3D)
js
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
โหลดไลบรารี Three.js สำหรับวาดภาพ 3D

🔲 สร้างฉาก 3D
js
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
สร้างฉาก, กล้อง, ตัวเรนเดอร์ และวางบนหน้าเว็บ

js
let phone = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 0.1),
  new THREE.MeshNormalMaterial()
);
scene.add(phone);
scene.add(new THREE.AxesHelper(5));
camera.position.z = 5;
สร้างกล่องแทน “มือถือ”
เพิ่มแกน XYZ (Axes Helper)
ตั้งกล้องให้อยู่หน้ากล่อง

js
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
ฟังก์ชันวนเรนเดอร์ซ้ำ (แสดงผลต่อเนื่อง)

🟢 เริ่มต้นเมื่อกดปุ่ม “เริ่มต้น”
js
document.getElementById("startBtn").addEventListener("click", async () => {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission !== 'granted') {
      alert("กรุณาอนุญาตการเข้าถึงเซ็นเซอร์");
      return;
    }
  }
  startSensors();
  document.getElementById("startBtn").style.display = "none";
});
iOS ต้องขอสิทธิ์ก่อนเข้าถึงเซ็นเซอร์

ถ้าอนุญาตแล้ว จะเรียก startSensors() และซ่อนปุ่ม

📈 วาดกราฟ G-force
js
const graphCanvas = document.getElementById("graph");
const ctx = graphCanvas.getContext("2d");
graphCanvas.width = window.innerWidth;
graphCanvas.height = 200;
let graphData = [];
เตรียม canvas สำหรับวาดกราฟ
js
function drawGraph(val) {
  graphData.push(val);
  if (graphData.length > graphCanvas.width) graphData.shift();
  ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 100 - graphData[0] * 10);
  for (let i = 1; i < graphData.length; i++) {
    ctx.lineTo(i, 100 - graphData[i] * 10);
  }
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}
วาดเส้นกราฟสีแดงตามค่า G ที่วัดได้

📡 เซ็นเซอร์มือถือ
js
function startSensors() {
  window.addEventListener("deviceorientation", (event) => {
    ...
  });

  window.addEventListener("devicemotion", (event) => {
    ...
  });
}
🎛️ การหมุน (deviceorientation)
js
let alpha = event.alpha || 0;
let beta = event.beta || 0;
let gamma = event.gamma || 0;
รับค่าการหมุนของมือถือรอบแกนต่าง ๆ
js
document.getElementById("alpha").textContent = alpha.toFixed(1);
...
แสดงค่าในหน้าจอ
js
phone.rotation.x = beta * Math.PI / 180;
...
หมุนกล่อง 3D ให้ตรงกับมือถือจริง
📊 การเคลื่อนไหว (devicemotion)
js
const acc = event.accelerationIncludingGravity || {};
let accX = acc.x || 0;
let accY = acc.y || 0;
let accZ = acc.z || 0;
let g = Math.sqrt(accX**2 + accY**2 + accZ**2) / 9.8;
อ่านค่าความเร่งและคำนวณ G-force
js
document.getElementById("accX").textContent = accX.toFixed(2);
...
แสดงผลค่า Acceleration และ G-force
js
drawGraph(g);
วาดกราฟ
📨 ส่งข้อมูลไป Apps Script
js
const name = document.getElementById("name").value.trim();
const location = document.getElementById("location").value.trim();
const deviceId = document.getElementById("deviceId").value.trim();
...
if (name && location && deviceId) {
  google.script.run.saveSensorData({
    ...
  });
}
ถ้ากรอกข้อมูลครบ จะส่งข้อมูลทั้งหมดไปที่ฟังก์ชัน saveSensorData() ของฝั่ง Code.gs
-------------------------------------------------------------------------------------------------------
อันนี้เป็นคำอธิบาย gs
✅ ฟังก์ชันแสดงหน้าเว็บ (doGet())
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("3D Earthquake Viewer");
}
🔹 doGet() เป็นฟังก์ชันเริ่มต้นที่ Google Apps Script เรียกเมื่อเปิด Web App
🔹 HtmlService.createHtmlOutputFromFile('index') คือโหลดไฟล์ HTML ชื่อ index.html มาแสดง
🔹 .setTitle("3D Earthquake Viewer") ตั้งชื่อแท็บในเบราว์เซอร์

✅ ฟังก์ชันบันทึกและประมวลผลข้อมูลจากมือถือ (saveSensorData(data))
function saveSensorData(data) {
  try {
🔹 เริ่มต้นฟังก์ชันชื่อ saveSensorData รับข้อมูลจากหน้าเว็บ
🔹 try { ... } ใช้เพื่อจับข้อผิดพลาด ถ้าเกิด error จะไปทำงานใน catch
    const sheet = SpreadsheetApp.openById("sheetID").getSheetByName("namesheet");
🔹 เข้าถึง Google Sheets โดยใช้ ID และเลือกชีตชื่อ Data
    const timestamp = new Date();
🔹 สร้างตัวแปรวันและเวลาปัจจุบัน
    const accX = parseFloat(data.accX) || 0;
    const accY = parseFloat(data.accY) || 0;
    const accZ = parseFloat(data.accZ) || 0;
🔹 แปลงค่าที่ส่งมาจากหน้าเว็บให้เป็นตัวเลข (ค่าความเร่งในแกน X, Y, Z) ถ้าไม่มีค่าให้ใช้ 0
    const gForce = parseFloat(data.gForce) || 0;
    const gThreshold = parseFloat(data.gThreshold) || 2.0;
🔹 gForce คือแรงจีที่คำนวณได้
🔹 gThreshold คือค่าที่ผู้ใช้กำหนดว่าเกินเท่าไรให้แจ้งเตือน (ถ้าไม่มีให้ใช้ 2.0)
    const rotAlpha = parseFloat(data.rotAlpha) || 0;
    const rotBeta = parseFloat(data.rotBeta) || 0;
    const rotGamma = parseFloat(data.rotGamma) || 0;
🔹 ค่าการหมุนของอุปกรณ์ (องศา)

✅ เงื่อนไขกรองค่าไม่สมเหตุสมผล
    if (gForce < 0.1 || gForce > 20) return;
🔹 ถ้าค่า gForce น้อยกว่า 0.1 หรือมากกว่า 20 ถือว่าผิดปกติ ไม่ต้องบันทึกหรือแจ้งเตือน

✅ บันทึกข้อมูลลง Google Sheet
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
🔹 บันทึกข้อมูลทั้งหมดลงในแถวใหม่ของชีต: วันเวลา, ชื่อผู้ใช้, สถานที่, ID เครื่อง, ค่าเซ็นเซอร์ ฯลฯ

✅ ตรวจสอบและส่งการแจ้งเตือนผ่าน Telegram
    if (gForce >= gThreshold && gForce > 1.0) {
🔹 ถ้าแรง G มากกว่าหรือเท่ากับ Threshold และมากกว่า 1.0 จริง ให้เริ่มตรวจสอบการส่งข้อความ
      const props = PropertiesService.getScriptProperties();
      const last = Number(props.getProperty("lastAlert")) || 0;
      const now = Date.now();
🔹 ใช้ PropertiesService เก็บค่าเวลาครั้งล่าสุดที่แจ้งเตือน
🔹 ถ้าไม่มีข้อมูล จะถือว่าเป็น 0
      if ((now - last) > 10000) {
🔹 ถ้าห่างจากการแจ้งเตือนครั้งล่าสุดเกิน 10 วินาที ให้ส่งใหม่
        const msg = `🚨 แจ้งเตือนแรงสั่น G สูงเกิน\n📍ผู้ใช้: ${data.name}\n📌 สถานที่: ${data.location}\n📱 ID: ${data.deviceId}\n📊 G-force: ${gForce.toFixed(2)}g`;
🔹 สร้างข้อความที่จะส่งไปยัง Telegram
        sendTelegramMessage(msg);
        props.setProperty("lastAlert", now.toString());
🔹 เรียกฟังก์ชันส่งข้อความ และบันทึกเวลาการแจ้งเตือนล่าสุดไว้

✅ ถ้ามีข้อผิดพลาด
  } catch (err) {
    Logger.log("❌ ERROR: " + err.message);
  }
}
🔹 ถ้าเกิดปัญหาใด ๆ ใน try จะบันทึกข้อความ error ลง log ของ Apps Script

✅ ฟังก์ชันส่งข้อความไป Telegram (sendTelegramMessage(msg))
function sendTelegramMessage(msg) {
🔹 ฟังก์ชันที่ใช้สำหรับส่งข้อความไปยัง Telegram
  const token = "TOKEN";
  const chatId = "CHAT_ID";
🔹 ใส่ Token ของ Bot และ ID ของผู้รับข้อความ (หรือกลุ่ม)
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: msg
  };
🔹 เตรียม URL และข้อมูลที่จะส่งไปยัง Telegram API
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
🔹 กำหนดวิธีการส่งเป็น POST และรูปแบบ JSON
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log("❌ Telegram Error: " + error.message);
  }
}
🔹 พยายามส่งข้อความ ถ้าไม่สำเร็จจะเก็บ error ใน logนะครับ







