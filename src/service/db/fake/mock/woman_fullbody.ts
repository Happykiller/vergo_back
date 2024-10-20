import { TrainingDbModel } from "@service/db/model/training.db.model";

export const woman_fullbody: TrainingDbModel = {
  "id": '65d4d015261e894a1da31a65',
  "slug": "women_fullbody_240805",
  "workout": [
    {
      "slug": "warm-up",
      "sets": [
        {
          "slugs": [
            "walk"
          ],
          "rep": 1,
          "duration": 120,
          "rest": 5
        },
        {
          "rep": 1,
          "slugs": [
            "arm_circles"
          ],
          "duration": 60,
          "rest": 5
        },
        {
          "rep": 1,
          "slugs": [
            "hip_circles"
          ],
          "duration": 60,
          "rest": 5
        },
        {
          "rep": 1,
          "slugs": [
            "shoulder_strech"
          ],
          "duration": 60,
          "rest": 20
        }
      ]
    },
    {
      "slug": "fullbody",
      "sets": [
        {
          "rep": 3,
          "rest": 60,
          "pause": 60,
          "sets": [
            {
              "rep": 8,
              "slugs": [
                "squat_5kg",
                "reverse_lunge_4kg",
                "plank_row_2kg",
                "military_press_5kg",
                "side_plank",
                "deadlift_10kg",
                "bicep_curl_5kg",
                "superwoman"
              ],
              "duration": 60,
              "rest": 20
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
          "slugs": [
            "shoulder_strech"
          ],
          "duration": 60
        },
        {
          "rep": 1,
          "slugs": [
            "quadriceps_stretch"
          ],
          "duration": 60
        },
        {
          "rep": 1,
          "slugs": [
            "ischio_stretch"
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
