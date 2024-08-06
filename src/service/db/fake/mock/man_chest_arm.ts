import { TrainingDbModel } from "@service/db/model/training.db.model";

export const man_chest_arm: TrainingDbModel = {
  "id": '65d4d015261e894a1da31a65',
  "slug": "man_chest_arm_240806",
  "workout": [
    {
      "slug": "warm-up",
      "sets": [
        {
          "rep": 4,
          "slugs": [
            "man_jumping_jacks",
            "arm_circles",
            "dynamic_chest_stretch",
            "shoulder_shrugs"
          ],
          "duration": 40,
          "rest": 20,
          "pause": 60
        }
      ]
    },
    {
      "slug": "chest_harm",
      "sets": [
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "standing_dumbbell_shoulder_press"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "lateral_raises"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "bent-over_reverse_flyes"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "bicep_curls"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "tricep_dips"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "hammer_curls"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "dumbbell_press"
          ]
        },
        {
          "rep": 3,
          "duration": 40,
          "rest": 60,
          "slugs": [
            "push-ups"
          ]
        }
      ]
    },
    {
      "slug": "cooldown",
      "sets": [
        {
          "rep": 1,
          "slugs": [
            "Chest Stretch"
          ],
          "sets": [
            {
              "rep": 2,
              "slugs": [
                "left",
                "right"
              ],
              "duration": 30
            }
          ]
        },
        {
          "rep": 1,
          "slugs": [
            "shoulder_stretch"
          ],
          "sets": [
            {
              "rep": 2,
              "slugs": [
                "left",
                "right"
              ],
              "sets": [
                {
                  "rep": 3,
                  "duration": 10
                }
              ]
            }
          ]
        },
        {
          "rep": 1,
          "slugs": [
            "bicep_stretch"
          ],
          "duration": 60
        },
        {
          "rep": 1,
          "slugs": [
            "child_s_pose"
          ],
          "duration": 60
        }
      ]
    }
  ]
};
