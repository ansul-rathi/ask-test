import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async (props) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await props.requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
