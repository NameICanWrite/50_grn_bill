
import createApiProvider from "../utils/api-utils/createApiProvider";
import baseUrl from './baseUrl'

const titleApi = createApiProvider({
	url: `title`,
	baseUrl
});

export default titleApi