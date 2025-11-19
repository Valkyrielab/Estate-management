const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2');
const pdfParse = require('pdf-parse');

const app = express();
app.use(fileUpload());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'EstateManagement'
});

app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).send('No file uploaded');
    }

    const pdfFile = req.files.pdfFile;
    try {
        const data = await pdfParse(pdfFile.data);
        const text = data.text;

        // Extract fields using regex
        const nameMatch = text.match(/Full Name:\s*(.*)/);
        const idMatch = text.match(/Identity Number:\s*(.*)/);
        const taxMatch = text.match(/Tax Number:\s*(.*)/);
        const occupationMatch = text.match(/Occupation:\s*(.*)/);
        const salaryMatch = text.match(/Approximate monthly salary:\s*(.*)/);
        const residenceMatch = text.match(/Residence prior to death:\s*(.*)/);

        const clientInfo = {
            name: nameMatch ? nameMatch[1].trim() : null,
            id_number: idMatch ? idMatch[1].trim() : null,
            tax_number: taxMatch ? taxMatch[1].trim() : null,
            occupation: occupationMatch ? occupationMatch[1].trim() : null,
            salary: salaryMatch ? parseFloat(salaryMatch[1].replace(/,/g, '')) : null,
            residence: residenceMatch ? residenceMatch[1].trim() : null
        };

        // Insert into MySQL
        const nameParts = clientInfo.name ? clientInfo.name.split(' ') : ['',''];
        const sql = `INSERT INTO ClientInfo (client_id, name, surname, id_number, tax_number, occupation, salary, residence)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [1, nameParts[0], nameParts[1] || '', clientInfo.id_number, clientInfo.tax_number,
                       clientInfo.occupation, clientInfo.salary, clientInfo.residence], (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Data inserted successfully', clientInfo });
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
