var fs = require('fs'),
  express = require('express'),
  mysql = require('mysql'),
  path = require('path'),
  cors = require('cors');


var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../app/')));


//Middleware de erros
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({"error":JSON.stringify(error)});
 })

//Metodo para conexão ao banco
function connect() {
  return mysql.createConnection('mysql://jmkb1oyk4uo4sxa4:sqjx4hy3ilc29gca@frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/kwra425tj8sw9n3w');
}
const conn = connect();

//Metodo para adicionar novo registro
async function insertTask(task){
  const sql = 'INSERT INTO tasks(title,resp_name,email) VALUES (?,?,?);';
  const values = [task.title, task.resp_name, task.email];
  return await conn.query(sql, values, function (err, result) {   return result;  });
}

/** Metodo para atualizar um registro */
async function updateTask(task){
  const sql = 'UPDATE tasks SET status = ?, changes = ? WHERE id_task = ?';
  return await conn.query(sql, [task.status,task.changes,task.id_task], function (err, result) {  return result; });
}



/** Endpoint padrão **/
app.get('/', (req, res)=> {
  fs.readFile(path.join(__dirname,'../app','index.html'), function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

/** Endpoint para retornar todos os registros */
app.get('/tasks', async (req, res)=> {
  return await conn.query('SELECT * FROM tasks', (err,results)=>{
    res.json(results)
  });
});

/** Endpoint para adicionar novo registro */
app.post('/add-task', async (req,res)=> {
  let task = req.body;
  const inserted = await insertTask(task);
  if(inserted) res.send({"status":true})
})

/**
Endpoint para remover um registro
apenas mudança de status para preservar os dados
*/

app.post('/update-task', async (req,res)=> {
  let task = req.body;
  const updated = await updateTask(task);
  if(updated) res.send({"status":true})
})

app.maxConnections = 9;

app.listen(80,()=>{
  console.log("Rodando na porta 8080")
});