import axios from "axios"

const urlExists = async (url) => {
  // console.log(url);
  let res
  try {
    res = await axios.get(url)
  } catch {
    return false
  }
  
  if (res.status == 200) return true
  else return false
 }

 export default urlExists