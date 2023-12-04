const checkEmail = (email) => {
    return  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

const checkPassword =  (password)=>{
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
}

export {checkEmail ,checkPassword}