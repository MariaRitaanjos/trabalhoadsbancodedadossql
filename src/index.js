// Maria Rita Pitol dos Anjos 202221305
// estrutura
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
const port = 3000;

const StudentModel = mongoose.model('Student', {
    name: String,
    school: String,
});

// Async function to handle saving a new student to the database
app.post("/", async (req, res) => {
    try {
        const newStudent = new StudentModel({
            name: req.body.name,
            school: req.body.school
        });
        await newStudent.save();
        res.send(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar o aluno.");
    }
});

// Async function to handle fetching all students
app.get("/search", async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao consultar os alunos.");
    }
});

// Async function to handle deleting a student by ID
app.delete("/:id", async (req, res) => {
    try {
        await StudentModel.findByIdAndDelete(req.params.id);
        res.send("Aluno excluído com sucesso.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir o aluno.");
    }
});

// Async function to handle updating a student by ID
app.put("/:id", async (req, res) => {
    try {
        const student = await StudentModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            school: req.body.school
        });

        if (!student) {
            return res.status(404).send("Aluno não encontrado.");
        }

        return res.send("Aluno atualizado com sucesso.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao atualizar o aluno.");
    }
});

//Consultar um grupo de registros:

app.get("/school/:schoolName", async (req, res) => {
    try {
        const students = await StudentModel.find({ school: req.params.schoolName });
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao consultar os alunos por escola.");
    }
});


//Validação Json:

const Joi = require('joi');

const studentSchema = Joi.object({
    name: Joi.string().required(),
    school: Joi.string().required()
});

const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
app.post("/", validateStudent, async (req, res) => {
    try {
        const newStudent = new StudentModel({
            name: req.body.name,
            school: req.body.school
        });
        await newStudent.save();
        res.send(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar o aluno.");
    }
});




// Connect to the database and start the server
app.listen(port, () => {
    mongoose.connect('mongodb+srv://mariaritaanjos1234:hF55jf4UhW86wBam@cluster0.rllqt9m.mongodb.net/mydatabase?retryWrites=true&w=majority');

    console.log('App running');
});
