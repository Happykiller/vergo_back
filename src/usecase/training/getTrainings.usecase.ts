// src\usecase\training\getTrainings.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';

export class GetTrainingsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto?: {
    private?: boolean;
    session?: {
      id: string;
      code: string;
      role: string;
    };
  }): Promise<TrainingUsecaseModel[]> {
    let entities: TrainingUsecaseModel[] = await this.inversify.bddService.getTrainings();

    if (dto) {
      const user = await this.inversify.getUserUsecase.execute({ id: dto.session.id });
      entities = entities.filter((entity) => entity.isPrivate && entity.invites_id.includes(user.id));
    } else {
      entities = entities.filter((entity) => !entity.isPrivate);
    }

    return entities;
  }
}
