import path from 'path';
import { URL } from 'url';

import type { Entry } from '../../../types';

export const entrysToPathsWithData = (entrys: Entry[], targetPath: string) => {
  const resultObject = entrys.reduce<
    Record<
      string,
      { fileData: string; queryData: string | null; postData: string | null; fileName: string; status: number }[]
    >
  >((acc, el) => {
    const parsedUrl = new URL(el.request.url);
    const filePath = path.join(targetPath, parsedUrl.pathname);
    const fileName = `${el.request.method.toUpperCase()}.json`;

    const resultFileData = el.response.content.text;
    const status = el.response.status;
    const resultPostData = el.request.postData ? JSON.stringify(el.request.postData) : null;
    const resultQueryData = el.request.queryString?.length
      ? JSON.stringify(
          el.request.queryString.reduce<Record<string, string>>((acc, el) => {
            acc[el.name] = el.value;
            return acc;
          }, {}),
        )
      : null;

    if (!acc[filePath]) {
      acc[filePath] = [];
    }

    const isRequestAlreadyExist = acc[filePath]?.find(
      ({ fileData, queryData, postData }) =>
        fileData === resultFileData && queryData === resultQueryData && postData === resultPostData,
    );

    if (!isRequestAlreadyExist) {
      acc[filePath].push({
        fileData: resultFileData,
        queryData: resultQueryData,
        postData: resultPostData,
        fileName,
        status,
      });
    }
    return acc;
  }, {});

  return Object.entries(resultObject).map(([filePath, fileDataObject]) => {
    const fileName = fileDataObject?.[0]?.fileName;
    const resultFileData = fileDataObject.map(({ fileData, queryData, postData, status }) => ({
      fileData,
      queryData,
      postData,
      status,
    }));
    return { filePath, fileName, fileData: JSON.stringify(resultFileData) };
  });
};
