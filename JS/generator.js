"use strict"

const generatorDiv = document.querySelector(".generator");
const generatorBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = generatorDiv.querySelector(".generator-form input");
const qrImg = generatorDiv.querySelector(".generator-img img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .btn-link");

let imgURL ="";

generatorBtn.addEventListener("click" , () =>{
    let qrValue = qrInput.value;
    // console.log(qrValue)

    if(!qrValue.trim()) return;    // If value empty -> stop here
    generatorBtn.innerHTML = "Generating QR Code . . .😇"

    // If value is valid -> using qrserver API -> to generate QR Code
    imgURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data= ${qrValue}`;
    // console.log(imgURL)
    qrImg.src = imgURL;

    qrImg.addEventListener("load" , ()=>{
        generatorDiv.classList.add("active");
        generatorBtn.innerHTML = "Generate QR Code"
    })
})


// Download Qr 
downloadBtn.addEventListener("click" , ()=>{
    if(!imgURL) return;
    fetchImage(imgURL);
})

function fetchImage(url){
    fetch(url).then(res => res.blob()).then(file => {
        console.log(file);
        let tempFile = URL.createObjectURL(file);
        let file_name = url.split("/").pop().split(".")[0];
        let extension = file.type.split("/")[1];
        download(tempFile , file_name , extension);
    })
    .catch(()=> imgURL='');
}

function download(tempFile , file_name , extension){
    let a = document.createElement('a');
    a.href = tempFile;
    a.download = `${file_name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}