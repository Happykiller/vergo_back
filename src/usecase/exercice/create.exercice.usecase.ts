import { Inversify } from '@src/inversify/investify';
import { ExerciceUsecaseModel } from '@usecase/exercice/model/exercice.usecase.model';
import { CreateExerciceUsecaseDto } from '@usecase/exercice/dto/create.exercice.usecase.dto';

export class CreateExerciceUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: CreateExerciceUsecaseDto,
  ): Promise<ExerciceUsecaseModel> {
    const exercice = await this.inversify.bddService.createExercice({
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
