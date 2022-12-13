import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export async function getAllNamesInFreelancehuntProject() {
  const bids = (await axios({
    method: 'get',
    url: `https://api.freelancehunt.com/v2/projects/${process.env.FREELANCEHUNT_PROJECT_ID}/bids`,
    headers: { 
      'Authorization': 'Bearer ' + process.env.FREELANCEHUNT_API_KEY
    }
})).data.data

const logins = bids.map(bid => bid.attributes.freelancer?.login?.toLowerCase())

return logins
}

export async function isNameInFreelancehuntProject(name) {

const logins = await getAllNamesInFreelancehuntProject()
return logins.includes(name)
}

