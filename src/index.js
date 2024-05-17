// Maria Rita Pitol dos Anjos 202221305
// Maria Rita Pitol dos Anjos 202221305

const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// Modelo do Aluno
const StudentModel = mongoose.model('Student', {
    name: String,
    school: String,
});

// Esquema de Validação com Joi
const studentSchema = Joi.object({
    name: Joi.string().required(),
    school: Joi.string().required()
});

// Middleware de Validação
const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

// Rota para salvar um novo aluno no banco de dados
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

// Rota para buscar todos os alunos
app.get("/search", async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao consultar os alunos.");
    }
});

// Rota para excluir um aluno pelo ID
app.delete("/:id", async (req, res) => {
    try {
        await StudentModel.findByIdAndDelete(req.params.id);
        res.send("Aluno excluído com sucesso.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir o aluno.");
    }
});

// Rota para atualizar um aluno pelo ID
app.put("/:id", validateStudent, async (req, res) => {
    try {
        const student = await StudentModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            school: req.body.school
        }, { new: true });

        if (!student) {
            return res.status(404).send("Aluno não encontrado.");
        }

        return res.send("Aluno atualizado com sucesso.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao atualizar o aluno.");
    }
});

// Rota para consultar alunos por nome da escola
app.get("/school/:schoolName", async (req, res) => {
    try {
        const students = await StudentModel.find({ school: req.params.schoolName });
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao consultar os alunos da escola.");
    }
});

// Conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://mariaritaanjos1234:oitJhEUNa69jqp6R@cluster0.rllqt9m.mongodb.net/mydatabase?retryWrites=true&w=majority');
        console.log('Conectado ao MongoDB');

        app.listen(port, () => {
            console.log(`Aplicativo em execução na porta ${port}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB', err);
    }
};

startServer();
