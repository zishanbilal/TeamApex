package edu.sga.apex.rest.resource;

import javax.persistence.EntityExistsException;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import edu.sga.apex.rest.jaxb.ObjectFactory;
import edu.sga.apex.rest.jaxb.SimpleAPIResponse;
import edu.sga.apex.rest.jaxb.User;
import edu.sga.apex.rest.util.APIUtil;
import edu.sga.apex.rest.util.ExceptionUtil;
import edu.sga.apex.rest.util.JAXBManager;
import edu.sga.apex.util.UserDAOUtil;

/**
 * The Class UserResource.
 * 
 * @author Gourav Shenoy
 */
@Path("user")
public class UserResource {

	/* 
	 * API Request JSON
	    {
	        "user":
	        {
	            "userName": "admin",
	            "password": "apex123"
	        }
	    }
	 * 
	 * */
	/**
	 * Register user.
	 *
	 * @param user the user
	 * @return the response
	 */
	@POST
	@Path("register")
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response registerUser(User user) {
		ResponseBuilder builder = null;
		ObjectFactory factory = new ObjectFactory();
		try {	
			/* validate user jaxb */
			APIUtil.validateJAXB(user);
			
			/* check if user already exists */
			if(UserDAOUtil.isUserExists(user.getUserName())) {
				throw new EntityExistsException("User with UserName: " + user.getUserName() + "already exists!");
			}
			else {
				/* create a new user in db */
				edu.sga.apex.entity.User userDAO = JAXBManager.getUserDAOEntity(user);
				boolean success = UserDAOUtil.createUser(userDAO);
				if(success) {
					/* Construct response jaxb entity */
					SimpleAPIResponse response = factory.createSimpleAPIResponse();
					response.setMessage("Created new user: [" + user.getUserName() + "].");
					response.setStatus(Status.CREATED.getStatusCode());
					
					/* Build the response */
					builder = Response.ok(response);
					builder.status(Status.CREATED);
				}
				else {
					/* failed to create new user */
					throw new Exception("Failed to create new user: [" + user.getUserName() + "].");
				}
			}
		} catch (Exception ex) {
			/* handle exception and return response */
			return ExceptionUtil.handleException(ex);
		}

		/* Return the response */
		return builder.build();
	}
}
