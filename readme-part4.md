SELECT singers.id, singers.name AS singer, songs.name AS song, albums.name AS album FROM singers

LEFT JOIN songs
on singers.id = songs.singer_id

JOIN albums
ON singers.id = albums.singer_id;

id -- singer -- song -- album

1
2
2
4
5

-- Kill the first name and last name from the signatures table replace it with user_id

DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
id SERIAL PRIMARY KEY,
age INT,
city VARCHAR(100),
url VARCHAR(300),
user_id INT REFERENCES users(id)
)

-- REFERENTIAL INTEGRITY

-   Need a new GET route and POST route for the extra information page.
    (everything should be optional)

-   We need a function that cleans the url

-   We can use startsWith()

-   var str = 'hello';

-   str.startsWith('hell');

-   Here we want to check if it starts with https:// or http://

Also need to work on the signers page.

-   Problem is data now lives in 3 tables

-   Solution --> JOINS!

-   (tip: I would start with signatures table).

{{#singers}}
{{#if url}}
<a href={{url}}>{{first }} {{last}} </a>
{{else}}
{{first_name}}{{last_name}}
{{/if}}
{{/signers}}

-   NEW Get Route for the cities page. (think params)

WHERE city = \$1

        -- becomes

        WHERE LOWER(city) = LOWER($1)

-- JAVASCRIPT URL attack

str.startsWith('for');
