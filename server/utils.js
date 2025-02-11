const getIsDeepEqual = (data1, data2) => {
  if (typeof data1 !== typeof data2) {
    return false;
  }

  if (data1 === null || data2 === null) {
    return data1 === data2;
  }

  if (typeof data1 !== 'object') {
    return data1 === data2;
  }
  if (Array.isArray(data1) && Array.isArray(data2)) {
    if (data1.length !== data2.length) {
      return false;
    }

    return data1.every((el1, index) => getIsDeepEqual(el1, data2[index]));
  }

  const data1Keys = Object.keys(data1);
  const data2Keys = Object.keys(data2);

  if (data1Keys.length !== data2Keys.length) {
    return false;
  }

  return data1Keys.every((key) => {
    if (key.includes('title')) {
      return true;
    }
    return getIsDeepEqual(data1[key], data2[key]);
  });
};

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

const getPrintStringOfObject = (obj) => {
  if (typeof obj === 'string') {
    return `'${obj}'`;
  }

  if (obj === undefined || obj === null) {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map((el) => getPrintStringOfObject(el)).join(',')}]`;
  }
  if (typeof obj === 'object') {
    const stringKeys = Object.entries(obj).reduce((acc, [key, value]) => {
      return acc + `${key}:${getPrintStringOfObject(value)},`;
    }, '');
    return `{${stringKeys}}`;
  }

  return obj;
};

const getInfoTextFromJsonData = (jsonDataObject) => {
  return HEADER_PROPS.reduce((acc, propName) => {
    if (propName in jsonDataObject) {
      return (
        acc +
        `const ${propName} = useMemo(()=>{ return ${getPrintStringOfObject(
          jsonDataObject[propName]
        )}}, []);`
      );
    } else {
      return acc + `const ${propName} = props.${propName};`;
    }
  }, '');
};

module.exports = { getIsDeepEqual, getInfoTextFromJsonData };
