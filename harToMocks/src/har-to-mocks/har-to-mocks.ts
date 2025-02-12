import * as cheerio from 'cheerio';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';

import { getInfoTextFromJsonData, infoHeaderPropsText, resultTable, writeMocks } from './features';
import type { Entry, Filter, Har, Logger } from './types';

export class HarToMocksProcess {
  public data: Entry[] = [];
  public headerData = '';

  constructor(private log: Logger) {}

  /**
   * Extract `Entrys`, filter by flags and return to another process
   * @param {JSON} fileContent har as JSON
   * @param {object} filter flags
   */
  extract(fileContent: Har, filter: Filter) {
    const { methods, resourceType, url } = filter;
    const { entries } = fileContent.log;

    entries.forEach((entry) => {
      if (entry._resourceType === 'document') {
        if (typeof entry.response.content.text !== 'string') {
          return;
        }

        const $ = cheerio.load(entry.response.content.text);
        const headerData =
          $('.js-react-on-rails-component').prop('data-props') || $('script[class=js-react-on-rails-component]').html();
        if (headerData) {
          this.headerData = headerData;
          const stars = new Array(150).join('*');
          console.log(stars);
          console.log('\nHEADER DATA WAS FOUND. YOU CAN write command "make props" in directory of container. And then open /result folder\n');
          console.log(stars);
        }
      }
    });
    let filtred: Entry[] = entries;

    // Filter by user input in the flow:
    if (url) {
      filtred = filtred.filter((e) => e.request.url.includes(url));
    }

    if (resourceType) {
      filtred = filtred.filter((e) => e._resourceType === resourceType);
    }

    if (methods) {
      filtred = filtred.filter((e) => methods.includes(e.request.method));
    }

    // Log table with content
    this.log('\nFiltered requests:\n');
    resultTable(filtred, this.log);

    this.data = filtred;
  }

  writeHeaderData(targetPath: string) {
    if (this.headerData) {
      const filePath = path.join(targetPath, 'api/headerProps');
      ensureDirSync(filePath);
      writeFileSync(path.join(filePath, 'header.json'), this.headerData);
      try {
        const result = getInfoTextFromJsonData(JSON.parse(this.headerData));
        writeFileSync(path.join(filePath, 'header.js'), result);
        writeFileSync(path.join(filePath, 'readme.md'), infoHeaderPropsText);
      } catch (error) {
        console.log('error', error);
      }
      this.log(`HEADER DATA has been written to ${path.join(filePath, 'header.json')}`);
    } else {
      this.log('NO HEADER data found.');
    }
  }

  write(targetPath: string, isDryRun = false) {
    this.writeHeaderData(targetPath);
    writeMocks(targetPath, this.data, this.log, { isDryRun });
  }
}
