import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);
    const parameters = event?.pathParameters;
    const reviewerName = parameters?.reviewerName ? decodeURIComponent(parameters.reviewerName) : undefined;

    console.log("reviewName: ", reviewerName);

    if (reviewerName === undefined) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Reviewer name not provided" }),
      };
    }

    const scanInput = {
      TableName: process.env.TABLE_NAME,
    };

    const scanOutput = await ddbDocClient.send(new ScanCommand(scanInput));

    if (reviewerName && scanOutput.Items) {
      scanOutput.Items = scanOutput.Items.filter((item) => item.reviewerName?.S === reviewerName);
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: scanOutput.Items,
      }),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ Message: "Internal Server Error" }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
