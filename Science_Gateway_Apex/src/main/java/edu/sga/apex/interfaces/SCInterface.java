package edu.sga.apex.interfaces;

import edu.sga.apex.bean.SCPRequestBean;

/**
 *
 * @author erikadsouza
 *
 */
public interface SCInterface {
	
	/**
	 * This interface first creates a job script where some of the values
	 * are taken from the user interactively. It then submits the script 
	 * to the remote computing resource.
	 * 
	 * @param SCPRequestBean
	 * @return a status saying its submitted successfully or failed
	 */
	public String submitJob(SCPRequestBean SCPRequestBean);
	
	/**
	 * TODO
	 * @return 
	 */
	public String copyFiles(String srcFile, String destFile);
	
	/**
	 * Function is used to get an explicit status update of a job submitted
	 * @param jobId
	 * @return
	 */
	public String monitorJob(String jobId);
	
	
}
