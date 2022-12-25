
import createApiProvider from "../utils/api-utils/createApiProvider";
import baseUrl from './baseUrl'

const postsApi = createApiProvider({
	url: `post`,
	baseUrl
});

export default postsApi