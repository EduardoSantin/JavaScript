(function(){

    // MENU
    $("#funcionario").hide();
    $("#cidade").hide();
    $("#profissao").hide();

    $("#menuFuncionario").click(function(){
        $("#funcionario").show();
        $("#cidade").hide();
        $("#profissao").hide();
        populaCombobox();
    })
    
    $("#menuCidade").click(function(){
        $("#funcionario").hide();
        $("#cidade").show();
        $("#profissao").hide();
    })
    
    $("#menuProfissao").click(function(){
        $("#funcionario").hide();
        $("#cidade").hide();
        $("#profissao").show();
    })

    //////////////////////////FUNCIONARIO//////////////////////////
    var listaDeFuncionarios = [];

    function salvarFuncionario(){
        var funcionario = {};

        funcionario.nome = $("#nome").val();
        funcionario.cpf = $("#cpf").val();
        funcionario.dataNascimento = $("#dataNascimento").val();
        funcionario.dataAdmissao = $("#dataAdmissao").val();
        funcionario.telefone = $("#telefone").val();
        funcionario.ctps = $("#ctps").val();
        funcionario.salario = $("#salario").val();
        funcionario.cidade = $("#cidade-cbx").val();
        funcionario.profissao = $("#profissao-cbx").val();

        let id = $("#idFuncionario").val();

        if(id == undefined || id == ''){
            funcionario.id = new Date().getTime();
            listaDeFuncionarios.push(funcionario);
            alert("Salvo com sucesso");
        } else{
            let idNumber = parseInt(id);
            let funcionarioExistente = findFuncionarioById(idNumber);

            if(funcionarioExistente){
                funcionarioExistente.nome = funcionario.nome;
                funcionarioExistente.cpf = funcionario.cpf;
                funcionarioExistente.dataNascimento = funcionario.dataNascimento;
                funcionarioExistente.dataAdmissao = funcionario.dataAdmissao;
                funcionarioExistente.telefone = funcionario.telefone;
                funcionarioExistente.ctps = funcionario.ctps;
                funcionarioExistente.salario = funcionario.salario;
                funcionarioExistente.cidade = funcionario.cidade;
                funcionarioExistente.profissao = funcionario.profissao;
                alert("Editado com Sucesso");
            }
        }
        gravaNoLocalStorageFuncionario();
        renderizaCidade();
        renderizaFuncionario();
        zerarInputsFuncionario();

        return false;
    }
   
    function populaCombobox(){
        $("option").remove();
        
        $("#cidade-cbx").append('<option value="" selected="selected" disabled="disabled">Selecione</option>');
        listaCidades.forEach(function(item){
            $('#cidade-cbx').append('<option>' + item.nome + " - " +item.estado + '</option>');
        })

        $("#profissao-cbx").append('<option value="" selected="selected" disabled="disabled">Selecione</option>');
        listaProfissoes.forEach(function(item2){
            $("#profissao-cbx").append("<option>" + item2.nomeProfissao + "</option>");
        })
    }

    function renderizaFuncionario(){
        const tbody = $("#corpo-tabela-funcionario");

        tbody.html("");

        for(let i = 0; i < listaDeFuncionarios.length; i++){
            const funcionario = listaDeFuncionarios[i];

            let tr = $("<tr>");

            let tdNome = $("<td>").text(funcionario.nome);
            let tdCpf = $("<td>").text(funcionario.cpf);
            let tdDataNascimento = $("<td>").text(funcionario.dataNascimento);
            let tdDataAdmissao = $("<td>").text(funcionario.dataAdmissao);
            let tdTelefone = $("<td>").text(funcionario.telefone);
            let tdCtps = $("<td>").text(funcionario.ctps);
            let tdSalario = $("<td>").text(funcionario.salario);
            let tdCidade = $("<td>").text(funcionario.cidade);
            let tdProfissao = $("<td>").text(funcionario.profissao);
            let tdOpcoes = $("<td>");

            let btnEditar = $("<button>").text("Editar");
            let btnExcluir = $("<button>").text("Excluir");

            btnEditar.click(function(){
                editarFuncionario(funcionario.id);
            });

            const fn_exc = function(){
                excluirFuncionario(funcionario.id);
            }
            btnExcluir.click(fn_exc);

            tdOpcoes.append(btnEditar).append(btnExcluir);

            tr.append(tdNome)
            .append(tdCpf)
            .append(tdDataNascimento)
            .append(tdDataAdmissao)
            .append(tdTelefone)
            .append(tdCtps)
            .append(tdSalario)
            .append(tdCidade)
            .append(tdProfissao)
            .append(tdOpcoes);

            tbody.append(tr);
        }
    }

    function editarFuncionario(id){
        $('#formFuncionario').show();
        $('#cadastra-funcionario').text('Voltar a Tabela');
        let funcionario = findFuncionarioById(id);
        if(funcionario){
            $("#nome").val(funcionario.nome);
            $("#cpf").val(funcionario.cpf);
            $("#dataNascimento").val(funcionario.dataNascimento);
            $("#dataAdmissao").val(funcionario.dataAdmissao);
            $("#telefone").val(funcionario.telefone);
            $("#ctps").val(funcionario.ctps);
            $("#salario").val(funcionario.salario);
            $("#cidade-cbx").val(funcionario.cidade);
            $("#profissao-cbx").val(funcionario.profissao);
            $("#idFuncionario").val(funcionario.id);
        } else{
            alert("Não foi possivel encontrar o funcionario");
        }
    }

    function excluirFuncionario(id){
        listaDeFuncionarios = listaDeFuncionarios.filter(function(value){
            return value.id != id;
        });
        gravaNoLocalStorageFuncionario();
        renderizaFuncionario();
    }

    function findFuncionarioById(id){
        let funcionarios = listaDeFuncionarios.filter(function(value){
            return value.id == id;
        });

        if(funcionarios.length == 0){
            return undefined;
        } else {
            return funcionarios[0];
        }
    }

    function zerarInputsFuncionario(){
        $("#formFuncionario input").val('');
        $("#formFuncionario select").val("");
    }

    function gravaNoLocalStorageFuncionario(){
        const listaEmJSON = JSON.stringify(listaDeFuncionarios);

        localStorage.setItem("listaFuncionario", listaEmJSON);
    }

    function buscaDoLocalStorageFuncionario(){
        const listaStorage = localStorage.getItem('listaFuncionario');

        listaDeFuncionarios = JSON.parse(listaStorage) || [];
    }

    buscaDoLocalStorageFuncionario();
    renderizaFuncionario();

    $("#formFuncionario").on("submit", function(evt){
        salvarFuncionario();

        evt.stopPropagation();
        evt.preventDefault();
    });

    $('input, select').each(function(index, element){
        element.oninvalid = function(){
            const msg = $(this).data("custom-message");

            if(msg){
                this.setCustomValidity("");

                if(!this.validity.valid){
                    this.setCustomValidity(msg);
                }
            }
        }
    });

    $('#cadastra-funcionario').click(function(){
        if($('#cadastra-funcionario').text() == 'Voltar a Tabela'){
            $('#formFuncionario').hide();
            $('#cadastra-funcionario').text('Cadastrar');
        } else{
            $('#formFuncionario').show();
            $('#cadastra-funcionario').text('Voltar a Tabela');
        }
    })
    $('#formFuncionario').hide();


    //////////////////////////////////////CIDADE/////////////////////////////////////
    var listaCidades = [];
    
    function salvarCidade(){
        var cidade = {};
    
        cidade.nome = $("#nomeCidade").val();
        cidade.cep = $("#cep").val();
        cidade.estado = $("#estado").val();
        cidade.pais = $("#pais").val();
    
        let id = $("#idCidade").val();
        
        // não tenho código = criar novo
        if(id == undefined || id == ''){
            cidade.id = new Date().getTime();
            listaCidades.push(cidade);
            alert("Salvo com Sucesso");
        } else { // se tenho id, estou editando
            let idNumber = parseInt(id);
            let cidadeExistente = findCidadeById(idNumber);
            if(cidadeExistente){
                cidadeExistente.nome = cidade.nome;
                cidadeExistente.cep = cidade.cep;
                cidadeExistente.estado = cidade.estado;
                cidadeExistente.pais = cidade.pais;
                alert("Editado com Sucesso");
                }
        }
    
        gravaNoLocalStorageCidade();
        renderizaCidade();
        zerarInputsCidade();
    
        return false;
    }
    
    function renderizaCidade(){
        // busco o tbody com o id
        const tbody = $("#corpo-tabela");
    
        // zerando o conteúdo da tabela
        tbody.html('');
    
        for(let i=0; i<listaCidades.length; i++){
            // Busco a pessoa da lista
            const cidade = listaCidades[i];
    
            // cria um elemento html do tipo tr
            // table row - linha da tabela
            let tr = $('<tr>');
    
            // cria um elemento html do tipo td
            // table data - dado da tabela
            // popular os td com o valor a ser mostrado
            let tdNome = $('<td>').text(cidade.nome);
            let tdCep = $('<td>').text(cidade.cep);
            let tdEstado = $('<td>').text(cidade.estado);
            let tdpais = $('<td>').text(cidade.pais);
            let tdOpcoes = $('<td>');
    
            let btnEditar = $('<button>').text('Editar');
            let btnExcluir = $('<button>').text('Excluir');
            
            // associa o click a uma function
            btnEditar.click(function(){ 
                editarCidade(cidade.id)
            });

            // associa o click a uma function// faz o mesmo 
            const fn_exc = function(){ 
                excluirCidade(cidade.id)
            };

            btnExcluir.click(fn_exc);
            
            tdOpcoes.append(btnEditar).append(btnExcluir);
    
            // adiciono os td dentro do tr
            // na order a ser exibida
            tr.append(tdNome)
                .append(tdCep)
                .append(tdEstado)
                .append(tdpais)
                .append(tdOpcoes);
    
            // adiciona o tr no tbody
            tbody.append(tr);
        }
    }
 
    function editarCidade(id){
        $('#formularioCidade').show();
        $('#cadastrar-cidade').text('Voltar a Tabela');
       let cidade = findCidadeById(id);
        if(cidade){
            $("#nomeCidade").val(cidade.nome);
            $("#cep").val(cidade.cep);
            $("#estado").val(cidade.estado);
            $("#pais").val(cidade.pais);
            $("#idCidade").val(cidade.id);
        }else{
            alert('Não foi possível encontrar a cidade');
        }
    }
    
    function excluirCidade(id){
        listaCidades = listaCidades
            .filter(function(value){
                return value.id != id;
            });
    
        gravaNoLocalStorageCidade();
        renderizaCidade();
    }
    
    function findCidadeById(id){
        let cidades = listaCidades
            .filter(function(value){
                return value.id == id;
            });
        
        if(cidades.length == 0){
            return undefined;
        }else{
            return cidades[0];
        }
    }
    
    function zerarInputsCidade(){
       $("#formularioCidade input").val ('');
    }
    
    function gravaNoLocalStorageCidade(){
        // convertendo a lista em string no formato JSON
        const listaEmJSON = JSON.stringify(listaCidades);
    
        // gravando no localStorage
        localStorage.setItem("listaCidade", listaEmJSON);
    }
    
    function buscaDoLocalStorageCidade(){
        // busca do local storage
        const listaStorage = localStorage.getItem("listaCidade");
    
        // converte para lista e atribui
        listaCidades = JSON.parse(listaStorage) || [];
    }
    
        // o que se deseja executar
        buscaDoLocalStorageCidade();
        renderizaCidade();
    
      $("#formularioCidade").on("submit", function(evt){
                salvarCidade();
                // corta a linha de execucao
                evt.stopPropagation(); 
    
                // previne o comportamento padrão
                evt.preventDefault();
            });
        
        // busco todos os inputs
        $('input, select').each(function(index,element){
            element.oninvalid = function(){
                const msg = $(this).data('custom-message');
    
                if(msg){
                    // remove mensagens de erro antigas
                    this.setCustomValidity("");
    
                    // executa novamente a validação
                    if (!this.validity.valid) {
                        // se inválido, coloca mensagem de erro customizada
                        this.setCustomValidity(msg);
                    }
                }
            }

        });
        $('#cadastrar-cidade').click(function(){
            if($('#cadastrar-cidade').text() == 'Voltar a Tabela'){
                $('#formularioCidade').hide();
                $('#cadastrar-cidade').text('Cadastrar');
            } else{
                $('#formularioCidade').show();
                $('#cadastrar-cidade').text('Voltar a Tabela');
            }
        })
        $('#formularioCidade').hide();

    /////////////////////////////////////// PROFISSAO//////////////////////////////
    
        var listaProfissoes = [];

    function salvar(){
        var profissao = {};

        profissao.codigo = $("#codigo").val();
        profissao.nomeProfissao = $("#nomeProfissao").val();
        profissao.dataCadastro = $("#dataCadastro").val();

        let id = $("#idProfissao").val();

        if(id == undefined || id == ''){
            profissao.id = new Date().getTime();
            listaProfissoes.push(profissao);
            alert("Salvo com Sucesso");
        }else{
            let idNumber = parseInt(id);
            let profissaoExistente = findProfissaoById(idNumber);
            
            if(profissaoExistente){
                profissaoExistente.codigo = profissao.codigo;
                profissaoExistente.nomeProfissao = profissao.nomeProfissao;
                profissaoExistente.dataCadastro = profissao.dataCadastro;
                alert("Editado com sucesso");
            }
        }

        gravaNoLocalStorageProfissao();
        renderizaProfissao();
        zeraInputsProfissao();

        return false;
    }

    function renderizaProfissao(){

        const tbody = $("#corpo-tabela-profissao");

        tbody.html('');

        for(let i = 0; i < listaProfissoes.length; i++){

            const profissao = listaProfissoes[i];

            let tr = $("<tr>");

            let tdCodigo = $("<td>").text(profissao.codigo);
            let tdNome = $("<td>").text(profissao.nomeProfissao);
            let tdData = $("<td>").text(profissao.dataCadastro);
            let tdOpcoes = $("<td>");
           
            let btnEditar = $('<button>').text('Editar');
            let btnExcluir = $('<button>').text('Excluir');

            btnEditar.click(function () {
                editar(profissao.id);
            });

            btnExcluir.click(function(){
                excluir(profissao.id);
            });

            tdOpcoes.append(btnEditar).append(btnExcluir);

            tr.append(tdCodigo)
                .append(tdNome)
                .append(tdData)
                .append(tdOpcoes);
            
            tbody.append(tr);

        }
    }

    function editar(id){
        $('#formularioProfissao').show();
        $('#cadastra-profissao').text('Voltar a Tabela');
        let profissao = findProfissaoById(id);
        if(profissao){
            $("#codigo").val(profissao.codigo);
            $("#nomeProfissao").val(profissao.nomeProfissao);
            $("#dataCadastro").val(profissao.dataCadastro);
            $("#idProfissao").val(profissao.id);
        }else{
            alert("Não foi possivel encontrar");
        }
    }

    function excluir(id){
        listaProfissoes = listaProfissoes
            .filter(function(value){
                return value.id != id;
            });

        gravaNoLocalStorageProfissao();
        renderizaProfissao();
    }

    function findProfissaoById(id){
        let profissao = listaProfissoes
        .filter(function(value){
            return value.id == id;
        });

        if(profissao.length == 0){
            return undefined;
        }else{
            return profissao[0];
        }
    }
    function zeraInputsProfissao() {
        $("#formularioProfissao input").val('');
    }

    function gravaNoLocalStorageProfissao(){
        // convertendo a lista em string no formato JSON
         const listaEmJSON = JSON.stringify(listaProfissoes);
        
        // gravando no localStorage
         localStorage.setItem('listaProfissao', listaEmJSON);

    }

    function buscaDoLocalStorageProfissao() {
            // busca do local storage
         const listaStorage = localStorage.getItem("listaProfissao");
    
            // converte para lista e atribui
        listaProfissoes = JSON.parse(listaStorage) || [];
   
    }

    buscaDoLocalStorageProfissao();
    renderizaProfissao();

    $("#formularioProfissao").on("submit", function (evt) {
        salvar();
        // corta a linha de execucao
        evt.stopPropagation();

        // previne o comportamento padrão
        evt.preventDefault();
    });

    $('input, select').each(function (index, element) {
        element.oninvalid = function () {
            const msg = $(this).data('custom-message');

            if (msg) {
                // remove mensagens de erro antigas
                this.setCustomValidity("");

                // executa novamente a validação
                if (!this.validity.valid) {
                    // se inválido, coloca mensagem de erro customizada
                    this.setCustomValidity(msg);
                }
            }
        }
    });
    $('#cadastra-profissao').click(function(){
        if($('#cadastra-profissao').text() == 'Voltar a Tabela'){
            $('#formularioProfissao').hide();
            $('#cadastra-profissao').text('Cadastrar');
        } else{
            $('#formularioProfissao').show();
            $('#cadastra-profissao').text('Voltar a Tabela');
        }
    })
    $('#formularioProfissao').hide();
})();