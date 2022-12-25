import createApiProvider from "../utils/api-utils/createApiProvider";
import baseUrl from './baseUrl'

const userProfileApi = createApiProvider({
  url: `user`,
  baseUrl
});

export default userProfileApi