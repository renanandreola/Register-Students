function send (event) {
  event.preventDefault();

  var name = $("#name").val();
  var lastname = $("#lastname").val();
  var email = $("#email").val();
  var phone = $("#phone").val();
  var birthday = $("#birthday").val();
  var cep = $("#cep").val();
  var state = $("#state").val();
  var city= $("#city").val();
  var neighborhood = $("#neighborhood").val();
  var address = $("#address").val();
  var number = $("#number").val();
  var complement = $("#complement").val();
  var password = $("#password").val();
  var confirmpassword = $("#confirmpassword").val();
  var code = $("#code").val();
  var matricula = $("#matricula").val();
  var id = $("#id").val();

  // VÁLIDAÇÃO DOS CAMPOS DO FORMULÁRIO
  if (name == "") {
      toastr["error"]("Campo nome obrigatório");
      return;
  }

  if (lastname == "") {
      toastr["error"]("Campo sobrenome obrigatório");
      return
  }

  if (email == "") {
      toastr["error"]("Campo email obrigatório");
      return
  }

  if (phone == "" || phone.length < 9) {
      toastr["error"]("Campo telefone obrigatório");
      return
  }

  if (birthday == "") {
     toastr["error"]("Campo data de nascimento obrigatório");
     return
  }

  if (cep == "") {
        toastr["error"]("Campo CEP obrigatório");
        return
  }

  if (state == "") {
       toastr["error"]("Campo estado obrigatório");
       return
  }

  if (city == "") {
      toastr["error"]("Campo cidade obrigatório");
      return
  }

  if (neighborhood == "") {
      toastr["error"]("Campo bairro obrigatório");
      return
  }

  if (address == "") {
       toastr["error"]("Campo endereço obrigatório");
       return
  }

  if (number == "") {
       toastr["error"]("Campo número obrigatório");
       return
  }

  if (complement == "") {
       toastr["error"]("Campo complemento obrigatório");
       return
  }

 if (id == "" || (id.length > 0 && password.length > 0)) {
   if (password == "") {
        toastr["error"]("Campo senha obrigatório");
        return
   }

   if (password.length < 8) {
        toastr["error"]("Senha mínimo 8 caracteres");
        return
   }

   if (confirmpassword == "") {
        toastr["error"]("Confirme sua senha");
        return
   }

   if (password !== confirmpassword) {
        toastr["error"]("Senhas incompatíveis");
        return
   }
 }


  if (code == "") {
       toastr["error"]("Campo código do curso obrigatório");
       return
 }

 if (matricula == "") {
      toastr["error"]("Campo número da matrícula obrigatório");
      return
 }

  else {
    var data = {
      name: name,
      lastname: lastname,
      email: email,
      phone: phone,
      cep: cep,
      state: state,
      city: city,
      neighborhood: neighborhood,
      address: address,
      number: number,
      complement: complement,
      password: password,
      code: code,
      matricula: matricula,
      birthday: birthday
    }

    if (id.length == 0) {
      // ENVIA DADOS PARA O MONGODB
      $.post('/form', data, function (res) {
             if(res === 'ok') {
               toastr["success"]("Cadastro realizado com sucesso!");
               setTimeout(function(){
                location.reload();
              },1500);
               $('form').trigger('reset');
             } else {
               toastr["error"]("Erro: " + res);
              }
     })
   } else {
     data._id = id;

     if (password.length === 0) {
       delete data.password;
     }

     $.ajax({
       url: '/form',
       data: data,
       method: 'put',
       success: function (res) {
         if(res === 'ok') {
           toastr["success"]("Cadastro atualizado com sucesso!");
           setTimeout(function(){
            location.reload();
          },1500);
           $('form').trigger('reset');
         } else {
           toastr["error"]("Erro: " + res);
          }
       }
     })
   }
 }
}

// LIMPA CAMPOS DO FORMULÁRIO
function clear (){
  $("#name").val("");
  $("#lastname").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#cep").val("");
  $("#state").val("");
  $("#city").val("");
  $("#neighborhood").val("");
  $("#address").val("");
  $("#number").val("");
  $("#complement").val("");
  $("#code").val("");
  $("#birthday").val("");
  $("#matricula").val("");
}

$(document).ready(function() {
  function limpa_formulário_cep() {
    $("#address").val("");
    $("#neighborhood").val("");
    $("#city").val("");
    $("#state").val("");
    $("#complement").val("");
  }

  $("#cep").keyup(function() {
    var cep = $(this).val().replace(/\D/g, '');

    if (cep.length>="8") {
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {
        $("#address").val("...");
        $("#neighborhood").val("...");
        $("#city").val("...");
        $("#state").val("...");
        $("#complement").val("...");

        $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
          if (!("erro" in dados)) {
            $("#address").val(dados.logradouro);
            $("#neighborhood").val(dados.bairro);
            $("#city").val(dados.localidade);
            $("#state").val(dados.uf);
            $("#complement").val(dados.complemento);
          } else {
              limpa_formulário_cep();
              alert("CEP não encontrado.");
            }
        });
      }
      else {
        limpa_formulário_cep();
        toastr["error"]("Formato CEP é inválido");
      }
    } else {
        limpa_formulário_cep();
      }
  });
});

// EXCLUIR ITENS DA TABELA
$('.btn-remove').click(function () {
  $.ajax({
    url: '/form/' + $(this).attr('id'),
    type: 'delete',
    success: function (r) {
      if (r == 'ok') {
        toastr["error"]("Aluno removido!");
        setTimeout(function(){
          location.reload();
        },1500);
      } else {
        toastr["error"]("Alunos ", "Erro na exclusão");
      }
    }
  });
});

$('.btn-update').click(function () {
  $.ajax({
    url: '/api/students/' + $(this).attr('id'),
    success: function (r) {
      $("#id").val(r._id);
      $("#name").val(r.name);
      $("#lastname").val(r.lastname);
      $("#email").val(r.email);
      $("#phone").val(r.phone);
      $("#cep").val(r.cep);
      $("#state").val(r.state);
      $("#city").val(r.city);
      $("#neighborhood").val(r.neighborhood);
      $("#address").val(r.address);
      $("#number").val(r.number);
      $("#complement").val(r.complement);
      $("#code").val(r.code);
      $("#birthday").val(r.birthday);
      $("#matricula").val(r.matricula);
     }
  });
});

// PHONE MASK
$("#phone")
.mask("(99) 9999-9999?9")
  