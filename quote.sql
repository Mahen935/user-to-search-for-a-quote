CREATE TABLE favourites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
);
