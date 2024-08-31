import { Device } from '@capacitor/device';

const getLanguage = async () => {
  const {value = null} = await Device.getLanguageTag();
  return value;
};

export default getLanguage;
