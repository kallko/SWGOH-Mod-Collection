# German Zip Codes test Task
NodeJS + Socket + Angular
created by Andrij Kalko


git clone

npm install

npm start

Open in browser http://localhost:9021
wait for data loading

choose one of the city and select district

push "details"

TASK:

Briefing
The "OpenGeoDB" project is offering a broad range of data enriched with geo locations. They also offer a list of all German zip codes and their related cities, including latitudes and longitudes. This list, as attached, should be shown to the user.

View 1: City List
As a user I want to see all cities in the list as soon as the app starts. The list should be sorted alphabetically (ascending), and I want to be able to scroll through all cities. Each city should appear only once in the list even it has multiple zip codes related (e.g. München (Munich)). When I select a city from the list which is only related to one single zip code, I want to go directly to the detail view of this zip code (View 2).
When I choose a city from the list which has more than one zip code (e.g. München (Munich)), I want to see a view (e.g. Dialog) where I can select the exact zip code I want to see more about. Selecting a zip code from this view leads me to its detail view (View 2).

View 2: Details
On the detail view I can see basic information as the name of the city, the specific zip code and its longitude and latitude. Additionally, I want to see the 10 closest zip codes nearby based on Geo Coordinate (even if they are in the same City). I want to see them in a list with zip code and name (e.g. 81927 München, 85609 Aschheim, ...).

Requirements
Technical
Simple and easy to use Frontend using a Frontend technology of your choice
PLZ.tab file can either be parsed in Frontend or be delivered from a Backend
Errors should be handled

Functional
The UI should be performant
The UI can be either Master/Detail View or a navigation Model

Expected Result
Please provide the complete and compilable project as zipped Git repository.

Questions
In case of remaining questions don’t hesitate to ask. You can also make assumptions own your own but please write a short comment why you decided that way.
