const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require("path");
const models = require("../models");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, "../config/google-directory-token.json");
const dirPathToKey = path.join(__dirname, "../config/google-directory-credentials.json");

// Load client secrets from a local file.
const getUsers =  fs.readFile(dirPathToKey, async (err, content) => {
  if (err) return console.error('Error loading client secret file', err);

  // Authorize a client with the loaded credentials, then call the
  // Directory API.
  //const users = await fetchAllLocalUsers();
  //authorize(JSON.parse(content),users, listUsers);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials,users, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oauth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      oauth2Client.setCredentials({
        refresh_token: `STORED_REFRESH_TOKEN`
      });
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client, callback);
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client,users);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
let nextPageToken;
let allUsers = [];
let firstEmail = "";
let count = 0;
function listUsers(auth,localUsers) {
  const service = google.admin({version: 'directory_v1', auth});
    service.users.list({
      domain: 'nielseniq.com',
      viewType : 'admin_view',
      relations: "manager",
      orderBy: 'email',
      maxResults: 500,
      pageToken : nextPageToken
    }, (err, res) => {
      if (err) return console.error('The API returned an error:', err.message);
      const users = res.data.users;
      nextPageToken = res.data.nextPageToken;
      console.log(res.data.nextPageToken)
      const filterdUsers = users.map(user=>{
        return {
          Email: getEmail(user),
          Manager: user.relations && user.relations.length > 0 ? user.relations[0].value : "",
          Country: user.addresses && user.addresses.length > 0 ? user.addresses.find(address=>address.type === "work") ? user.addresses.find(address=>address.type === "work").country : user.addresses[0].country : "",
          Thumbnail: user.thumbnailPhotoUrl ? user.thumbnailPhotoUrl : ""
        }
      })
      allUsers = allUsers.concat(filterdUsers)
      console.log(allUsers.length);
      console.log(users[users.length-1].primaryEmail)
      if(firstEmail === ""){
        firstEmail = users[0].primaryEmail;
      }
      if(count > 0 && firstEmail !== users[0].primaryEmail){
        count++;
        listUsers(auth,localUsers);
      }if(count === 0 && firstEmail === users[0].primaryEmail){
        count++;
        listUsers(auth,localUsers);
      }

      if(allUsers.length > 36000){
        updateLocalUser(allUsers,localUsers);
      }
    });
}

const fetchAllLocalUsers = async () => {
	try {
		const results = await models.Users.findAndCountAll({
			attributes: { exclude: ["Password"] },
			distinct: true, 
			order: [["Email", "DESC"]],
		});
		return results.rows
	} catch (ex) {
		console.log(ex);
	}
};

const updateLocalUser= async(googleUsers,localUsers)=> {
  localUsers.forEach(async user => {
    const googleUser = googleUsers.find(data=>data.Email.toLowerCase() === user.Email.toLowerCase());
    if(googleUser){
      console.log("google email: "+googleUser.Email)
        await models.sequelize.transaction(async (t) => {
            await models.Users.update(googleUser, {
                where: { Email: user.Email },
                transaction: t,
            }).catch(e=>{
              console.log(e)
            });
        }).catch(e=>{
          console.log(e)
        });
    }
  })       
}

function getGoogleUser(auth) {
  const service = google.admin({version: 'directory_v1', auth});
  service.users.get({
    userKey:'muhammad.waqas.consultant@nielsen.com',
    viewType : 'admin_view',
    orderBy: 'email',
  }, (err, res) => {
    if (err) return console.error('The API returned an error:', err.message);
    const user = res.data;
    if (user) {
        console.log(user);
    } else {
      console.log('No users found.');
    }
  });
}

function binarySearch(
  sortedArray,
  seekElement
){
  let startIndex = 0;
  let endIndex = sortedArray.length - 1;
  while (startIndex <= endIndex) {
    const mid = startIndex + Math.floor((endIndex - startIndex) / 2);
    const guess = sortedArray[mid];
    if (guess === seekElement) {
      return mid;
    } else if (guess > seekElement) {
      endIndex = mid - 1;
    } else {
      startIndex = mid + 1;
    }
  }

  return -1;
}

function getEmail(user){
  let email = "";
  if(user.primaryEmail){
    if(user.primaryEmail.split("@")[1]==="nielseniq.com"){
      email = user.primaryEmail;
    }else{
      email = user.emails.find(email => email.address.split("@")[1] ==="nielseniq.com").address;
    }
  }
  return email;
}
module.exports = { getUsers:getUsers };
