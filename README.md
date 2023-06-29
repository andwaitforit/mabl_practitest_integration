# mabl-TCM-autocode-webhook
A small script to parse the JSON response from mabl webhooks, and construct API requests to update testrail test cases programatically.  As a pre-requisite you'll need to have the testrail testcase id's associated with mabl through the test case id field.

<img width="443" alt="Screen Shot 2022-05-11 at 9 31 35 AM" src="https://user-images.githubusercontent.com/35976286/167862327-dfe3416d-a72a-42c5-87b5-a383a94615cf.png">


To get started, navigate to https://autocode.com/signup/?goto=%2Finstall%2Fymusleh%2Fmy-webhook%2F and signup to create a free webhook.

Once you've created your first webhook project from the Run section of the toolbar you can retreive your webhook url.

<img width="632" alt="image" src="https://user-images.githubusercontent.com/35976286/158262272-621110e5-87b0-4198-870f-e35dab388a4e.png">

You can then use this url to create a new webhook in the mabl application under the settings->webhooks section.

Once the webhook url is create in autocode, and connected to mabl, simply paste the code provided in the repo to your main.js file.  Some additional parameters within the script will need to be updated such as username and password as environment variables, project id, baseUrl, etc.  Once these parameters are updated, your webhook should listen for any post execution results api calls from mabl triggered via plan runs which will execute the script to update your TCM.


