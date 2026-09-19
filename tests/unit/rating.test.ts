import { expect, it } from 'vitest'
import { ratingTier } from '../../src/core/rating'

it('Bewertungsstufen an den Grenzen', () => {
  expect(ratingTier(0)).toBe('low')
  expect(ratingTier(49.9)).toBe('low')
  expect(ratingTier(50)).toBe('solid')
  expect(ratingTier(74.9)).toBe('solid')
  expect(ratingTier(75)).toBe('good')
  expect(ratingTier(89.9)).toBe('good')
  expect(ratingTier(90)).toBe('strong')
  expect(ratingTier(100)).toBe('strong')
})
