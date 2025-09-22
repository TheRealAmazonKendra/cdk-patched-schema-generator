import { fillProperties, sort, TypeMap } from './common';
import { getParentResource, getService, getTypes } from './database';

export const generatePropertyTypesSchema = (): TypeMap => {
  const propertyTypes: Record<string, any> = {};
  for (const type of getTypes()) {
    const parent = getParentResource(type);
    const service = getService(parent.cloudFormationType);
    const propertyName = `${type.name}Property`;
    const name = `${parent.cloudFormationType}.${propertyName}`;

    const serviceName = service.cloudFormationNamespace.split('::')[1].toLowerCase();
    const cfnName = `Cfn${parent.name}.${propertyName}`;

    propertyTypes[name] = {
      name: {
        typescript: {
          module: `aws-cdk-lib/aws-${serviceName}`,
          name: cfnName,
        },
        csharp: {
          namespace: `Amazon.CDK.AWS.${serviceName.toUpperCase()}`,
          name: cfnName,
        },
        golang: {
          module: `github.com/aws/aws-cdk-go/awscdk/v2/aws${serviceName}`,
          package: serviceName,
          name: cfnName.replace('.', '_'),
        },
        java: {
          package: `software.amazon.awscdk.services.${serviceName}`,
          name: cfnName,
        },
        python: {
          module: `aws_cdk.aws_${serviceName}`,
          name: cfnName,
        },
      },
      properties: fillProperties(type.properties, parent.cloudFormationType),
    };
  }

  // Add CfnTag since it is not in the schema but we need the type
  propertyTypes.CfnTag = {
    name: {
      typescript: {
        module: 'aws-cdk-lib',
        name: 'CfnTag',
      },
      csharp: {
        namespace: 'Amazon.CDK',
        name: 'CfnTag',
      },
      golang: {
        module: 'github.com/aws/aws-cdk-go/awscdk/v2',
        package: 'awscdk',
        name: 'CfnTag',
      },
      java: {
        package: 'software.amazon.awscdk',
        name: 'CfnTag',
      },
      python: {
        module: 'aws_cdk',
        name: 'CfnTag',
      },
    },
    properties: {
      Key: {
        name: 'Key',
        valueType: {
          primitive: 'string',
        },
        required: true,
      },
      Value: {
        name: 'Value',
        valueType: {
          primitive: 'string',
        },
        required: true,
      },
    },
  };

  return sort(propertyTypes);
};
