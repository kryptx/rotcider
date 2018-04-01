'use strict';

let stages = [
  {
    maze: {
      branch_count: [ 1, 2 ],  // number of branches other than the main. [ min, max ]. Can be 0.
      branch_length: [ 3, 5 ], // number of rooms per branch. [ min, max ].
      branch_times: 3          // number of times to repeat this madness
    },
    stage_loot: [ 0, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
    stage_enemies: [ 0, 0, 0, 0, 0, 1 ],
    final_obstacle: {
      type: 'door',
      key: 4                   // held by the bandit
    }
  },
  {
    maze: {
      branch_count: [ 1, 1 ],  // number of branches other than the main. [ min, max ]. Can be 0.
      branch_length: [ 2, 3 ], // number of rooms per branch. [ min, max ].
      branch_times: 2          // number of times to repeat this madness
    },
    stage_loot: [ 0, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
    stage_enemies: [ 0, 0, 0, 0, 0, 1 ],
    final_obstacle: {
      type: 'monster',
      enemyId: 3                   // held by the bandit
    }
  }
];

module.exports = stages;