package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.utils.IOUtils;
import umm3601.ride.RideController;
import umm3601.ride.RideRequestHandler;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;

import java.io.FileReader;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;
import org.json.*;

public class Server {

  private static final int serverPort = 4567;

  private static final String databaseName = "dev";

  public static void main(String[] args) {

    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    RideController rideController = new RideController(database);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);
    UserController userController = new UserController(database);
    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);


    //Configure Spark
    port(serverPort);
    enableDebugScreen();

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Redirects for the "home" page
    redirect.get("", "/");

    Route clientRoute = (req, res) -> {
      InputStream stream = Server.class.getResourceAsStream("/public/index.html");
      return IOUtils.toString(stream);
    };

    get("/", clientRoute);

    /// Ride Endpoints ///////////////////////////
    /////////////////////////////////////////////

    get("api/rides", rideRequestHandler::getRides);
    //get("api/rides/:destination", rideRequestHandler::getRideJSON);
    post("api/rides/new", rideRequestHandler::addNewRide);
    post("api/rides/update", rideRequestHandler::updateRide);
    post("api/rides/remove", rideRequestHandler::deleteRide);

    // User Endpoints ///////////////////////////////////
    /////////////////////////////////////////////////////
    get("api/users", userRequestHandler::getUsers);
    get("api/users/:id", userRequestHandler::getUserJSON);
    get("api/user/:id", userRequestHandler::getUserJSON);
    post("api/users/rate", userRequestHandler::rateUser);


    // An example of throwing an unhandled exception so you can see how the
    // Java Spark debugger displays errors like this.
    get("api/error", (req, res) -> {
      throw new RuntimeException("A demonstration error");
    });

    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    get("/*", clientRoute);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });

    post("api/login", (req, res) -> {

      JSONObject obj = new JSONObject(req.body());
      String authCode = obj.getString("code");

      try {
        String CLIENT_SECRET_FILE = "../secret.json";
        /*
        Document secret_file = Document.parse(new String(Files.readAllBytes(Paths.get(CLIENT_SECRET_FILE))));
        String local_secret = secret_file.getString("local");
        */
        GoogleClientSecrets clientSecrets =
          GoogleClientSecrets.load(
            JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));


        GoogleTokenResponse tokenResponse =
          new GoogleAuthorizationCodeTokenRequest(
            new NetHttpTransport(),
            JacksonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientSecrets.getDetails().getClientId(),


            clientSecrets.getDetails().getClientSecret(),
            authCode,
            "http://localhost:9000").execute();

        // Get profile info from ID token
        GoogleIdToken idToken = tokenResponse.parseIdToken();
        GoogleIdToken.Payload payload = idToken.getPayload();
        String userId = payload.getSubject();     // Use this value as a key to identify a user.
        String email = payload.getEmail();
        System.out.println(userId);
        boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
        System.out.println(userId);
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String locale = (String) payload.get("locale");
        System.out.println(userId);
        System.out.println(email);
        System.out.println(name);
        System.out.println(pictureUrl);
        return userController.login(userId, email, name, pictureUrl);
      } catch (Exception e) {
        e.printStackTrace();
      }

      return "";
    });
  }

  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
