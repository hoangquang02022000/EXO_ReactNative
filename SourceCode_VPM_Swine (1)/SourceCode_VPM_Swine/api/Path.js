let DOMAIN = 'https://webservice.cp.com.vn/vpm_swine/';
// let DOMAIN = 'http://172.21.73.64:8080/';
let API = DOMAIN + 'api/';
let API_CENTER = 'https://webservice.cp.com.vn/TemperatureOnline/api/getlistsql';
let IMAGE = DOMAIN + 'upload/';
let DataBaseName = '0x02000000928D0CDD62DC7132E97A8C5F6772FAB5B24428F6B4EDDE35BBB4EB768F70828265ECC367B45269D72F7D3086B18D853B';
//0x02000000084CD022DFDB5CF3FAE1C9F4A612BA5822B91E84C9C626F59B7687A326FE1A7E44F286B6F07BA2E5D396DA517798BDC4
//0x02000000928D0CDD62DC7132E97A8C5F6772FAB5B24428F6B4EDDE35BBB4EB768F70828265ECC367B45269D72F7D3086B18D853B
export const Path = {
    API,
    API_CENTER,
    IMAGE,
    Product: IMAGE + 'product/',
    DataBaseName,
};