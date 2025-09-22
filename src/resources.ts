import { fillAttributes, fillProperties, sort, TypeMap } from './common';
import { getResources } from './database';

export const generateResourceSchema = (): TypeMap => {
  const resourceTypes: TypeMap = {};
  for (const resource of getResources()) {
    const cloudFormationType = resource.cloudFormationType;

    const serviceName = cloudFormationType.split('::')[1].toLowerCase();

    resourceTypes[cloudFormationType] = {
      construct: {
        typescript: {
          module: `aws-cdk-lib/aws-${serviceName}`,
          name: `Cfn${resource.name}`,
        },
        csharp: {
          namespace: `Amazon.CDK.AWS.${serviceName.toUpperCase()}`,
          name: `Cfn${resource.name}`,
        },
        golang: {
          module: `github.com/aws/aws-cdk-go/awscdk/v2/aws${serviceName}`,
          package: `${serviceName}`,
          name: `Cfn${resource.name}`,
        },
        java: {
          package: `software.amazon.awscdk.services.${serviceName}`,
          name: `Cfn${resource.name}`,
        },
        python: {
          module: `aws_cdk.aws_${serviceName}`,
          name: `Cfn${resource.name}`,
        },
      },
      attributes: fillAttributes(resource.attributes, cloudFormationType),
      properties: fillProperties(resource.properties, cloudFormationType),
    };
  }

  // TODO: Maybe Add Custom Resources as well, something like this:

  // resourceTypes['AWS::CloudFormation::CfnCustomResource'] = {
  //   name: 'CfnCustomResource',
  //   attributes: {},
  //   properties: {
  //     ServiceToken: {
  //       name: 'ServiceToken',
  //       valueType: {
  //         primitive: 'string',
  //       },
  //     },
  //   },
  // };

  return sort(resourceTypes);
};
