import { TypeDecider } from '../src/type-decider';

describe('TypeDecider', () => {
  describe('getType', () => {
    test('should handle unknown type', () => {
      const result = TypeDecider.getType('AWS::Test::Resource', { type: 'unknown' } as any);
      expect(result.type.primitive).toBe('any');
    });

    test('should handle null type', () => {
      const result = TypeDecider.getType('AWS::Test::Resource', { type: 'null' } as any);
      expect(result.type.primitive).toBe('undefined');
    });

    test('should handle union with previous types', () => {
      const currentType = { type: 'string' } as any;
      const previousTypes = [{ type: 'number' } as any];

      const result = TypeDecider.getType('AWS::Test::Resource', currentType, previousTypes);
      expect(result.type.unionOf).toHaveLength(2);
      expect(result.type.unionOf[0].primitive).toBe('string');
      expect(result.type.unionOf[1].primitive).toBe('number');
    });
  });
});
