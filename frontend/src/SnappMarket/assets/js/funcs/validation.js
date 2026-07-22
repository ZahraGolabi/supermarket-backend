
const validations=(phone)=>{
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone.trim())
}



export {validations}