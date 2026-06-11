export const SITE_NAME = "CueSync";
export const SITE_DOMAIN = "cuesync.pro";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const CATALOGUE_URL = `${SITE_URL}/shop`;

export function getProductShopUrl(productId: string) {
  return `${SITE_URL}/shop/${productId}`;
}

export function buildWishlistProductSms(
  customerName: string,
  productName: string,
  productId?: string,
) {
  const url = productId ? getProductShopUrl(productId) : CATALOGUE_URL;
  return `Hi ${customerName}, good news — "${productName}" is available at CueSync: ${url}`;
}
