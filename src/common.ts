import { Attribute, Property } from '@aws-cdk/service-spec-types';
import fs from 'fs-extra';
import { TypeDecider } from './type-decider';

/**
 * A map of all CloudFormation resources types
 */
export interface TypeMap {
  [name: string]: ResourceType;
}

export interface PropertyInfo {
  name: string;
  valueType: {
    primitive?: string;
    [key: string]: unknown;
  };
  required?: boolean;
}

export interface ResourceType {
  name: string;
  attributes?: Record<string, PropertyInfo>;
  properties: Record<string, PropertyInfo>;
  construct?: {
    typescript: { module: string; name: string };
    csharp: { namespace: string; name: string };
    golang: { module: string; package: string; name: string };
    java: { package: string; name: string };
    python: { module: string; name: string };
  };
}

const fill = (
  items: Record<string, Attribute | Property>,
  cloudFormationType: string,
  isAttribute: boolean
) => {
  const itemList = Object.entries(items).reduce(
    (acc, [id, item]) => {
      const type = TypeDecider.getType(cloudFormationType, item.type, item.previousTypes);
      const required = isAttribute ? undefined : 'required' in item ? item.required : undefined;

      acc[id] = {
        name: id,
        valueType: type.type,
        required,
      };
      return acc;
    },
    {} as Record<string, any>
  );
  return sort(itemList);
};

export const sort = (unsorted: Record<string, any>) => {
  const sortedKeys: string[] = Object.keys(unsorted).sort();
  return sortedKeys.reduce((acc: any, key: string) => {
    acc[key] = unsorted[key];
    return acc;
  }, {});
};

export const fillAttributes = (items: Record<string, Attribute>, cloudFormationType: string) => {
  return fill(items, cloudFormationType, true);
};

export const fillProperties = (items: Record<string, Property>, cloudFormationType: string) => {
  return fill(items, cloudFormationType, false);
};

export const writeFile = (schema: any, outputPath: string) => {
  console.log(`Generating ${outputPath}`);

  try {
    const jsonContent = JSON.stringify(schema, null, 2);
    fs.writeFileSync(outputPath, jsonContent, {
      encoding: 'utf-8',
    });
  } catch (error) {
    throw new Error(`Failed to write file ${outputPath}: ${error}`);
  }
};
