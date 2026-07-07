import { describe, it, expect } from 'vitest';
import { Country } from '../country';

describe('Country', () => {
  describe('create', () => {
    it('should create a country with correct id and name', () => {
      const country = Country.create(1, 'Spain');
      expect(country.id).toBe(1);
      expect(country.name).toBe('Spain');
    });
  });

  describe('fromPrimitives', () => {
    it('should create a country from primitives', () => {
      const country = Country.fromPrimitives({ id: 2, name: 'England' });
      expect(country.id).toBe(2);
      expect(country.name).toBe('England');
    });
  });

  describe('toPrimitives', () => {
    it('should return correct primitives', () => {
      const country = Country.create(3, 'Germany');
      expect(country.toPrimitives()).toEqual({ id: 3, name: 'Germany' });
    });

    it('should be the inverse of fromPrimitives', () => {
      const primitives = { id: 4, name: 'Italy' };
      expect(Country.fromPrimitives(primitives).toPrimitives()).toEqual(primitives);
    });
  });
});
