$(document).ready(function(){
    Main.init();
});

var Main = {

    $carrosselPlans: null,
    $window:null,
    $body:null,
    $wrapperCarrosel:null,
    $info:null,
    $bodyHtml:null,
    urlPlans:"https://www.nextel.com.br/jsonplans.aspx",
    urlRegistration:"https://www.nextel.com.br/jsonregistration.aspx",
    $txtFullName:null,
    $txtCpj:null,
    $txtPhone:null,
    $btnSend:null,
    $rNClient:null,
    $rClient:null,
    $btnGetItNow:null,

    init: function () {
        var self = this;

        self.$carrosselPlans = $('#owlPlans');
        self.$carrosselCards = $('#owlCards');
        self.$window = $(window);
        self.$body = $('body');
        self.$bodyHtml = $('html, body');
        self.$navbarMenu = $(".navbar.menu");

        self.$txtFullName = $("#txtFullName");
        self.$txtCpj = $("#txtCpfCnpj");
        self.$txtPhone = $("#txtPhone");
        self.$rNClient = $("#rdNCliente");
        self.$rClient = $("#rdCliente");
        self.$btnSend = $(".box-form .btn-enviar");
        self.$btnGetItNow = $(".btn-get-it-now");

        self.addEventListeners();
    },

    cpfCnpjMaskBehavior:function (val) {
        console.log(val.length)
           return val.replace(/\D/g, '').length > 14 ? '00.000.000/0000-00' : '000.000.000-00';
    },

    spMaskBehavior:function (val) {
           return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },

    addEventListeners:function(){
        var self = this;

        self.$btnSend.bind('click',function(e){
            e.preventDefault();
            if(self.validateForm()){
               self.sendForm();
            }
        })

        self.$btnGetItNow.bind('click',function(e){
            e.preventDefault();
            self.scrollTo("#contrateAgora");
        })


         self.$txtCpj.mask('00000-000', {
            reverse: true,
            onKeyPress: function(val, e, field, options) {
                var mask = (val.length>14) ? '00.000.000/0000-00' : '9000.000.000-00';             
                self.$txtCpj.mask(mask, options); 
            }
        });

        self.$txtPhone.mask(self.spMaskBehavior, {            
            onKeyPress: function(val, e, field, options) {
                field.mask(self.spMaskBehavior.apply({}, arguments), options);
            }
        });

        self.$carrosselPlans.owlCarousel({
            autoWidth:true,
            pagination:true,
            autoPlay : 4000,
            slideSpeed : 600,
            paginationSpeed : 800,
            rewindSpeed : 1000,
            stopOnHover : true,
            itemsCustom : [
                [0, 1],
                [768, 1],
                [1200, 1]
            ],
        });


        self.$window.resize(function(e){
            self.onResize(e);
        });

        self.onResize();
    },

    validateForm:function(){
        var self = this;
        var fullNameRegex = /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/;
        var cpfCnpjRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
        var telefoneRegex = /\(\d{2}\)\s\d{4,5}-?\d{4}/;
        var error = "";
        

  


        if($("input[name='client']:checked").val() == undefined){
                error +="Preencha o campo Cliente/Não Cliente corretamente.\n"; 
        }

        if(!fullNameRegex.test(self.$txtFullName.val())){
            error +="Preencha o campo Nome Completo corretamente.\n"; 
        }

        if(!cpfCnpjRegex.test(self.$txtCpj.val())){
            error += "Preencha o campo CPJ/CNPJ corretamente.\n";
        }

        if(!telefoneRegex.test(self.$txtPhone.val())){
           error +="Preencha o campo Telefone corretamente.\n";
        }

        if(error!=""){
            alert(error);
            return false;
        }else{
            return true;
        }
    },

    scrollTo:function(target){
        var self = this;
        var top = $(target).offset().top - self.$navbarMenu.outerHeight();
        self.$bodyHtml.stop().animate({scrollTop:top}, '500', 'swing');
    },

    onResize:function(e){
        var self = this;
       
        if(self.$body.width()>767){
            if(self.$carrosselCards.find('.owl-wrapper-outer').length){
                $('#owlCards').data('owlCarousel').destroy();
            }
            
        }else{
             self.$carrosselCards.owlCarousel({
                autoWidth:true,
                pagination:true,
                // navigation:true,
                // autoPlay : 4000,
                slideSpeed : 600,
                paginationSpeed : 800,
                rewindSpeed : 1000,
                stopOnHover : true,
                itemsCustom : [
                    [0, 1]
                ],
            });
        }
    },

    getPlans:function(){
        var self = this;
   
        $.ajax({
          url: self.urlPlans,
          method: 'GET'
        }).then(function(data) {
          console.log(data);
          //está com problema de cross.
        });
    },

    sendForm:function(){
        var self = this;
        var phonefull = $("#txtPhone").data().mask.getCleanVal();
        var ddd = phonefull.substr(0,2)
        var phone = phonefull.substr(2,phonefull.length-1);
        var name = self.$txtFullName.val();
        var cpjCnpj = self.$txtCpj.val();

        var data = JSON.stringify({
            "partner_key": "1E4AD0F2-51D4-4827-9E43-4DF32733B99A",
            "content":
            {
                 "str_nome_completo": name,
                 "str_cpf_cnpj": cpjCnpj,
                 "str_email": "",
                 "num_ddd": ddd,
                 "num_telefone": phone,
                 "bool_cliente": true
            }
          });

         $.ajax({
          url: self.urlRegistration,
          method: "POST",
          dataType: "json",
          data : data
        }).success(function(data) {
          if(data.success){
            alert("Sucesso!")
          }else{
            alert("Houver um erro.")
          }
        });

        console.log("aop")
    }
};






