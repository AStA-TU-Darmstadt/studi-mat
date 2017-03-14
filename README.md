# Studi-Mat

Studi-Mat is a Javascript "Voting Orientation Application". It is based on the similar app [Mat-O-Wahl](http://www.mat-o-wahl.de/) but does not share much code with it any more and is not compatible.

## Features
- load data via .csv
 - the .csv contains: Short Name of the question, names and abreviations of the groups, statements in long form, rating of the groups for each statement and a short explanation of each group for each statement.
- it can compare the user input with the provided positions of the groups


## Rating algorithm
Each position is rated in the following manner: Yes equals 1 while no is -1. Maybe counts as 0 and skipping is internally a 99.
Now for every question, if it was not skipped, the result is added to the sum depending on this table:

| group    |   user  |  score |
|----------|---------|--------|
|   1      |   1     |     +1 |
|  -1      |  -1     |     +1 |
|   0      |   0     |     +1 |
|   1      |  -1     |    -1  |
|  -1      |   1     |     -1 |
|   0      | 1/-1    |    -0.5|
|  1/-1    |   0     |    -0.5|

If a question should be weighted twice, the score just gets multiplied by two.

The resulting score can be from -n-d to n+d if n is the number of statements and d the number of double ratings.

## License
Studi-Mat is released under the terms of the GNU General Public License; either version 2 or 3, or (at your option) any later version.

## TODO / Roadmap
This list is ordered. Most important topics are on the top
 - recheck the calculating of the result [done, should be correct]
 - change language without reloading the page
 - add the statments of the lists
 - use the browsers back/forward button to navigate through the questions (window.history)
 - enable keyboard navigation (yes = y, no = n, ...)
