
import createApiProvider from "../utils/api-utils/createApiProvider";
import baseUrl from './baseUrl'

const userApi = createApiProvider({
	url: `user`,
	baseUrl
});

export default userApi