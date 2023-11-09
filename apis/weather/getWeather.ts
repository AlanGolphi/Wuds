/**
 * @param {string} city
 * @returns {Promise<Weather | null>}
 */
export const getWeather = async (city: string) => {
  try {
    const uri = `https://api.seniverse.com/v3/weather/now.json?key=${process.env.SENIVERSE_PRIVATE_KEY}&location=${city}&language=zh-Hans&unit=c`;
    const data = await (await fetch(uri, {cache: 'no-store'})).json() as Weather
    return data?.results?.[0];
  } catch (e) {
    return null
  }
};
