

/* import { showMessage } from "./index.js";
import { text } from "./index.js"; */
function Driver(driverId,name,age,car,budget){
    this.driverId=driverId;
    this.name=name;
    this.age=age;
    this.car=car;
    this.budget=budget;
   


};
const driver1= new Driver(1,"Nick",23,"Audi",20.00);
const driver2= new Driver(2,"Joash",23,"Volkswagen",30.00);
const driver3= new Driver(3,"Fabian",24,"BMW",40.00);

console.log(driver1)
//console.log(showMessage