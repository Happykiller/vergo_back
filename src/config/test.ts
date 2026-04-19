import { DeepPartial } from '@happykiller/sunny-apis';
import { Configuration } from '@src/config/configuration';

const conf: DeepPartial<Configuration> = {
  env: {
    mode: 'test',
  },
};

export { conf };
