import * as path from 'path';
import * as fs from 'fs';
import { CliInput, ArchivedConfig } from '../../types';
import { error } from '../error';
import { getConfig } from '../get-config';
import { version as systematicVersion } from '../../../package.json';

export function archive(input: CliInput) {
  const config = getConfig(input);
  if (!config) return;

  try {
    (config as ArchivedConfig).__archived = {
      archiveDate: new Date().toISOString(),
      systematicVersion
    };

    const { version } = config.system;
    const { archiveDirectory } = config.output;
    const fileName = `system.v${version}.json`;
    const dirPath = path.resolve(process.cwd(), archiveDirectory);
    const filePath = path.resolve(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    if (fs.existsSync(filePath)) {
      error(
        `File already exists: ${filePath}\n\n` +
          'If you really want to replace this file, delete it and try this command again.'
      );
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    process.exit(0);
  } catch (err) {
    error(err);
  }
}
