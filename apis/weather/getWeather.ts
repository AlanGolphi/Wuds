/**
 * @param {string} city
 */
export const getWeather = async (city: string) => {
  const uri = `https://api.seniverse.com/v3/weather/now.json?key=${process.env.SENIVERSE_PRIVATE_KEY}&location=${city}&language=zh-Hans&unit=c`;
  const data = await (await fetch(uri, {cache: 'no-store'})).json() as Weather
  return data?.results?.[0];
};

interface Weather {
  results: {
    location: {
      id: string;
      name: string;
      country: string;
      path: string;
      timezone: string;
      timezone_offset: string;
    };
    now: {
      text: string;
      code: string;
      temperature: string;
    };
    last_update: string;
  }[];
}
