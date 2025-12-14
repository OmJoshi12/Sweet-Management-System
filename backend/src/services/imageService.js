const ALLOWED_REMOTE_IMAGE_URLS = [
  'https://t3.ftcdn.net/jpg/08/90/02/30/240_F_890023062_ty9ZsOIEqlEDAH37Hgo4771Y2zmUd12V.jpg',
  'https://t4.ftcdn.net/jpg/16/46/57/59/240_F_1646575973_nMFe3pOTs5KZ5vWtGhL8jT4qIJSNK2Z6.jpg',
  'https://t3.ftcdn.net/jpg/08/31/16/46/240_F_831164686_pUWy1nbkh8NCbw2S1GrBQnqs5Uyk4Ijf.jpg',
  'https://t3.ftcdn.net/jpg/15/85/29/96/240_F_1585299670_DuPeMCihred0bmUka9tgBqfAPBqQwQ5y.jpg',
  'https://t3.ftcdn.net/jpg/06/29/98/58/240_F_629985879_GJNIb1gJlZnbJ003toSHzuIRkoEQBC3M.jpg',
];

const isAllowedImageHost = (url) => {
  try {
    if (typeof url === 'string' && url.startsWith('/static/')) return true;
    return ALLOWED_REMOTE_IMAGE_URLS.includes(String(url));
  } catch {
    return false;
  }
};

const isValidStaticImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('/static/')) return true;
  return isAllowedImageHost(url);
};

module.exports = { isValidStaticImageUrl, isAllowedImageHost };
