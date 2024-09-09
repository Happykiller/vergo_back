import { TrainingDbModel } from "@service/db/model/training.db.model";

export const training_test: TrainingDbModel = {
  "id": '65d4d015261e894a1da31a65',
  "slug": "training_test",
  "workout": [
    {
      "slug": "warm-up",
      "sets": [
        {
          "slugs": ["jumping_jacks"],
          "rep": 1,
          "duration": 5,
          "rest": 6
        },
        {
          "rep": 3,
          "slugs": ["arm_circles", "bodyweight_squats", "high_knees"],
          "duration": 5,
          "rest": 4,
          "pause": 6
        }
      ]
    },
    {
      "slug": "workout",
      "sets": [
        {
          "rep": 2,
          "rest": 6,
          "pause": 6,
          "sets": [
            {
              "rep": 4,
              "slugs": ["burpees", "mountain_climbers"],
              "duration": 5,
              "rest": 4
            }
          ]
        }
      ]
    },
    {
      "slug": "cooldown",
      "sets": [
        {
          "rep": 1,
          "slugs": ["shoulder_stretch"],
          "sets": [
            {
              "rep": 2,
              "slugs": ["left", "right"],
              "sets": [
                {
                  "rep": 3,
                  "duration": 5
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
