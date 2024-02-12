import { countryCodeEmoji } from "country-code-emoji";
import getCountryISO2 from "country-iso-3-to-2";

export const getCountryEmoji = (alpha3: string) => {
	const alpha2 = getCountryISO2(alpha3);
	if (alpha2) {
		return countryCodeEmoji(alpha2);
	} else {
		return "🏳️";
	}
};
