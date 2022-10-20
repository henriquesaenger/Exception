# Exception

Exception was my first project, and also my undergraduate thesis in the major of Computer Science at UFPEL(Universidade Federal de Pelotas).

Exception is an application to help lactose and gluten intolerants find nearest restaurants and cafes that adequates to the user taste, based on previous ratings of the user, the hour of the day, and the distance between the stablishment and the user.

Was developed an Hybrid Recommender System, mixing Context-Based Filtering and Collaborative Filtering.
*Collaborative Filtering: basically identifies similarities with other user, and recommend something that was highly rated by a user with similar tastes as yours.
*Context-Based Filtering: includes other dimensions besides "Item X User", considering things like the distance and climate, what we know as the context the user is in.

The Hybrid Recommender System was made in cascade format, coming from a pre-contextual filtering(that considers the correct intolerance for the user), passing through the Collaborative Filtering and finally through a post-contextual filtering(that considers the distance between the user and the stablishment, and the hour of the day).

The hour of the day was a valid due to the fact that in Brazil we eat lunch at 12pm, so, you have to consider recommending a restaurant rather than a cafe, but if it's 4pm and you want to eat something light, you would prefer a cafe rather than a restaurant.

Google Maps API was used for the Geolocation and distance calculations.
The database used in this project is Firebase Firestore, a cloud NO-SQL database.
User Authentication was made using Firebase Authentication.

## Recommender System

- Pre-contextual Filterig(based on the allergy/intolerance); 
- Collaborative Filtering;
- Post-contextual Filtering(based on the distance);
- Post-contextual Filtering(based on the hour of the day);

Only the stablishments that accorded to the user intolerance/allergy will pass to the collaborative filtering.

The similarity between users used in collaborative filtering was achieved by using the Pearson Correlation Coefficient. The 5 most similar users were chosen as base ratings to create a ranking for the stablishments to be recommended.

The distance between the user and the stablishment is calculated using the Euclidean Distance formula.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

