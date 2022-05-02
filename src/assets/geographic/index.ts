import provinceList from './province.json';
import cityMap from './city.json';

interface ICity {
  id: string;
  name: string;
  province: string;
}

const provinceMap: Record<string, string> = {};
provinceList.forEach((province) => {
  provinceMap[province.id] = province.name;
  provinceMap[province.name] = province.id;
});

/** 根据省份名称获取城市列表 */
export const getCityListByProvinceName = (provinceName: string): ICity[] => {
  const provinceId = provinceMap[provinceName];
  if (provinceId) {
    return cityMap[provinceId] || [];
  }
  return [];
};

export { provinceList, cityMap };
