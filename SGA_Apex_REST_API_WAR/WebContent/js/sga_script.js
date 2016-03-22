/*
 * Script for SGA job management functions.
 * @author: Mangirish Wagle
 */

var baseURL = "/SGA_Apex/sga/rest";
var jobStatusURL = "job_status.html?jobID=";
var fileUploadCount = 0;
var fileContentURLs = [];
var fileTypes = ["Coordinate-File", "Portable-Input-Binary-File"];
var jobID, jobName, machineID;

/*
 * Function to render Success message.
 */
function displayMessageOnSuccess(htmlString) {
//	$( "#submitJobResp" ).css( "color", "#0000FF" );
//	$( "#submitJobResp" ).html( htmlString );

//	$("#submitJobResp").show();
//	setTimeout(function() { $("#submitJobResp").hide(); }, 10000);

	$("#myModal .modal-body").html(htmlString);
	$('#myModal').modal('show');
}

/*
 * Function to render Error message.
 */
function displayOnError(htmlString) {
//	$( "#submitJobResp" ).css( "color", "#FF0000" );
//	$( "#submitJobResp" ).html( htmlString );

	$("#myModal .modal-body").html(htmlString);
	$('#myModal').modal('show');
}

////////////SUCCESS Functions////////////

/*
 * Submit Job Success Function.
 */
function jobSubmitSuccess(response) {
	var htmlString = "<p>Job ID: " + response.submitJobResponse.jobId + "<br>Status: "
	+ response.submitJobResponse.status + "</p>";

	jobID = response.submitJobResponse.jobId;
	displayMessageOnSuccess( htmlString );

	// Hide Loading overlay
	$("#overlay").css("visibility", "hidden");

	// Clear the array and form
	fileContentURLs = [];
	$("button[type='reset']").click();
}

/*
 * Monitor Job Success Function.
 */
function jobMonitorSuccess(response) {
	var htmlString = "<p>" + response.simpleAPIResponse.message + "</p>";

	//alert(htmlString)
	displayMessageOnSuccess( htmlString );

	// Hide Loading overlay
	$("#overlay").css("visibility", "hidden");
}

/*
 * Get Job Status Success Function.
 */
function jobGetStatusSuccess(response) {
	var htmlString = "<p>"
		+ "Job ID: " + response.jobResponse.jobId + "<br>"
		+ "Status: " + response.jobResponse.status + "<br>"
		+ "Queue: " + response.jobResponse.queue + "<br>"
		+ "Required Memory: " + response.jobResponse.requiredMemory + "<br>"
		+ "Number of Processors: " + response.jobResponse.numProcessors + "<br>"
		+ "Number of Nodes: " + response.jobResponse.numNodes + "<br>"
		+ "Required Time: " + response.jobResponse.requiredTime + "<br>"
		+ "User Name: " + response.jobResponse.userName + "<br>"
		+ "Job Name: " + response.jobResponse.jobName + "<br>"
		+ "Elapsed Time: " + response.jobResponse.elapsedTime + "<br>"
		+ "</p>";

	//alert(htmlString)
	displayMessageOnSuccess(htmlString);

	// Hide Loading overlay
	$("#overlay").css("visibility", "hidden");
}

/*
 * Cancel Job Success Function.
 */
function jobCancelSuccess(response) {
	var htmlString = "<p>" + response.simpleAPIResponse.message + "</p>";
	//alert(htmlString)
	// displayMessageOnSuccess( htmlString );

	$("#cancelJobResp").css( "color", "#0000FF");
	$("#cancelJobResp").html(htmlString);
	$("#cancelJobResp").show();
	setTimeout(function() { $("#cancelJobResp").hide(); }, 5000);

	// Hide Loading overlay
	$("#overlay").css("visibility", "hidden");
}

/*
 * Output Download Success Function.
 * FIXME: This may not be really required.
 */
function outputDownloadSuccess(response) {
	var htmlString = "<p>Output File Download Should Begin Shortly</p>";
	//alert(htmlString)
	//displayMessageOnSuccess( htmlString );

	$("#downloadResp").html(htmlString);
	$("#downloadResp").show();
	setTimeout(function() { $("#downloadResp").hide(); }, 5000);
}

////////////ERROR Functions////////////
//TODO: Implement Error functions and handle errors on UI.

/*
 * Submit Job function.
 */
function submitJob(procnum, email, nodenum, walltime, jobname, appId, machID) {

	// Show loading overlay
	$("#overlay").css("visibility", "visible");

	// Construct JSON
	var jsonData = new Object();
	var jobRequest = new Object();
	jobRequest.numProcessors = procnum;
	jobRequest.emailId = email;
	jobRequest.numNodes = nodenum;
	jobRequest.wallTime = walltime;
	jobRequest.jobName = jobname;
	jobRequest.applicationID = appId;
	jobRequest.machineID = machID;

	var inputFiles = [];
	$.each(fileContentURLs, function(i, contentURL) {
		var inputFile = new Object();
		inputFile.fileName = fileContentURLs[i];

		// file type to name mapping
		if(fileContentURLs[i].includes('.gro')) {
			inputFile.fileType = fileTypes[0];
		}
		else {
			inputFile.fileType = fileTypes[1];
		}

		// add to json data
		inputFiles.push(inputFile);
	});

	jobRequest.inputFiles = inputFiles;
	jsonData.submitJobRequest = jobRequest;
	console.log(JSON.stringify(jsonData));

	$.ajax({
		type: "POST",
		url: baseURL + "/job/submit",
		headers: {
			'Content-type': "application/json"
		},
		data: JSON.stringify(jsonData),
		success: jobSubmitSuccess,
		dataType: "json"
	});
}

/*
 * Monitor Job Function.
 */
function monitorJob(jobID) {
	//alert("monitor job " + jobID);

	// Show loading overlay
	$("#overlay").css("visibility", "visible");

	$.get( baseURL + "/job/" + jobID + "/monitor", jobMonitorSuccess );
}

/*
 * Get Job Status function.
 */
function getStatus(jobID) {
	//alert("getstatus job " + jobID);

	// Show loading overlay
	$("#overlay").css("visibility", "visible");

	$.get( baseURL + "/job/" + jobID + "/status", jobGetStatusSuccess );
}

/*
 * Cancel Job function.
 */
function cancelJob(machineID, jobID) {
	//alert("cancel job " + jobID);

	// Show loading overlay
	$("#overlay").css("visibility", "visible");

	$.ajax({
		type: "DELETE",
		url: baseURL + "/job/" + machineID + "/" + jobID,
		success: jobCancelSuccess
	});
}

/*
 * Download Output function.
 */
function downloadOutput(machineID, jobID) {
	//alert("download output job " + jobName);

	$.get( baseURL + "/job/" + machineID + "/" + jobID + "/output", outputDownloadSuccess);

	window.open(baseURL + "/job/" + machineID + "/" + jobID + "/output", "_blank");
}
