function calculateBMI(){
    const w=document.getElementById("weight").value ;
    const h=document.getElementById("height").value ;



if(w ===""||h===""){
    document.getElementById("result1").innerText="Please enter both the values";
    return;
}

const bmi=w/(h*h);
let msg="";

if(bmi<18.5) msg="Underweight";
else if(bmi<24.9) msg="Normal weight";
else if(bmi<29.9) msg="Overweight";
else msg="obesity";

document.getElementById("result1").innerText=`Your BMI :${bmi.toFixed(2)} (${msg})`;
}