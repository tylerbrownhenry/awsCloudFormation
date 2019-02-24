# CloudFormation Stacks to Setup Auto Deploy Based on Branch

This is a series of cloudformation stacks that creates a user pool, static website, and commit triggers will deploy updates to lambda funcitions throught S3.

BETA

## Prerequisites

1. Download [NodeJS](https://nodejs.org/en/download/)
2. Install [NPM](https://nodejs.org/en/download/)
3. Install [Git Cli](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
4. Install [AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
5. [Setup Local AWS Credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
6. Clone This Repo

#### Getting Started

1. Visit [CloudFormation Console](https://us-west-2.console.aws.amazon.com/cloudformation)
2. Click on 'Create Stack'
3. Under 'Choose a template' like the 'Choose template' selected 'Upload a template to Amazon S3'
4. Navigate to this repo's Stack 1 folder and select the JSON file
5. On the next page it will ask you to enter several parameters
6. Remember the value for 'EnvironmentName' since you will have to enter it into each stack.
7. Click 'next' on the following pages, and then click 'Create' on the last page.
8. You'll see a list of stacks, if this is successful you'll get a 'CREATE_COMPLETE' message under the status column.
9. Follow the same steps for Stack 2
10. Upload CodeCommit Trigger Function

Stack 3 requires you to uploaded a zip file to your S3 bucket. Below are instructions on how to generate the file, and uploaded it from the commad line. You can also do this manually through the console.

The last two steps created users, roles, policies and an S3 bucket for storing files. Now we want to upload some files we will use in the following steps to the bucket.

1. Throughout this document when there is code, and words wrappped in [] like [environmentName] it means you should replace it with the values of the parameters with the same name you entered in the stack.

```
git clone https://github.com/0xlen/aws-lambda-python-codecommit-s3-deliver
cd aws-lambda-python-codecommit-s3-deliver/
zip -r [environmentName]-CodeCommitTriggerLambda.zip .
```

Then upload it to your new S3 Bucket, if you get an error, your user may not be allowed to upload this way, you may try doing it through the console instead.  Replace [BUCKET_NAME] with the name of the bucket you created in step 2.

```
aws s3 cp [environmentName]-CodeCommitTriggerLambda.zip s3://[bucketName]/ --storage-class REDUCED_REDUNDANCY

```

11. Upload Stack  3, Stack 4, and Stack 5
12. You now have a CodeCommit repo, with a trigger setup to upload a zip file of your repo to S3.  To proceed to the next step, the first zip file must aleady exist in S3.

To generate this file, we do an initial commit into the branch you defined in stack 1.

The [CodeCommit Console](https://us-west-2.console.aws.amazon.com/codecommit/) should give you instructions on setting up local SSH for your branch. Heres [more info](https://docs.aws.amazon.com/console/codecommit/connect-https-unix).

Copy the clone url from the repo and run

```
git clone [codeCommitRepoAddress]
cd [codeCommitRepoName]
git checkout -b [branch]
```

Create a file to do your initial commit, and push to remote

In the folder of the cloned repo, create a file named index.js and add this to the file
```
// Remember this code is updated by code commit pushes, so inline edits will be overwritten
exports.handler = function(event, context) {
  console.log('Hello World');
  // This is in case using lambda as an api for optional Step 11
  return {
    'headers': {},
    'body': 'Hello world'
  };
}

```

Then git it to your repo

```
git add index.js && git commit -m 'init commit' && git push --set-upstream origin [branch]
```

When you do this commit a lambda function is triggered, that creates a zip out of the repo and uploads it to S3. If you check you S3 bucket contents, you should see 2 zip files.

13. Upload Stack 6
14. Upload S3 Upload Script

```
cd Step7/
zip -r [environmentName]-S3-Upload-Trigger.zip .
aws s3 cp [environmentName]-S3-Upload-Trigger.zip s3://[bucketName]/ --storage-class REDUCED_REDUNDANCY
```

15. Upload Step 8
16. Add Notification Configuration to S3 Bucket.  It's easiest to just do this from the terminal.

img source:[img/ExampleOfS3Event.png]

You know have a bare bones serverless app that will update a lambda function with the contents of your CodeCommit repo whenever you push to the branch.


17. Create Identity Pool...
