import { AxiosResponse } from 'axios';

// Create a type for mocked functions that includes Jest mock methods
type MockedFunction<T extends (...args: any) => any> = jest.MockedFunction<T> & {
  mockResolvedValue: (value: any) => jest.MockedFunction<T>;
  mockRejectedValue: (value: any) => jest.MockedFunction<T>;
  mockClear: () => jest.MockedFunction<T>;
};

// Create a type for the API module with mocked functions
export type MockedApiModule = {
  [K in keyof typeof import('../../utils/api')]: K extends keyof typeof import('../../utils/api') 
    ? MockedFunction<typeof import('../../utils/api')[K] extends (...args: any) => any 
      ? typeof import('../../utils/api')[K] 
      : (...args: any) => any>
    : never;
};

// Mock the entire API module
jest.mock('../../utils/api', () => {
  const originalModule = jest.requireActual('../../utils/api');
  
  // Create mocked versions of all functions
  const mockedModule: any = {};
  
  // For each function in the original module, create a mocked version
  Object.keys(originalModule).forEach(key => {
    if (typeof originalModule[key] === 'function') {
      mockedModule[key] = jest.fn();
    } else {
      mockedModule[key] = originalModule[key];
    }
  });
  
  return mockedModule;
});

// Helper function to get the mocked API module
export const getMockedApiModule = (): MockedApiModule => {
  return jest.requireMock('../../utils/api') as MockedApiModule;
};
