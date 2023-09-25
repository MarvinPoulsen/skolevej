
const schoolsMinimapIdParam = '[module.school_road.minimapid]';
const schoolsMinimapIdDev = '6fb06b4c-3b2f-4486-b628-d715cada260d';
export const schoolsMinimapId = schoolsMinimapIdParam.includes('[') ? schoolsMinimapIdDev : schoolsMinimapIdParam;
