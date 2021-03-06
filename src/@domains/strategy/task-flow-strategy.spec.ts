import { TaskFlowStrategy } from './task-flow-strategy';
import { MOVE_TYPE } from './types';
import { COLUMN_TYPE } from './types/column-type';
import { IRole, ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

describe('task-flow-strategy', () => {
  let strategy;

  describe('steps', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('columns count', () => {
        expect(strategy.steps.length).toBe(4);
      });
    });

    describe('ADVANCED', () => {
      describe('ARCHITECT', () => {
        beforeEach(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT]);
        });
        it('columns count', () => {
          expect(strategy.steps.length).toBe(15);
        });
      });
    });
  });

  describe('columns', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('columns count', () => {
        expect(strategy.columns.length).toBe(4);
      });
    });

    describe('ADVANCED', () => {
      describe('ARCHITECT', () => {
        beforeEach(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT]);
        });
        it('columns count', () => {
          expect(strategy.columns.length).toBe(6);
        });

        it('first column moves', () => {
          expect(strategy.columns[0].moves).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: MOVE_TYPE.PUSH_FORWARD,
              }),
            ])
          );
        });
      });

      describe('DEVELOPER', () => {
        beforeEach(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.DEVELOPER]);
        });
        it('columns count', () => {
          expect(strategy.columns.length).toBe(6);
        });

        it('first column', () => {
          expect(strategy.columns[0]).toEqual(
            expect.objectContaining({
              column: COLUMN_TYPE.BACK_LOG,
              moves: [],
            })
          );
        });

        it('second column', () => {
          expect(strategy.columns[1]).toEqual(
            expect.objectContaining({
              column: COLUMN_TYPE.PREPARING,
              moves: expect.arrayContaining([
                expect.objectContaining({
                  type: MOVE_TYPE.PUSH_FORWARD,
                  to: STATUS_NAME.READY_TO_DO,
                }),
                expect.objectContaining({
                  type: MOVE_TYPE.BRING_BACK,
                  to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
                }),
              ]),
            })
          );
        });
      });
    });
  });

  describe('availableStatuses', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('empty roles', () => {
        expect(strategy.availableStatuses.length).toBe(4);
      });
    });

    describe('ADVANCED', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, []);
      });

      it('undefined roles', () => {
        expect(strategy.availableStatuses.length).toBe(13);
      });
    });
  });

  describe('getCreatedStatus', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('default STATUS_NAME', () => {
        expect(strategy.getCreatedStatus()).toBe(STATUS_NAME.READY_TO_DO);
      });

      it('STATUS_NAME.CREATING', () => {
        expect(strategy.getCreatedStatus(STATUS_NAME.CREATING)).toBe(STATUS_NAME.CREATING);
      });

      it('STATUS_NAME.READY_TO_DO', () => {
        expect(strategy.getCreatedStatus(STATUS_NAME.READY_TO_DO)).toBe(STATUS_NAME.READY_TO_DO);
      });

      it('STATUS_NAME.TESTING', () => {
        expect(strategy.getCreatedStatus(STATUS_NAME.TESTING)).toBe(STATUS_NAME.TESTING);
      });

      it('STATUS_NAME.DONE', () => {
        expect(strategy.getCreatedStatus(STATUS_NAME.DONE)).toBe(STATUS_NAME.DONE);
      });

      it('invalid STATUS_NAME', () => {
        expect(() => {
          strategy.getCreatedStatus(STATUS_NAME.ASSIGNING_RESPONSIBLE);
        }).toThrow();
      });
    });

    describe('ADVANCED', () => {
      strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT]);

      Object.values(strategy.roles).forEach(({ id: roleName, createdStatus }: IRole) => {
        describe(roleName, () => {
          beforeEach(() => {
            strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [roleName]);
          });

          it('default STATUS_NAME', () => {
            expect(strategy.getCreatedStatus()).toBe(createdStatus);
          });

          Object.values(STATUS_NAME).forEach((status) => {
            it(`current STATUS_NAME="${status}" must be converted to STATUS_NAME.CREATING`, () => {
              expect(strategy.getCreatedStatus(status)).toBe(createdStatus);
            });
          });
        });
      });
    });
  });

  describe('canBeStarted', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('STATUS_NAME.CREATING', () => {
        expect(strategy.canBeStarted(STATUS_NAME.CREATING)).toBeTruthy();
      });

      it('STATUS_NAME.READY_TO_DO', () => {
        expect(strategy.canBeStarted(STATUS_NAME.READY_TO_DO)).toBeTruthy();
      });

      it('STATUS_NAME.TESTING', () => {
        expect(strategy.canBeStarted(STATUS_NAME.TESTING)).toBeTruthy();
      });

      it('STATUS_NAME.DONE', () => {
        expect(strategy.canBeStarted(STATUS_NAME.DONE)).toBeFalsy();
      });
    });
  });

  describe('SIMPLE strategy', () => {
    beforeEach(() => {
      strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
    });

    describe('canBeMoved', () => {
      it('from CREATING', () => {
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.TESTING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from READY_TO_DO', () => {
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.CREATING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.TESTING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from TESTING', () => {
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.CREATING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from DONE', () => {
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.CREATING)).toBeFalsy();
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.TESTING)).toBeTruthy();
      });
    });

    describe('userStrategyRoles', () => {
      it('common', () => {
        expect(strategy.userStrategyRoles).toEqual([undefined]);
      });
    });
  });

  describe('ADVANCED strategy', () => {
    describe('canBeMoved', () => {
      describe('ARCHITECT', () => {
        beforeAll(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.ARCHITECT);
        });

        it('CREATING -> ESTIMATION_BEFORE_ASSIGNING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING)).toEqual(
            STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING
          );
        });

        it('ESTIMATION_BEFORE_ASSIGNING -> ASSIGNING_RESPONSIBLE', () => {
          expect(
            strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING, STATUS_NAME.ASSIGNING_RESPONSIBLE)
          ).toEqual(STATUS_NAME.ASSIGNING_RESPONSIBLE);
        });

        it('ASSIGNING_RESPONSIBLE -> ESTIMATION_BEFORE_PERFORMER', () => {
          expect(
            strategy.canBeMoved(STATUS_NAME.ASSIGNING_RESPONSIBLE, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)
          ).toEqual(STATUS_NAME.ESTIMATION_BEFORE_PERFORMER);
        });

        expect(
          strategy.canBeMoved(STATUS_NAME.ASSIGNING_RESPONSIBLE, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)
        ).toBeTruthy();

        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)).toBeFalsy();

        expect(strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_PERFORMER, STATUS_NAME.CREATING)).toBeFalsy();
      });

      describe('TESTER', () => {
        beforeAll(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.TESTER);
        });

        it('TESTING -> ARCHITECT_REVIEW', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.ARCHITECT_REVIEW)).toBe(
            STATUS_NAME.ARCHITECT_REVIEW
          );
        });

        it('TESTING -> COLUMN_TYPE.REVIEWING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, COLUMN_TYPE.REVIEWING)).toBe(STATUS_NAME.ARCHITECT_REVIEW);
        });

        it('TESTING -> ESTIMATION_BEFORE_TO_DO', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.ESTIMATION_BEFORE_TO_DO)).toBe(
            STATUS_NAME.ESTIMATION_BEFORE_TO_DO
          );
        });

        it('TESTING -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, COLUMN_TYPE.DEVELOPING)).toBe(
            STATUS_NAME.ESTIMATION_BEFORE_TO_DO
          );
        });

        it('ESTIMATION_BEFORE_TO_DO -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_TO_DO, COLUMN_TYPE.DEVELOPING)).toBeFalsy();
        });

        it('ARCHITECT_REVIEW -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.ARCHITECT_REVIEW, COLUMN_TYPE.FINISHING)).toBeFalsy();
        });
      });
    });

    describe('userStrategyRoles', () => {
      it('ARCHITECT', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.ARCHITECT);
        expect(strategy.userStrategyRoles.length).toBe(1);
        expect(strategy.userStrategyRoles).toEqual([ROLE.ARCHITECT]);
      });

      it('ARCHITECT + DEVELOPER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT, ROLE.DEVELOPER]);
        expect(strategy.userStrategyRoles.length).toBe(2);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.ARCHITECT, ROLE.DEVELOPER]));
      });

      it('ARCHITECT + DESIGNER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT, ROLE.DESIGNER]);
        expect(strategy.userStrategyRoles.length).toBe(2);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.ARCHITECT, ROLE.DEVELOPER]));
      });

      it('FE_DEVELOPER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.FE_DEVELOPER]);
        expect(strategy.userStrategyRoles.length).toBe(1);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.DEVELOPER]));
      });
    });
  });

  describe('data', () => {
    describe('ADVANCED', () => {
      describe('DEVELOPER', () => {
        it('test 2 roles', () => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT, ROLE.DEVELOPER]);
          const data = strategy.data;
          expect(data.userRoles).toEqual([ROLE.ARCHITECT, ROLE.DEVELOPER]);
          expect(data.columns[ROLE.ARCHITECT].length).toBe(6);
          expect(data.columns[ROLE.DEVELOPER].length).toBe(6);
        });
      });
    });
  });
});
