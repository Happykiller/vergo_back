import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { Inversify } from '@src/inversify/investify';
import { GetTrainingStatsByUserIdUsecase } from '@usecase/training-stat/get.training-stats-by-user.usecase';
import { GetTrainingVolumeUsecase } from '@usecase/training-stat/get.training-volume.usecase';

describe('GetTrainingVolumeUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockGetTrainingStatsByUserIdUsecase: MockProxy<GetTrainingStatsByUserIdUsecase> =
    mock<GetTrainingStatsByUserIdUsecase>();

  mockInversify.getTrainingStatsByUserIdUsecase = mockGetTrainingStatsByUserIdUsecase;

  const usecase = new GetTrainingVolumeUsecase(mockInversify);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-19T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should aggregate minutes and hours across rolling periods', async () => {
    mockGetTrainingStatsByUserIdUsecase.execute.mockResolvedValue([
      {
        id: '1',
        training_id: 't1',
        start: '2026-04-18T12:00:00.000Z',
        end: '2026-04-18T13:00:00.000Z',
        durationInSeconds: 3600,
        completed: true,
        created_at: '2026-04-18T13:00:00.000Z',
        user_id: 'user-1',
      },
      {
        id: '2',
        training_id: 't2',
        start: '2026-04-01T12:00:00.000Z',
        end: '2026-04-01T14:30:00.000Z',
        durationInSeconds: 9000,
        completed: true,
        created_at: '2026-04-01T14:30:00.000Z',
        user_id: 'user-1',
      },
      {
        id: '3',
        training_id: 't3',
        start: '2026-02-20T12:00:00.000Z',
        end: '2026-02-20T14:00:00.000Z',
        durationInSeconds: 7200,
        completed: true,
        created_at: '2026-02-20T14:00:00.000Z',
        user_id: 'user-1',
      },
      {
        id: '4',
        training_id: 't4',
        start: '2025-11-01T12:00:00.000Z',
        end: '2025-11-01T13:30:00.000Z',
        durationInSeconds: 5400,
        completed: true,
        created_at: '2025-11-01T13:30:00.000Z',
        user_id: 'user-1',
      },
      {
        id: '5',
        training_id: 't5',
        start: '2025-03-01T12:00:00.000Z',
        end: '2025-03-01T14:00:00.000Z',
        durationInSeconds: 7200,
        completed: true,
        created_at: '2025-03-01T14:00:00.000Z',
        user_id: 'user-1',
      },
    ]);

    const result = await usecase.execute('user-1');

    expect(result.last15Days).toEqual({ sessionsCount: 1, minutes: 60, hours: 1 });
    expect(result.last30Days).toEqual({ sessionsCount: 2, minutes: 210, hours: 3.5 });
    expect(result.last90Days).toEqual({ sessionsCount: 3, minutes: 330, hours: 5.5 });
    expect(result.last6Months).toEqual({ sessionsCount: 4, minutes: 420, hours: 7 });
    expect(result.last1Year).toEqual({ sessionsCount: 4, minutes: 420, hours: 7 });
  });
});
