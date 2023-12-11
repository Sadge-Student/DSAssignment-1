import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);
    const parameters = event?.pathParameters;
    const movieId = parameters?.movieId ? parseInt(parameters.movieId) : undefined;
    const review = parameters?.review ? decodeURIComponent(parameters.review) : undefined;

    const yearPattern = /^\d{4}$/;

    if (!movieId) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid movie Id" }),
      };
    }

    if (review === undefined) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Review name or date not provided" }),
      };
    }

    const isYear = yearPattern.test(review);

    if (isYear) {
      const date = review;

      const commandInput = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "movieId = :m",
        ExpressionAttributeValues: {
          ":m": movieId,
        },
      };

      const commandOutput = await ddbDocClient.send(new QueryCommand(commandInput));

      if (review && commandOutput.Items) {
        commandOutput.Items = commandOutput.Items.filter((item) => item.reviewDate.startsWith(date));
      }

      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data: commandOutput.Items,
        }),
      };
    } else {
      const reviewName = review;

      const commandInput = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "movieId = :m",
        FilterExpression: "reviewerName = :r",
        ExpressionAttributeValues: {
          ":m": movieId,
          ":r": reviewName,
        },
      };

      const commandOutput = await ddbDocClient.send(new QueryCommand(commandInput));

      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data: commandOutput.Items,
        }),
      };
    }
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

function stringOrNumberToNumber(input: string | number | undefined): number | undefined {
  if (typeof input === "string") {
    return parseInt(input);
  }
  return input;
}
