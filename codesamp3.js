import React from 'react';


const DeliveryOnly = ({

myemail,
myname,
myphone,
myaddress,
mypostalcode,
selectedDate,
selectedTime,
deliveryInstructions,
save,
handleAddress,
handleDeliveryInstructionsChange,
handleEmail,
handleName,
handlePhone,
handlePostalCode,
setSelectedCity,
selectedCity,
setSelectedDate,
setSelectedTime,
loading7,
error7,
data7,
alldates
}) => {

  

  const timeAvailable = (timeList) => {
    if(!loading7&&!error7&&data7){
     const thistime= data7.getCurrentTimeMill
     const treshold = (thistime.currentTimeMill*1) + (24 * 60 * 60 * 1000)
    
      const time = timeList.timeMill;
      
   if (time < treshold){
     return false;
   }
   
     if (timeList.isPicked===true){
       const thistime= data7.getCurrentTimeMill
     
   
       const timePicked = timeList.timePickedMill;
       return (timePicked*1) + 12 *60* 1000 < (thistime.currentTimeMill*1); // 12 minutes have passed
     }else{
         return true
     }
    }else{
     return false
    }
   
   };
   
   
   
   
   const dates= alldates.filter((date) => {
   
     if (!loading7&&!error7&&data7) {
       const thistime= data7.getCurrentTimeMill
       
       const Date = date.dateMill;
       
       const oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
     
       return (Date - thistime.currentTimeMill) >=oneDay;
     } else {
       return false
     }
   
   });

return (

  <div className='inputdiv'>
  <label htmlFor="time">*Delivery Time:</label>
  <select className="deliveryT" id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
  <option value="">Select a time</option>
  {selectedDate &&
  !loading7 && 
  !error7 && 
  dates
  .find((date) => date.date === selectedDate)
  ?.timeList.filter(timeAvailable)
  .map((time) => {
  return (
  <option key={time.time} value={time.time}>
  {time.timeInt}
  </option>
  );
})}
  </select>
  </div>
)

}

export default DeliveryOnly;