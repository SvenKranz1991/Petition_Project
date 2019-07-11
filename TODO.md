// Petition Part 3

// Login Page //////////////////////////////
// Registration is done with bcrypt I just need to get to store the Profile of user into a cookie
--> app.use(checking for registration)

After users register or log in, you should attach a user object to request.session.

Logged out users should be automatically redirected to the registration page.

// More information from Users ///////////////
// Already made a table for user_profiles
// Need to join this and Users Table together to get the information and show it on the page

// On the page listing all of the people who have signed the petition, show the additional profile information that is available.

-- City Names should also be Links

Change the signatures table so that it no longer includes columns for first and last name. When showing the list of people who have signed the petition, get their names by joining the users table.

Change the query that retrieves information from the users table by email address so that it also gets data from the signatures table. Thus you will be able to know whether the user has signed the petition or not as soon as they log in.

// Update User Profiles

// And Unsigning

// Express Router
