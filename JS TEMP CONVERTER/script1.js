function convert() { 
    let c=document.getElementById("Celcius").value;
    let f=(c*9/5)+32;
    document.getElementById("result").innerText=f + "🩼F";
}
   