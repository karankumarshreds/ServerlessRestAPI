# Serverless API AWS

## Initialize

`serverless config credentials --provider aws --key <access_key> --secret <secret_key> --profile <profile_name>`

## Create a project

`serverless create --template aws-nodejs --path <folder_name>`

OR

`sls create --name auction-service --template-url https://github.com/codingly-io/sls-base`

## Commands

> sls deploy

> sls deploy -v

> sls deploy --stage <dev/prod/stage>

> sls remove

_If you make changes to a single function, you can deploy only that function_

**NOTE: This only works if you have NOT made any changes to the serverless.yml file**

> sls deploy -f <function_name> // function name is gotten from serverless.yml

## Dynamodb IAM actions

https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazondynamodb.html
