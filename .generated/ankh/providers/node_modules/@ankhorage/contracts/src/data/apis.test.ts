import { readOwnProperty } from '@ankhorage/utility/object';
import { describe, expect, it } from 'bun:test';

import type {
  ApiDefinitionRegistry,
  ExternalRestApiDefinition,
  InternalRestApiDefinition,
} from './apis';

function assertSerializable<TValue>(value: TValue): void {
  expect(JSON.parse(JSON.stringify(value))).toEqual(value);
}

function createNutritionApi(): ExternalRestApiDefinition {
  return {
    id: 'nutrition',
    origin: 'external',
    protocol: 'rest',
    name: 'Nutrition API',
    baseUrl: 'https://api.ankhorage.com/v1/nutrition',
    schemas: {
      Product: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
        },
      },
    },
    endpoints: {
      products: {
        id: 'products',
        kind: 'http',
        path: '/products',
        operations: {
          'products.list': {
            id: 'products.list',
            endpointId: 'products',
            protocol: 'http',
            intent: 'read',
            method: 'GET',
            path: '/products',
          },
        },
      },
    },
  };
}

describe('canonical API contracts', () => {
  it('serializes external REST schemas, endpoints, and operations', () => {
    const api = createNutritionApi();

    assertSerializable(api);
    expect(api.baseUrl).toBe('https://api.ankhorage.com/v1/nutrition');
    expect(api.endpoints.products?.operations['products.list']?.method).toBe('GET');
  });

  it('stores canonical APIs in an identity-keyed registry', () => {
    const api = createNutritionApi();
    const apis: ApiDefinitionRegistry = { [api.id]: api };

    assertSerializable(apis);
    expect(readOwnProperty<ApiDefinitionRegistry[string]>(apis, 'nutrition')?.id).toBe('nutrition');
  });

  it('reserves an internal REST API identity without persistence implementation', () => {
    const api: InternalRestApiDefinition = {
      id: 'future-internal-api',
      origin: 'internal',
      protocol: 'rest',
      basePath: '/v1/internal',
      endpoints: {},
    };

    assertSerializable(api);
    expect('database' in api).toBe(false);
    expect('adapter' in api).toBe(false);
  });
});
