BEGIN

CREATE TABLE orders (
  ID SERIAL UNIQUE PRIMARY KEY,
  meat_id FOREIGN KEY REFERENCES meat(id),
  buns_id FOREIGN KEY REFERENCES
​

CREATE TABLE cheese_join(
  burgers_id FOREIGN KEY REFERENCES burgers, -- PK, FK1 burgers_id Primary key for this table is a combo of PK, FK1
  cheese_id FOREIGN KEY REFERENCES cheese -- PK, FK2 cheese_id
)
--create index on name of table col
CREATE TABLE toppings_join(
  burgers_id FOREIGN KEY REFERENCES burgers,
  toppings_id FOREIGN KEY REFERENCES toppings
)
