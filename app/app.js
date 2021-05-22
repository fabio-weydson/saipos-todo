var api = 'https://saipos-todo.herokuapp.com';
var app = angular.module('myTodoList',[])
var senha = "TrabalheNaSaipos";

app.controller('myTodoController', function($scope,$http) {

    $scope.loading = false;
    $scope.tasks  = [];


    /** Verifica Senha */
    $scope.Auth = ()=> {
        let auth = window.prompt("Por favor informe a senha do gestor:");
        if(!auth) { return false; } else if(auth!=senha) { alert("Senha incorreta 😕"); return false; }
        return true
    }

    /** Adiciona Tarefa */
    $scope.addTask = (newTask)=>{
       
        $scope.loading = true;

        $http.post(api+'/add-task', newTask).then((res)=>{
            if(res.status){
                setTimeout(()=>{ $scope.getTasks(); },1000);
                $scope.newTask = {};
            }
        }, ()=>{
            alert("Não foi possível adicionar a tarefa 😕");
            $scope.loading = false;
        });  
    }

    /** Remove Tarefa */
    $scope.delTask = (index)=>{
        if($scope.Auth()) {
            let task = $scope.tasks[index];
            task.status = 3;
            $http.post(api+'/update-task', task).then(()=>{  
            setTimeout(()=>{
                $scope.getTasks();
            },1000); })
        }
    }

    /** Muda Status da Tarefa para pendente */
    $scope.undoTask = (index)=>{
        let task = $scope.tasks[index];
        if(task.changes<2) {
            if($scope.Auth()) {
                task.status = 0;
                task.changes = ++$scope.tasks[index].changes;
                $http.post(api+'/update-task', task).then((res)=>{
                    setTimeout(()=>{
                        $scope.getTasks();
                    },1000);
                })
            }
        } else {
            alert("Essa tarefa já alcançou o limite de mudanças 😕")
        }
    }

    /** Muda Status da Tarefa para concluída */
    $scope.doneTask = (index)=>{
        let task = $scope.tasks[index];
        task.status = 1;
        $http.post(api+'/update-task', task).then(()=>{
            setTimeout(()=>{
                $scope.getTasks();
            },1000);
        })
    }

    /** Valida E-mail */
    $scope.verifyEmail = (newTask)=>{
        $http.get(`https://apilayer.net/api/check?access_key=579eb9175c3199d072bfbd7ce28a0903&email=${newTask.email}&smtp=1&format=1`).then((res)=>{
            if(res.data.did_you_mean) {

                let did_you_mean = window.confirm(`Você quis dizer ${res.data.did_you_mean}?`)
                if(did_you_mean) { $scope.newTask.email = res.data.did_you_mean;};
                
            } else if(res.data.format_valid) {

                $scope.addTask(newTask);

            } else if(!res.data.format_valid) {

                alert("Email invalido 😕");
                $scope.newTask.email = '';
                $scope.loading = false;

            }
            return true;
        }).catch((error)=>{
            return false;
        })
    }

    $scope.randomTask = async ()=>{
        return await $http.get('https://cat-fact.herokuapp.com/facts/random/?animal_type=dog&amount=3').then((res)=>{
           let facts =  res.data;
           facts.map((fact,index)=>{
            $scope.tasks.push({
                "resp_name":"Eu",
                "email":"eu@me.com",
                "title" : fact.text,
                "status" : 0,
                "changes" : 0,
                "dummy" : 1,
                "created_at" : new Date()})
           })
        })
    }

    $scope.getTasks = async ()=>{
        return await $http.get(api+'/tasks').then((res)=>{
            if(res.data) $scope.tasks = res.data;
            $scope.loading = false; 
        })
    }

    //Atualização a cada 20s
    setInterval(()=>{$scope.getTasks()},20000)

})