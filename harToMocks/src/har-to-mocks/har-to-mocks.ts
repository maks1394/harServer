import { resultTable, writeMocks } from './features';
import type { Entry, Filter, Har, Logger } from './types';

export class HarToMocksProcess {
  public data: Entry[] = [];

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
      const json = JSON.stringify(entry);
      const div = json.match(/<div class=.{0,2}js-react-on-rails-component.+<\/div>/);
      const dataProps = div?.[0].match(/data-props.+"/);
      if (json.includes('js-react-on-rails-component')) {
        // console.log(dataProps?.[0]);
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

  write(targetPath: string, isDryRun = false) {
    writeMocks(targetPath, this.data, this.log, { isDryRun });
  }
}
