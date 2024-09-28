import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';

export class GetImagesTokenizedUsecase {
  common: Common;
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    this.common = new Common(inversify);
  }

  async execute(): Promise<string[][]> {
    const results = await this.common.getFileList();
    return results.map(result => result.words);
  }
}
