import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

db.connect((err) => {
    if (err) console.error('Error koneksi MySQL:', err);
    else console.log('Terhubung ke MySQL!');
});

app.post('/create-tables', (req, res) => {

    const dropSurvey = `DROP TABLE IF EXISTS TRESTAURANTSURVEY`;
    const dropResto = `DROP TABLE IF EXISTS TMASTERRESTAURANT`;

    const createResto = `
        CREATE TABLE TMASTERRESTAURANT (
            RESTAURANT_ID INT PRIMARY KEY, 
            RESTAURANT_NAME VARCHAR(255), 
            ORIGIN VARCHAR(50), 
            LOCATION VARCHAR(100)
        )`;

    const createSurvey = `
        CREATE TABLE TRESTAURANTSURVEY (
            SURVEY_ID INT PRIMARY KEY, 
            PARTICIPANT_NAME VARCHAR(255), 
            GENDER VARCHAR(20), 
            AGE INT, 
            RESTAURANT_ID INT, 
            RATING_VALUE DECIMAL(3,1),
            CONSTRAINT FK_Restaurant 
            FOREIGN KEY (RESTAURANT_ID) REFERENCES TMASTERRESTAURANT(RESTAURANT_ID)
            ON DELETE CASCADE ON UPDATE CASCADE
        )`;

    const insertResto = `INSERT INTO TMASTERRESTAURANT VALUES 
        (1, 'Osteria Gia', 'Italian', 'Jakarta Selatan'),
        (2, 'Yialos Grill & Souvlaki', 'Greek', 'Jakarta Selatan'),
        (3, 'Bopet Mini', 'Indonesian', 'Jakarta Selatan'),
        (4, 'Wiro Sableng 212', 'Indonesian', 'Jakarta Utara'),
        (5, 'Grand Wingheng', 'Chinese', 'Jakarta Utara'),
        (6, 'Bakmi Wie Sin', 'Chinese', 'Tangerang'),
        (7, 'Spaghetto Pasta Lounge', 'Italian', 'Tangerang'),
        (8, 'Sale Retaurant BSD', 'Italian', 'Tangerang')`;

    const insertSurvey = `INSERT INTO TRESTAURANTSURVEY VALUES 
        (1, 'Adi Ariyanto Sani', 'Male', 28, 1, 4.2),
        (2, 'Calvin Kurniawan', 'Male', 33, 3, 4.5),
        (3, 'Faoziyati Meiningsih', 'Female', 26, 2, 4.7),
        (4, 'Andika Octavianto', 'Male', 25, 1, 4.2),
        (5, 'Anggi Nurul Fitriyani', 'Female', 21, 2, 4.4),
        (6, 'Albert Kasim', 'Male', 45, 5, 3.7),
        (7, 'Juanda Kusuma', 'Male', 35, 5, 4.7),
        (8, 'Luthfi Bintoro', 'Male', 41, 6, 5),
        (9, 'Ramita Utami', 'Female', 34, 7, 5),
        (10, 'Rahmat Oktavian', 'Male', 39, 8, 4.2),
        (11, 'Novi Fitriani', 'Female', 27, 7, 5),
        (12, 'Fitra Fauziah', 'Female', 25, 6, 4.3),
        (13, 'Edysen Setia Budi', 'Male', 27, 7, 4.8),
        (14, 'Andrey Tjahjana', 'Male', 42, 7, 4.7),
        (15, 'Dini Imawati', 'Female', 32, 6, 4.9),
        (16, 'Frenky', 'Male', 38, 3, 3.5),
        (17, 'Yoki Andika Chandra', 'Male', 52, 3, 2.2),
        (18, 'Christina Desi', 'Female', 30, 8, 4.6)`;

    db.query(dropSurvey, (err) => {
        if (err) return res.status(500).send("Error Drop Survey: " + err.message);

        db.query(dropResto, (err) => {
            if (err) return res.status(500).send("Error Drop Resto: " + err.message);

            db.query(createResto, (err) => {
                if (err) return res.status(500).send("Error Create Resto: " + err.message);

                db.query(createSurvey, (err) => {
                    if (err) return res.status(500).send("Error Create Survey: " + err.message);

                    db.query(insertResto, (err) => {
                        if (err) return res.status(500).send("Error Insert Resto: " + err.message);

                        db.query(insertSurvey, (err) => {
                            if (err) return res.status(500).send("Error Insert Survey: " + err.message);

                            res.send("Sukses! Tabel dengan Foreign Key berhasil dibuat.");
                        });
                    });
                });
            });
        });
    });
});

app.get('/get-all-data', (req, res) => {
    const sqlResto = "SELECT * FROM TMASTERRESTAURANT";
    const sqlSurvey = "SELECT * FROM TRESTAURANTSURVEY";

    db.query(sqlResto, (err, restoResult) => {
        if (err) return res.status(500).send(err);

        db.query(sqlSurvey, (err, surveyResult) => {
            if (err) return res.status(500).send(err);
            res.json({ restaurant: restoResult, survey: surveyResult });
        });
    });
});

app.get('/get-average-ratings', (req, res) => {
    const sql = `
        SELECT 
            a.RESTAURANT_NAME AS 'Restaurant Name',
            AVG(b.RATING_VALUE) AS 'Average Rating'
        FROM TMASTERRESTAURANT a
        JOIN TRESTAURANTSURVEY b ON a.RESTAURANT_ID = b.RESTAURANT_ID
        GROUP BY a.RESTAURANT_ID, a.RESTAURANT_NAME
        ORDER BY AVG(b.RATING_VALUE) DESC;
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.get('/get-specific-ratings', (req, res) => {
    const sql = `
        SELECT 
            a.RESTAURANT_NAME AS 'Restaurant Name', 
            ROUND(AVG(b.RATING_VALUE), 2) AS 'Average Rating'
        FROM TMASTERRESTAURANT a
        JOIN TRESTAURANTSURVEY b ON a.RESTAURANT_ID = b.RESTAURANT_ID
        WHERE b.AGE > 30 AND b.GENDER = 'Male'
        GROUP BY a.RESTAURANT_ID, a.RESTAURANT_NAME
        ORDER BY AVG(b.RATING_VALUE) DESC;
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server Backend running on port 3000');
});