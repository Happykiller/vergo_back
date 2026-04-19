import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { ExerciceUsecaseModel } from '@usecase/exercice/model/exercice.usecase.model';
import { UpdateExerciceUsecaseDto } from '@usecase/exercice/dto/update.exercice.usecase.dto';

export class UpdateExerciceUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: UpdateExerciceUsecaseDto,
  ): Promise<ExerciceUsecaseModel> {
    const existing = await this.inversify.bddService.getExercice({ id: dto.exercice.id });

    if (!existing?.contributors_id?.includes(dto.session.id)) {
      throw new Error(ERRORS.UPDATE_EXERCICE_NOT_ALLOWED);
    }

    return this.inversify.bddService.updateExercice({
      id: dto.exercice.id,
      slug: dto.exercice.slug,
      image: dto.exercice.image,
      title: dto.exercice.title,
      description: dto.exercice.description,
    });
  }
}
