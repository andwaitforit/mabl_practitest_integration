const lib = require('lib',)({token: process.env.STDLIB_SECRET_TOKEN});
const axios = require('axios');
/**
* An HTTP endpoint that acts as a webhook for HTTP(S) request event
* @returns {object} result Your return value
*/
module.exports = async (context) => {


  console.log('params:', context.params);

  const projectId = 26399;
  let base_url = "https://api.practitest.com/api/v2/";
  
  //Find number of tests to iterate through
  let test_cases_executed = (context.params.journeys.length);
  let test_case_ids = [];
  let test_case_result_status = [];

  for (let i = 0; i < test_cases_executed; i++) {
    test_case_ids.push(context.params.journey_executions[i].test_cases[0].id);
    //Store test results, practitest accepts a code of 0 for passing results and
    let mabl_test_result_status = context.params.results[i].success;
    if (mabl_test_result_status== false){
      test_case_result_status.push(2);
    }
    else if(mabl_test_result_status == true){
      test_case_result_status.push(0);
    }
    else{
      test_case_result_status.push(1);
    }
    };
    
    //Need to implement api call to create test set containing all case id's extracted by parsing logic
    let new_test_set_url = base_url + "/projects/" + projectId + "/sets.json";
    
    //Generate the JSON body to pass to practitest to create test set
    let new_test_set_body = JSON.stringify({"data": { 
      "type": "sets", 
      "attributes": {
        "name": "Mabl automation run", 
        "description": "Test set generated by mabl api step", 
        "priority": "highest"
        }
    }});
    console.log(new_test_set_body);
    console.log(test_case_ids);
    //Create new test set, and store id to variable
    let new_test_set_response = await axios.post(new_test_set_url, new_test_set_body, {
      headers: {
          'Content-Type': 'application/json',
          'PTToken': process.env.apiToken
        }
    });
    console.log(new_test_set_response.data);
    let test_set_id = new_test_set_response.data.data.id;
    console.log(test_set_id);
    
    
    //Make api call to create test instance based on number of test cases
    
    //Dynamically construct json request body
    
    let instances = [];

    // Iterate over the test_case_ids array
    for (let i = 0; i < test_case_ids.length; i++) {
      // Create a new instance object
      let instance = {
        type: "instances",
        attributes: {
          "test-id": test_case_ids[i],
          "set-id": test_set_id,
          priority: "highest"
        }
      };
      // Add the instance to the instances array
      instances.push(instance);
    }
    let instance_object = {
      data: instances
    };
    // Convert the JSON object to a string
    let new_instance_body = JSON.stringify(instance_object); 
    console.log(new_instance_body);
    
    //Create new test instance

    let new_test_instance_url = base_url + "/projects/" + projectId + "/instances.json"
    let new_test_instance_response = await axios.post(new_test_instance_url, new_instance_body, {
      headers: {
          'Content-Type': 'application/json',
          'PTToken': process.env.apiToken
        }
    });
    console.log(new_test_instance_response);
    
    //Store instance ids
    let test_instance_ids = [];
    for(var j = 0; j< test_cases_executed; j++){
      test_instance_ids.push(new_test_instance_response.data.data[j].id);
    };
    console.log(test_instance_ids);
    
    //Dynamically construct json request body for adding results
    let run_results_array = []   
    // Iterate over the test_case_ids array
    for (let i = 0; i < test_case_ids.length; i++) {
      // Create a new instance object
      let run_results = {
        type: "instances",
        attributes: {
          "instance-id": test_instance_ids[i],
          "exit-code": test_case_result_status[i],
          priority: "highest"
        }
      };
    
      // Add the instance to the instances array
      run_results_array.push(run_results);
    }
    let run_result_object = {
      data: run_results_array
    };
    
    // Convert the JSON object to a string
    let new_run_result_body = JSON.stringify(run_result_object);
    
    console.log(new_instance_body);
    
    let add_result_url = base_url + "/projects/" + projectId + "/runs.json"
    
    //Add results to instance
    let add_result_to_instance = await axios.post(add_result_url, new_run_result_body, {
      headers: {
          'Content-Type': 'application/json',
          'PTToken': process.env.apiToken
        }
    });
    console.log(add_result_to_instance);
  }

