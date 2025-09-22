import { PropertyType } from '@aws-cdk/service-spec-types';
import { PrimitiveType } from '@cdklabs/typewriter';
import { getTypeDefinition } from './database';

export class TypeDecider {
  public static getType(
    cloudFormationType: string,
    currentType: PropertyType,
    previousTypes: PropertyType[] = []
  ) {
    const propertyType: PropertyType =
      previousTypes.length > 0
        ? {
            type: 'union',
            types: [currentType, ...previousTypes],
          }
        : currentType;
    return { type: this.doGetType(propertyType, cloudFormationType) };
  }

  private static doGetType(propertyType: PropertyType, cloudFormationType: string): any {
    switch (propertyType.type) {
      case 'string':
        return { primitive: PrimitiveType.String };
      case 'boolean':
        return { primitive: PrimitiveType.Boolean };
      case 'number':
      case 'integer':
        return { primitive: PrimitiveType.Number };
      case 'date-time':
        return { primitive: PrimitiveType.DateTime };
      case 'ref':
        const referenceTypeName = getTypeDefinition(propertyType);
        // Remove 'Property' suffix from reference name for the named type
        const cleanTypeName = referenceTypeName.replace(/Property$/, '');
        return { named: `${cloudFormationType}.${cleanTypeName}` };
      case 'array':
        const elementType = this.doGetType(propertyType.element, cloudFormationType);
        return { listOf: elementType };
      case 'json':
        return { primitive: PrimitiveType.Json };
      case 'map':
        const mapElementType = this.doGetType(propertyType.element, cloudFormationType);
        return { mapOf: mapElementType };
      case 'tag':
        return { named: 'CfnTag' };
      case 'union':
        const unionTypes = propertyType.types.map((t) => this.doGetType(t, cloudFormationType));
        return { unionOf: unionTypes };
      case 'null':
        return { primitive: PrimitiveType.Undefined };
      default:
        return { primitive: PrimitiveType.Any };
    }
  }
}
