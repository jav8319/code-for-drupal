# code-for-drupal





A react component named DeliveryOnly.The select input field is rendered .The onChange event is assigned a callback function that updates the selected time using the setSelectedTime function. Within the select input field, If selectedDate is truthy and the data loading and error states (loading7 and error7) are false and the dates array has valid data, a filtering operation is performed on dates using the timeAvailable function.The dates array is filtered to include only dates that are at least one day in the future compared to the current time. This is done by comparing the milliseconds value of the date with the current time.For each valid date, the timeList array is further filtered using the timeAvailable function, which checks if a time is available for selection. It returns true if the time is in the future and has not been picked before, or if it is picked but more than 12 minutes have passed since it was picked.
The filtered timeList array is then mapped to options in the select input field. Each option has a unique key set to time.time and displays the timeInt value as its text. This code was implemented in the web page of a food bussiness website to set the delivery time of an order. See live URl https://www.bitelandia.com/

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
       return (timePicked*1) + 12 *60* 1000 < (thistime.currentTimeMill*1); // 30 minutes have passed
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
