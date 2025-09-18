import { loadAwsServiceSpecSync } from '@aws-cdk/aws-service-spec';
import { getService } from '../src/database';

jest.mock('@aws-cdk/aws-service-spec');
const mockLoadAwsServiceSpecSync = loadAwsServiceSpecSync as jest.MockedFunction<
  typeof loadAwsServiceSpecSync
>;

describe('Database utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getService', () => {
    test('should throw error when service not found', () => {
      const mockDatabase = {
        all: jest.fn().mockReturnValue({}),
        lookup: jest.fn().mockReturnValue({
          only: jest.fn().mockImplementation(() => {
            throw new Error('No results found');
          }),
        }),
      };

      mockLoadAwsServiceSpecSync.mockReturnValue(mockDatabase as any);

      expect(() => getService('AWS::NonExistent::Resource')).toThrow(
        'Service not found for type AWS::NonExistent: Error: No results found'
      );
    });
  });

  describe('getParentResource', () => {
    test('should throw error when parent resource not found', () => {
      // Reset the database state first
      jest.resetModules();

      const mockDatabase = {
        all: jest.fn().mockReturnValue({}),
        incoming: jest.fn().mockReturnValue({
          only: jest.fn().mockImplementation(() => {
            throw new Error('No parent found');
          }),
        }),
      };

      // Mock the database before importing the function
      jest.doMock('@aws-cdk/aws-service-spec', () => ({
        loadAwsServiceSpecSync: () => mockDatabase,
      }));

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getParentResource: testGetParentResource } = require('../src/database');

      mockLoadAwsServiceSpecSync.mockReturnValue(mockDatabase as any);

      const mockType = { name: 'TestType' } as any;

      expect(() => testGetParentResource(mockType)).toThrow(
        'Parent resource not found for type TestType: Error: No parent found'
      );
    });
  });
});
