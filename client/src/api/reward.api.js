
import createApiProvider from "../utils/api-utils/createApiProvider";
import baseUrl from './baseUrl'

const rewardApi = createApiProvider({
	url: `reward`,
	baseUrl
});

export default rewardApi