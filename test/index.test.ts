import * as core from '@actions/core';
import { run } from '../src/index';
// import { writeFile } from '../src/common';

jest.mock('@actions/core');
jest.mock('../src/common');
jest.mock('../src/property-types');
jest.mock('../src/resources');

const mockCore = core as jest.Mocked<typeof core>;
// const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle core.getInput error', () => {
    mockCore.getInput.mockImplementation(() => {
      throw new Error('Input error');
    });

    expect(() => run()).toThrow('Failed to get output-path input');
  });

  test('should handle empty output path', () => {
    mockCore.getInput.mockReturnValue('');

    expect(() => run()).toThrow('output-path is required and cannot be empty');
  });

  test('should handle whitespace-only output path', () => {
    mockCore.getInput.mockReturnValue('   ');

    expect(() => run()).toThrow('output-path is required and cannot be empty');
  });

  test('should handle null output path', () => {
    mockCore.getInput.mockReturnValue(null as any);

    expect(() => run()).toThrow('output-path is required and cannot be empty');
  });
});
