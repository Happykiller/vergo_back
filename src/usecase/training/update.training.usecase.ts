import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UpdateTrainingUsecaseDto } from '@usecase/training/dto/update.training.usecase.dto';

export class UpdateTrainingUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: UpdateTrainingUsecaseDto,
  ): Promise<boolean> {
    const training = await this.inversify.getTrainingUsecase.execute({
      id: dto.training.id,
    });

    if (!(training?.contributors_id?.find(contributor_id => contributor_id === dto.session.id))) {
      throw new Error(ERRORS.UPDATE_TRAINING_NOT_ALLOWED);
    }

    if (training) {
      await this.inversify.bddService.updateTraining({
        id: dto.training.id,
        slug: dto.training.slug,
        label: dto.training.label,
        gender: dto.training.gender,
        workout: dto.training.workout
      });

      return true;
    } else {
      return null;
    }
  }
}
