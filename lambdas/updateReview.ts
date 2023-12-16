import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";
import { Review } from "../shared/types";

const ajv = new Ajv();
const isValidBodyParams = ajv.compile(schema.definitions["UpdateReview"] || {});
const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    const parameters = event.pathParameters;
    const body = event.body ? JSON.parse(event.body) : undefined;
    const movieId = parameters?.movieId ? parseInt(parameters.movieId) : undefined;
    const review = parameters?.review ? decodeURIComponent(parameters.review) : undefined;

    if (!body) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    if (!isValidBodyParams(body)) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: `Incorrect type. Must match Review schema`,
          schema: schema.definitions["UpdateReview"],
        }),
      };
    }

    if (!movieId || !review) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing movieId or reviewerName in the request" }),
      };
    }

    const queryCommand = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "movieId = :m",
      FilterExpression: "reviewerName = :r",
      ExpressionAttributeValues: {
        ":m": movieId,
        ":r": review,
      },
    });

    const queryOutput = await ddbDocClient.send(queryCommand);

    if (!queryOutput.Items || queryOutput.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Review not found" }),
      };
    }

    const reviewToUpdate = queryOutput.Items[0];

    const commandInput = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        reviewerName: reviewToUpdate.reviewerName,
        rating: body.rating,
        reviewId: reviewToUpdate.reviewId,
        movieId: reviewToUpdate.movieId,
        review: body.review,
        reviewDate: reviewToUpdate.reviewDate,
      } as Review,
    });

    await ddbDocClient.send(commandInput);

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Review updated" }),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
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
