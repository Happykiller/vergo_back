import { Inversify } from '@src/inversify/investify';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';

export class GetTrainingsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto?: {
    private?: boolean,
    session?: {
      id: string;
      code: string;
      role: string;
    }
  }): Promise<TrainingUsecaseModel[]> {
    let entities: TrainingUsecaseModel[] =
      await this.inversify.bddService.getTrainings();

    if(dto) {
      const user = await this.inversify.getUserUsecase.execute({id: dto.session.id});

      console.log(entities.map(entity => {
        return {
        id: entity.id,
        isPrivate: entity.isPrivate
      }}))

      console.log(user, user.private_trainings)
      if(user.private_trainings) {
        entities = entities.filter(entity => (entity.isPrivate && user.private_trainings.includes(entity.id)));
      } else {
        entities = [];
      }
    } else {
      entities = entities.filter(entity => !entity.isPrivate);
    }
      
    return entities;
  }
}
