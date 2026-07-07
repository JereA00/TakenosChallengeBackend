import { describe, it, expect } from 'vitest';
import { Team } from '../team';
import { Country } from '../country';

describe('Team', () => {
  const country = Country.create(1, 'Spain');

  describe('create', () => {
    it('should create a team with correct properties', () => {
      const team = Team.create(1, 'Real Madrid', country);
      expect(team.id).toBe(1);
      expect(team.name).toBe('Real Madrid');
      expect(team.country.id).toBe(1);
      expect(team.country.name).toBe('Spain');
    });
  });

  describe('fromPrimitives', () => {
    it('should create a team from primitives', () => {
      const team = Team.fromPrimitives({ id: 2, name: 'Barcelona', country: { id: 1, name: 'Spain' } });
      expect(team.id).toBe(2);
      expect(team.name).toBe('Barcelona');
      expect(team.country.name).toBe('Spain');
    });
  });

  describe('toPrimitives', () => {
    it('should return correct primitives including nested country', () => {
      const team = Team.create(3, 'Atletico Madrid', country);
      expect(team.toPrimitives()).toEqual({
        id: 3,
        name: 'Atletico Madrid',
        country: { id: 1, name: 'Spain' },
      });
    });

    it('should be the inverse of fromPrimitives', () => {
      const primitives = { id: 4, name: 'Sevilla', country: { id: 1, name: 'Spain' } };
      expect(Team.fromPrimitives(primitives).toPrimitives()).toEqual(primitives);
    });
  });
});
