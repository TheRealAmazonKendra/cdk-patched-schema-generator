import * as fs from 'fs-extra';
import { writeFile } from '../src/common';

jest.mock('fs-extra');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Common utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('writeFile', () => {
    test('should write file successfully', () => {
      const schema = { test: 'data' };
      const outputPath = '/test/path.json';

      writeFile(schema, outputPath);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        outputPath,
        JSON.stringify(schema, null, 2),
        { encoding: 'utf-8' }
      );
    });

    test('should throw error when JSON.stringify fails', () => {
      const circularObj: any = {};
      circularObj.self = circularObj;
      const outputPath = '/test/path.json';

      expect(() => writeFile(circularObj, outputPath)).toThrow(
        'Failed to write file /test/path.json:'
      );
    });

    test('should throw error when writeFileSync fails', () => {
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed');
      });

      const schema = { test: 'data' };
      const outputPath = '/test/path.json';

      expect(() => writeFile(schema, outputPath)).toThrow(
        'Failed to write file /test/path.json: Error: Write failed'
      );
    });
  });
});
