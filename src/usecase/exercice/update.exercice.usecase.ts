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
    const exercice = await this.inversify.bddService.updateExercice({
      id: dto.exercice.id,
      slug: dto.exercice.slug,
      image: dto.exercice.image,
      title: dto.exercice.title,
      description: dto.exercice.description,
      creator_id: dto.session.id,
      contributors_id: [dto.session.id]
    });
    return exercice;
  }
}
