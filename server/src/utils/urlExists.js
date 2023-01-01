import axios from "axios"

const urlExists = async (url) => {
  // console.log(url);
  let errStatus
  let res= await axios.get(url, {withCredentials: true}).catch(err => errStatus = err?.response?.status)
  
  
  if (res?.status == 200 || (errStatus && errStatus != 404)) return true
  else return false
 }

 export default urlExists

