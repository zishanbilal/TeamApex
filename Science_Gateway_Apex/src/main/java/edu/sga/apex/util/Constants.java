package edu.sga.apex.util;

import java.util.HashMap;
import java.util.Map;

/**
 * The Class Constants.
 * 
 * @author Gourav Shenoy
 */
public class Constants {

	/** The Constant SFTP_CHANNEL. */
	public static final String SFTP_CHANNEL = "sftp";

	/** The Constant EXEC_CHANNEL. */
	public static final String EXEC_CHANNEL = "exec";

	/** The Constant SSH_PORT. */
	public static final int SSH_PORT = 22;

	/**  The Constant for command line submit *. */
	public static final String SUBMITJOB = "submit";

	/**  The Constant for command line monitor *. */
	public static final String MONITOR = "monitor";
	
	/** The Constant QSTAT_BEAN. */
	public static final String QSTAT_BEAN = "QstatBean";
	
	/** The Constant QSTAT_RECORD. */
	public static final String QSTAT_RECORD = "qstat";
	
	/** The Constant JOB_STATUS. */
	public static final Map<String, String> JOB_STATUS;
	
	static {
		JOB_STATUS = new HashMap<String, String>();
		JOB_STATUS.put("Q", "Queued");
		JOB_STATUS.put("C", "Completed");
	}
}
