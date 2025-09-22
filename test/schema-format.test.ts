import { generatePropertyTypesSchema } from '../src/property-types';
import { generateResourceSchema } from '../src/resources';

describe('Schema Format Validation', () => {
  test('property types schema has correct structure', () => {
    const schema = generatePropertyTypesSchema();
    const keys = Object.keys(schema);

    expect(keys.length).toBeGreaterThan(0);

    const firstProperty = schema[keys[0]] as any;
    expect(firstProperty).toHaveProperty('name');
    expect(firstProperty).toHaveProperty('properties');

    // Validate name structure has all language bindings
    expect(Object.keys(firstProperty.name)).toEqual(
      expect.arrayContaining(['typescript', 'csharp', 'golang', 'java', 'python'])
    );

    // Check property name matches key
    Object.keys(firstProperty.properties).forEach((key) => {
      expect(firstProperty.properties[key].name).toBe(key);
    });
  });

  test('resource schema has correct structure', () => {
    const schema = generateResourceSchema();
    const keys = Object.keys(schema);

    expect(keys.length).toBeGreaterThan(0);

    const firstResource = schema[keys[0]];
    expect(firstResource).toHaveProperty('construct');
    expect(firstResource).toHaveProperty('properties');

    // Check properties name consistency
    Object.keys(firstResource.properties).forEach((key) => {
      expect(firstResource.properties[key].name).toBe(key);
    });

    // Check attributes name consistency if they exist
    if (firstResource.attributes) {
      Object.keys(firstResource.attributes).forEach((key) => {
        expect(firstResource.attributes![key].name).toBe(key);
      });
    }
  });

  test('language bindings have required fields', () => {
    const schema = generateResourceSchema();
    const firstResource = schema[Object.keys(schema)[0]];

    expect(firstResource.construct).toBeDefined();

    // Validate all language bindings exist
    expect(Object.keys(firstResource.construct!)).toEqual(
      expect.arrayContaining(['typescript', 'csharp', 'golang', 'java', 'python'])
    );

    // Check required fields for each binding
    expect(firstResource.construct!.typescript).toHaveProperty('module');
    expect(firstResource.construct!.typescript).toHaveProperty('name');
    expect(firstResource.construct!.golang).toHaveProperty('package');
  });

  test('value types have correct format', () => {
    const resourceSchema = generateResourceSchema();
    const propertySchema = generatePropertyTypesSchema();

    // Check first resource properties
    const firstResource = resourceSchema[Object.keys(resourceSchema)[0]];
    Object.values(firstResource.properties).forEach((prop) => {
      expect(prop).toHaveProperty('valueType');
    });

    // Check first property type properties
    const firstPropType = propertySchema[Object.keys(propertySchema)[0]];
    Object.values(firstPropType.properties).forEach((prop) => {
      expect(prop).toHaveProperty('valueType');
    });
  });
});
