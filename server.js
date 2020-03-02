const express = require('express')
const server = express()

// configurar o servidor para apresentar arquivos staticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extend: true }))

//configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '*123',
    host: 'localhost',
    port: 5432,
    database: 'db_doe'
})

// configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true,
})

// configurar a apresentação da página
server.get('/', (req, res) => {
    db.query('SELECT name, blood FROM tb_donors', (err, result) => {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows

        return res.render('index.html', { donors })
    });
})

server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    const query = `
    INSERT INTO tb_donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, (err) => {
        //fluxo de erro
        if (err) return res.send('Erro no banco de dados.')

        // fluxo ideal
        return res.redirect('/')
    })
})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, () => {
    console.log("Starting node server.")
})