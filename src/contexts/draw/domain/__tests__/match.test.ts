import { describe, it, expect } from 'vitest';
import { Match } from '../match';

describe('Match', () => {
  describe('create', () => {
    it('should create a match with correct properties', () => {
      const match = Match.create(1, 10, 2, 3, 1);
      expect(match.id).toBe(1);
      expect(match.drawId).toBe(10);
      expect(match.homeTeamId).toBe(2);
      expect(match.awayTeamId).toBe(3);
      expect(match.matchDay).toBe(1);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a match from primitives', () => {
      const match = Match.fromPrimitives({ id: 5, drawId: 1, homeTeamId: 10, awayTeamId: 20, matchDay: 3 });
      expect(match.id).toBe(5);
      expect(match.homeTeamId).toBe(10);
      expect(match.awayTeamId).toBe(20);
      expect(match.matchDay).toBe(3);
    });
  });

  describe('toPrimitives', () => {
    it('should return correct primitives', () => {
      const match = Match.create(2, 1, 5, 6, 2);
      expect(match.toPrimitives()).toEqual({
        id: 2,
        drawId: 1,
        homeTeamId: 5,
        awayTeamId: 6,
        matchDay: 2,
      });
    });

    it('should be the inverse of fromPrimitives', () => {
      const primitives = { id: 7, drawId: 2, homeTeamId: 11, awayTeamId: 22, matchDay: 4 };
      expect(Match.fromPrimitives(primitives).toPrimitives()).toEqual(primitives);
    });
  });
});
