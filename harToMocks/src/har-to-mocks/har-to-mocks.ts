import * as cheerio from 'cheerio';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';

import { resultTable, writeMocks } from './features';
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
        const $ = cheerio.load(entry.response.content.text);
        this.headerData =
          $('.js-react-on-rails-component').prop('data-props') ||
          $('script[class=js-react-on-rails-component]').html() ||
          '';
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
    const filePath = path.join(targetPath, 'api/headerProps');
    ensureDirSync(filePath);
    writeFileSync(path.join(filePath, 'header.json'), this.headerData);
    this.log(`Header data has been written to ${path.join(filePath, 'header.json')}`);
  }

  write(targetPath: string, isDryRun = false) {
    this.writeHeaderData(targetPath);
    writeMocks(targetPath, this.data, this.log, { isDryRun });
  }
}
