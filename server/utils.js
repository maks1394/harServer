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

module.exports = { getIsDeepEqual };
