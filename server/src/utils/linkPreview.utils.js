import { getLinkPreview, getPreviewFromContent } from "link-preview-js";


export default async function getLinkPreviewCustom({url, isImageNeeded}) {
  const {
    title,
    siteName,
    description,
    images = []
  } = await getLinkPreview(url, {
    headers: {
      // "user-agent": "googlebot"
    },
    followRedirects: `manual`,
    handleRedirects: (baseURL, forwardedURL) => {
      const urlObj = new URL(baseURL);
      const forwardedURLObj = new URL(forwardedURL);
      if (
        forwardedURLObj.hostname === urlObj.hostname ||
        forwardedURLObj.hostname === "www." + urlObj.hostname ||
        "www." + forwardedURLObj.hostname === urlObj.hostname
      ) {
        return true;
      } else {
        return false;
      }
    }
  })



  return {
    title,
    siteName,
    description,
    imageUrl: isImageNeeded ? images[0] : undefined
  }
}
// pass the link directly

