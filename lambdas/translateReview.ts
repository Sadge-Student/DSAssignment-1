import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TranslateClient, TranslateTextCommand, TranslateTextCommandOutput } from "@aws-sdk/client-translate";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);
    const parameters = event?.pathParameters;
    const movieId = parameters?.movieId ? parseInt(parameters.movieId) : undefined;
    const review = parameters?.review ? decodeURIComponent(parameters.review) : undefined;
    const language = event.queryStringParameters?.language || "en";

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
        body: JSON.stringify({ Message: "Review name not provided" }),
      };
    }

    const commandInput = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "movieId = :m",
      FilterExpression: "reviewerName = :r",
      ExpressionAttributeValues: {
        ":m": movieId,
        ":r": review,
      },
    };

    const commandOutput = await ddbDocClient.send(new QueryCommand(commandInput));

    if (review && commandOutput.Items) {
      commandOutput.Items = commandOutput.Items.filter((item) => item.reviewerName === review);
    }

    const translate = new TranslateClient({ region: process.env.REGION });
    const translatePromises: Promise<TranslateTextCommandOutput>[] = [];

    if (commandOutput.Items) {
      for (const item of commandOutput.Items) {
        const individualTranslateParams = {
          SourceLanguageCode: "en",
          TargetLanguageCode: language,
          Text: item.review,
        };
        translatePromises.push(translate.send(new TranslateTextCommand(individualTranslateParams)));
      }
    }

    try {
      const translateResults = await Promise.all(translatePromises);
      if (commandOutput.Items) {
        const combinedResults = commandOutput.Items.map((item, index) => ({
          ...item,
          translatedReview: translateResults[index]?.TranslatedText,
        }));

        return {
          statusCode: 200,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            data: combinedResults,
          }),
        };
      }
    } catch (error: any) {
      console.error("Translation error:", error);
      return {
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        // body: JSON.stringify({ Message: "Internal Server Error" }),
        body: JSON.stringify({ Message: error }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: [],
      }),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      //   body: JSON.stringify({ Message: "Internal Server Error" }),
      body: JSON.stringify({ Message: error }),
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
