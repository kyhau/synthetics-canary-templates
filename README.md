# synthetics-canary-templates


This repo also contains AWS Synthetics Canaries for testing some application connectivities.

## Current CloudFormation limitation on Canary deployment

1. You need to manually update the CloudWatch Log Group Retention of the corresponding Lambda Function being created through the `AWS::Synthetics::Canary`. The default value is `Never expire`.

2. When you delete the canary stack,
    1. You need to delete the corresponding Lambda Function and Lambda Layer (what was created through the `AWS::Synthetics::Canary`). CloudFormation currently does not delete this Lambda Function and Lambda Layer.
    2. If you use `VpcConfig` for your Canary, you need to delete Lambda Function first before deleting the stack, otherwise deletion will fail.
