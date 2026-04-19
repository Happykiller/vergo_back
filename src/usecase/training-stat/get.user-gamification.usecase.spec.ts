import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { Inversify } from '@src/inversify/investify';
import { GetTrainingStatsByUserIdUsecase } from '@usecase/training-stat/get.training-stats-by-user.usecase';
import { GetUserGamificationUsecase } from '@usecase/training-stat/get.user-gamification.usecase';

describe('GetUserGamificationUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockGetTrainingStatsByUserIdUsecase: MockProxy<GetTrainingStatsByUserIdUsecase> =
    mock<GetTrainingStatsByUserIdUsecase>();

  mockInversify.getTrainingStatsByUserIdUsecase = mockGetTrainingStatsByUserIdUsecase;

  const usecase = new GetUserGamificationUsecase(mockInversify);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-19T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should compute league on a rolling 30-day window instead of current month', async () => {
    mockGetTrainingStatsByUserIdUsecase.execute.mockResolvedValue([
      {
        id: '1',
        training_id: 't1',
        start: '2026-04-08T01:08:22.277Z',
        end: '2026-04-08T01:19:22.277Z',
        durationInSeconds: 11 * 60,
        completed: true,
        created_at: '2026-04-08T01:19:22.277Z',
        user_id: 'user-1',
      },
      {
        id: '2',
        training_id: 't2',
        start: '2026-03-30T01:13:18.079Z',
        end: '2026-03-30T03:41:18.079Z',
        durationInSeconds: 148 * 60,
        completed: true,
        created_at: '2026-03-30T03:41:18.079Z',
        user_id: 'user-1',
      },
      {
        id: '3',
        training_id: 't3',
        start: '2026-03-18T08:00:00.000Z',
        end: '2026-03-18T09:40:00.000Z',
        durationInSeconds: 100 * 60,
        completed: true,
        created_at: '2026-03-18T09:40:00.000Z',
        user_id: 'user-1',
      },
    ]);

    const result = await usecase.execute('user-1');

    expect(result.league.minutes).toBe(159);
    expect(result.league.code).toBe('BRONZE');
    expect(result.league.threshold).toBe(60);
    expect(result.league.next?.code).toBe('SILVER');
    expect(result.weeklyLeague?.code).toBe('UNRANKED');
  });
});
