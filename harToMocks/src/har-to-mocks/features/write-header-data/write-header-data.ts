const HEADER_PROPS = [
  'fetchNotices',
  'host_configs',
  'namespace',
  'org',
  'setHostConfigs',
  'setNamespace',
  'updateNotices',
  'setOrgParamsWS',
  'setPremiumStatus',
  'user',
  'deleteNotice',
  'notices',
  'show_profile_links',
  'fetchErrors',
  'errorsData',
  'use_new_showcase',
  'setUseNewShowcase',
  'permissions',
  'order_permissions',
  'use_keycloak',
  'setUseKeycloak',
  'esmp_enable',
  'fetchUserKeycloak',
];

const getPrintStringOfObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return `'${obj}'`;
  }

  if (obj === undefined || obj === null) {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return `[${obj.map((el) => getPrintStringOfObject(el)).join(',')}]`;
  }
  if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const stringKeys = Object.entries(obj).reduce((acc, [key, value]) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return acc + `${key}:${getPrintStringOfObject(value)},`;
    }, '');
    return `{${stringKeys}}`;
  }

  return obj;
};

export const getInfoTextFromJsonData = (jsonDataObject: any) => {
  return HEADER_PROPS.reduce((acc, propName) => {
    if (propName in jsonDataObject) {
      return (
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        acc + `const ${propName} = useMemo(()=>{ return ${getPrintStringOfObject(jsonDataObject[propName])}}, []);`
      );
    } else {
      return acc + `const ${propName} = props.${propName};`;
    }
  }, '');
};

export const infoHeaderPropsText =
  'Для локального воспроизведения начальных данных откройте файл в \nportal client/apps/portal/app/common/header/Header.tsx \nВместо деструктуризированных пропсов вставьте (props) \nВ начале компонента вставьете содержимое js файла (сначала рекомендуется его отформатировать) \nДобавьте импорт useMemo';
