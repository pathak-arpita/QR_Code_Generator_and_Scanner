"use strict";

const scannerDiv = document.querySelector(".scanner");

const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-stop-circle");

const form = document.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = form.querySelector(".content");

const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = scannerDiv.querySelector(".scanner-details .close");

//  Input File
form.addEventListener("click", () => fileInput.click());

//  Scan QR Image
fileInput.addEventListener("change", (e) => {
  let file = e.target.files[0];
  //   console.log(file);

  if (!file) return;
  fetchRequest(file);
});

function fetchRequest(file) {
  let formData = new FormData();
  formData.append("file", file);

  p.innerText = "Scanning QR Code . . .😇";
  fetch(`https://api.qrserver.com/v1/read-qr-code/ `, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      //  console.log(result);

      let text = result[0].symbol[0].data;
      //   console.log(text);

      if (!text) {
        p.innerText = "Couden't find QR Code ☹️";
      }

      scannerDiv.classList.add("active");
      form.classList.add("active-img");

      img.src = URL.createObjectURL(file);
      textarea.innerText = text;
    });
}

// Scan QR code by Camera
let scanner;

camera.addEventListener("click", () => {
  camera.style.display = "none";
  form.classList.add("pointerEvents");
  p.innerText = "Scanning QR Code . . .😇";

  scanner = new Instascan.Scanner({ video: video });
  Instascan.Camera.getCameras()
    .then((cameras) => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]).then(() => {
          form.classList.add("active-video");
          stopCam.style.display = "inline-block";
        });
      } else {
        console.log("No Cameras Found");
      }
    })
    .catch((err) => console.error(err));

  scanner.addListener("scan", (c) => {
    scannerDiv.classList.add("active");
    textarea.innerText = c;
  });
});

// Copy Button
copyBtn.addEventListener("click", () => {
  let text = textarea.textContent;
  // console.log(text);
  navigator.clipboard.writeText(text);
  copyBtn.style.backgroundColor = "#dc143c";
  copyBtn.style.boxShadow = "15px 5px 5px black";
});

// Close Button
closeBtn.addEventListener("click", () => stopScan());
stopCam.addEventListener("click", ()=> stopScan());

function stopScan() {
  p.innerText = "Upload QR Code to scan";

  camera.style.display = "inline-block";
  stopCam.style.display = "none";

  closeBtn.style.backgroundColor = "#dc143c";
  closeBtn.style.boxShadow = "15px 5px 5px black";

  form.classList.remove("active-video" , "active-img", "pointerEvents");
  scannerDiv.classList.remove("active");
  form.classList.remove("active-img");
  if(scanner) scanner.stop();
}
