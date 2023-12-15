import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { generateBatch } from "../shared/util";
import { movies, reviews } from "../seed/movies";
import * as iam from "aws-cdk-lib/aws-iam";

export class RestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tables
    const moviesTable = new dynamodb.Table(this, "MoviesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Movies",
    });

    const movieReviewsTable = new dynamodb.Table(this, "MovieReviewsTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "reviewId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieReviews",
    });

    // Create an IAM role for the Lambda function
    const translateLambdaRole = new iam.Role(this, "TranslateLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    // Attach the necessary policies to the role
    translateLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: ["translate:TranslateText"],
      })
    );

    translateLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    // Functions
    const getMovieByIdFn = new lambdanode.NodejsFunction(this, "GetMovieByIdFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getMovieById.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: moviesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getAllMoviesFn = new lambdanode.NodejsFunction(this, "GetAllMoviesFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getAllMovies.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: moviesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/addMovie.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: moviesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const deleteMovieFn = new lambdanode.NodejsFunction(this, "DeleteMovieFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/deleteMovie.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: moviesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const newReviewFn = new lambdanode.NodejsFunction(this, "AddMovieReviewFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/addReview.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getMovieReviewsFn = new lambdanode.NodejsFunction(this, "GetMovieReviewsFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getReviewsForMovieId.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getMovieReviewsByNameFn = new lambdanode.NodejsFunction(this, "GetMovieReviewsByNameFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getReviewsByNameOrYear.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const updateMovieReviewFn = new lambdanode.NodejsFunction(this, "UpdateMovieReviewFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/updateReview.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getAllReviewsByNameFn = new lambdanode.NodejsFunction(this, "GetAllReviewsByNameFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getAllReviewsByName.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getTranslatedReviewFn = new lambdanode.NodejsFunction(this, "GetTranslatedReviewFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/translateReview.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      role: translateLambdaRole,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    new custom.AwsCustomResource(this, "moviesddbInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [moviesTable.tableName]: generateBatch(movies),
            [movieReviewsTable.tableName]: generateBatch(reviews),
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"), //.of(Date.now().toString()),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [moviesTable.tableArn, movieReviewsTable.tableArn],
      }),
    });

    // Permissions
    moviesTable.grantReadWriteData(newMovieFn);
    moviesTable.grantReadWriteData(deleteMovieFn);
    moviesTable.grantReadData(getMovieByIdFn);
    moviesTable.grantReadData(getAllMoviesFn);
    movieReviewsTable.grantReadWriteData(newReviewFn);
    movieReviewsTable.grantReadWriteData(updateMovieReviewFn);
    movieReviewsTable.grantReadData(getMovieReviewsFn);
    movieReviewsTable.grantReadData(getMovieReviewsByNameFn);
    movieReviewsTable.grantReadData(getAllReviewsByNameFn);
    movieReviewsTable.grantReadData(getTranslatedReviewFn);

    const api = new apig.RestApi(this, "RestAPI", {
      description: "demo api",
      deployOptions: {
        stageName: "dev",
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const moviesEndpoint = api.root.addResource("movies");
    moviesEndpoint.addMethod("GET", new apig.LambdaIntegration(getAllMoviesFn, { proxy: true }));
    moviesEndpoint.addMethod("POST", new apig.LambdaIntegration(newMovieFn, { proxy: true }));

    const movieEndpoint = moviesEndpoint.addResource("{movieId}");
    movieEndpoint.addMethod("GET", new apig.LambdaIntegration(getMovieByIdFn, { proxy: true }));
    movieEndpoint.addMethod("DELETE", new apig.LambdaIntegration(deleteMovieFn, { proxy: true }));

    const reviewsEndpoint = moviesEndpoint.addResource("reviews");
    const movieReviewEndpoint = movieEndpoint.addResource("reviews");
    movieReviewEndpoint.addMethod("GET", new apig.LambdaIntegration(getMovieReviewsFn, { proxy: true }));

    const movieReviewEndpointByName = movieReviewEndpoint.addResource("{review}");
    movieReviewEndpointByName.addMethod("GET", new apig.LambdaIntegration(getMovieReviewsByNameFn, { proxy: true }));
    movieReviewEndpointByName.addMethod("PUT", new apig.LambdaIntegration(updateMovieReviewFn, { proxy: true }));

    const reviewEndpoint = reviewsEndpoint.addResource("{reviewerName}");
    reviewEndpoint.addMethod("GET", new apig.LambdaIntegration(getAllReviewsByNameFn, { proxy: true }));
    reviewsEndpoint.addMethod("POST", new apig.LambdaIntegration(newReviewFn, { proxy: true }));

    const translationEndpoint = movieReviewEndpointByName.addResource("translation");
    translationEndpoint.addMethod("GET", new apig.LambdaIntegration(getTranslatedReviewFn, { proxy: true }));
  }
}
