function GetEmptyFieldCount() {
    empty = 0;
    $('#order div.block div.withlist input[type=hidden],#order div.block div.number input[type=text].house').each(function(i,elem) {
        if($(this).val()=='') { empty++;}
    });
    return empty;
}

function ShowOrderAfterAuth() {
    $('#auth').animate({opacity: 0}, 100,
       function(){
           $(this).css('display', 'none');
           $('.overlay').fadeOut(100,function() {
                $('.overlay').fadeIn(100,
                    function(){
                        $('#order')
                            .css('display', 'block')
                            .animate({opacity: 1}, 100);
                });
           });
       }
    );
}

function GetFullJson() {
    fullJSON = '{"Array":[';
    partStr = ''; index=0;
    $('#order div.block input[type=text]').each(function(i,elem) {
        index++;
        if (index!=1)
            partStr += ',';
        if ($(this).attr('name')=='street') {
            partStr += '{"id":"'+$(this).closest('div.withlist').find('input[type=hidden]').val()+'","name":"'+$(this).val()+'"';
        } else if($(this).attr('class')=='house'){
            partStr += '"dom":"'+$(this).val()+'"';
        } if($(this).attr('class')=='one korp'){
            partStr += '"korp":"'+$(this).val()+'"';
        } if($(this).attr('class')=='one pod'){
            partStr += '"pod":"'+$(this).val()+'"}';
        }
    });
    fullJSON += partStr + ']}';
    return fullJSON;
}

function GetErrorMessage(jqXHR,exception) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Не удалось подключиться к сети.';
    } else if (jqXHR.status == 404) {
        msg = 'Не удалось отправить данные.';
    } else if (jqXHR.status == 500) {
        msg = 'Внутренняя ошибка сервера.';
    } else if (exception === 'parsererror') {
        msg = 'Ошибка при обработке ответа сервера.';
    } else if (exception === 'timeout') {
        msg = 'Превышен интервал ожидания ответа сервера.';
    } else if (exception === 'abort') {
        msg = 'При отправке запроса возникла ошибка';
    } else {
        msg = 'Ошибка: \n' + jqXHR.responseText;
    }
    return msg;
}

function HideSendButton() {
    $('#order input.send_order').css('display','none');
    $('#order input.send_order').removeClass('send');
    $('#order input.send_order').addClass('price');
}

function ShowSendButton() {
    $('#order input.send_order').css('display','block');
    $('#order input.send_order').removeClass('price');
    $('#order input.send_order').addClass('send');
}

function ShowPriceButton() {
    $('#order input.send_order').css('display','block');
    $('#order input.send_order').removeClass('send');
    $('#order input.send_order').addClass('price');
    $('#order input.send_order').val('Рассчитать стоимость поездки');
}

function ChangePrice() {
    $('#order input.send_order').css('display','block');
    $('#order input.send_order').removeClass('send');
    $('#order input.send_order').addClass('price');
    $('#order input.send_order').val('Пересчитать стоимость поездки');
}

/*^^^^^^^^^^^^^^  Статичные функции для оптимизации кода ^^^^^^^^^^^^^^^^^^^^*/

function GetStreets(list,street,ftype) {
    tel = $('#order form input[name=tel]').val();
    password = $('#order form input[name=password]').val();
    $.ajax({
       type:"POST",
       url:"api/find_street.php",
       dataType: "JSON",
       data: "tel="+tel+"&password="+password+"&street="+street,
       success: function(res){
           if(res.error=='yes') {
             $('#auth div.error-msg').html(res.error_type);
           } else {
             streets = res.Array; str = '';
             jQuery.each(streets, function(i,street) {
                str +='<li data-dom="'+street['dom']+'" data-korp="'+street['korp']+'" data-rowid="'+street['id']+'">'+street['name']+'</li>';
             });
              list.html('<ul data-ftype="'+ftype+'">'+str+'</ul>');
           }
       },
       error: function (jqXHR, exception) {
           error = GetErrorMessage(jqXHR,exception);
           alert(error);
       },
   });
}

function GetPrice(s1,h1,s2,h2) {
    tel = $('#order input[name=tel]').val();
    password = $('#order input[name=password]').val();
    result = '';
    $.ajax({
        type:"POST",
        url:"api/get_price.php",
        dataType: "JSON",
        async: false,
        data: 'street1='+s1+'&house1='+h1+'&street2='+s2+'&house2='+h2+'&tel='+tel+'&password='+password,
        success: function(res){
            if(res.error=='yes') {
                $('#auth div.error-msg').html(res.error_type);
                result = 'error';
            } else {
                atype = $('#order input[name=auto_type]').val();
                cena_bag = $('#order input[name=cena_bag]').val();
                lgota = $('#order input[name=lgota]').val();
                sum_lgot_ezdki = $('#order input[name=sum_lgot_ezdki]').val();
                comfort = $('#order input[name=stat_drive_avto_vip]').val();
				result = res.price;
				if ((sum_lgot_ezdki!='') && (lgota!=0)) {
					result = result-(sum_lgot_ezdki*1);
				}
            }
        },
        error: function (jqXHR, exception) {
           error = GetErrorMessage(jqXHR,exception);
           alert(error);
        },
    });
    return result;
}

function SendOrder() {
    fullJSON = GetFullJson();
    tel = $('#order input[name=tel]').val();
    password = $('#order input[name=password]').val();
    auto_type = $('#order input[name=auto_type]').val();
    price = $('#order input[name=price]').val();
    if($('#order input[name=baby1]:checked').length > 0) baby = 1; else baby = 0;
    if($('#order input[name=baby2]:checked').length > 0) baby = 2; else baby = 0;
    if ($('#order input[name=bag]:checked').length > 0) bag = $('#order input[name=bag]').val(); else bag = 0;
    if ($('#order input[name=animals]:checked').length > 0) animals = $('#order input[name=animals]').val(); else animals = 0;
    comment = $('#order input[name=comment]').val();
    result = 'error';
    $.ajax({
        type:"POST",
        url:"api/send_order.php",
        dataType: "json",
        async: false,
        data: 'json='+fullJSON+'&tel='+tel+'&password='+password+'&auto_type='+auto_type+'&price='+price+'&baby='+baby+'&bag='+bag+'&animals='+animals+'&comment='+comment,
        success: function(res){
            if(res.error=='yes') {
                $('#order div.error-msg').html('При отправке заказа произошла ошибка.');
            } else {
                result = res.zakaz_id;
            }
        },
        error: function (jqXHR, exception) {
           error = GetErrorMessage(jqXHR,exception);
        },
    });
    return result;
}

function GetOrderStatus(id,obj) {
    tel = $('#order input[name=tel]').val();
    password = $('#order input[name=password]').val();
    status = 'error';
    $.ajax({
       type:"POST",
       url:"api/order_status.php",
       dataType: "JSON",
       async: false,
       data: "id_zakaz="+id+'&tel='+tel+'&password='+password,
       success: function(res){
           if(res.error=='yes') {
             $('#auth div.error-msg').html(res.error_type);
           } else {
             status = res.title;
             obj.html(status+'<input type="button" class="cancel_order" data-order="'+id+'" value="Отменить заказ">');
             obj.css('text-align','center');
             obj.css('color','#419841');
           }
       },
       error: function (jqXHR, exception) {
           error = GetErrorMessage(jqXHR,exception);
           alert(error);
       },
    });
    return status;
}

function OrderStatusControl(id,obj) {
    if($("div#order").is(":visible"))
        status = GetOrderStatus(id,obj);
}

function AuthUser(tel,password){
    if ((tel!=null) && (password!=null)) {
        if ((tel.length==10) && (password.length==4)) {
        $.ajax({
            type:"POST",
            url:"api/login.php",
            dataType: "JSON",
            data:'tel='+tel+'&password='+password,
            success: function(res){
                if(res.error=='yes') {
                     $('#auth div.error-msg').html(res.error_type);
                } else {
					//cookieOptions = {path:'/', expires: 30};
					//$.cookie('tel', tel, cookieOptions);
					//$.cookie('password', password, cookieOptions);
                    // $.cookie('tel', tel);$.cookie('password', password);
                     $('#order input[name=password]').val(get_cookie('password'));
                     $('#order input[name=tel]').val(get_cookie('tel'));
                     if (res.lgota)
                         $('#order input[name=lgota]').val(res.lgota);
                     else
                         $('#order input[name=lgota]').val('');

                     if (res.vip)
                         $('#order input[name=vip]').val(res.vip);
                     else
                         $('#order input[name=vip]').val('');

                     if (res.userblock=='true') {
                         $('#auth div.error-msg').html('Извините, но вы были заблокированы');
                     } else {
                         $('#auth div.error-msg').html('');
                     }
                     if (res.stat_drive_avto_vip!='')
                         $('#order input[name=stat_drive_avto_vip]').val(res.stat_drive_avto_vip);
                     else
                         $('#order input[name=stat_drive_avto_vip]').val('');
                     if (res.sum_lgot_ezdki!='')
                         $('#order input[name=sum_lgot_ezdki]').val(res.sum_lgot_ezdki);
                     else
                         $('#order input[name=sum_lgot_ezdki]').val('');
                     if (res.cena_bag!='')
                         $('#order input[name=cena_bag]').val(res.cena_bag);
                     else
                         $('#order input[name=cena_bag]').val('');
                     ShowOrderAfterAuth();
                }
             },
             error: function (jqXHR, exception) {
                  error = GetErrorMessage(jqXHR,exception);
                  alert(error);
             }
          });
        } else {
            if ((tel=='') || (password==''))
                $('#auth div.error-msg').html('');
            else
                $('#auth div.error-msg').html('Данные введены не корректно');
            ShowAuthForm();
        }
    } else {
        ShowAuthForm();
    }
}


function ShowAuthForm() {
    $('#order').css('display','none');
    $('#order').css('opacity','0');
    $('.overlay').fadeIn(100);
    $('#auth').css('display','block');
    $('#auth').css('opacity','1');
}

function get_cookie(cookie_name) {
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

/*^^^^^^^^^^^^^^  Функции для обмена данными с сервером ^^^^^^^^^^^^^^^^^^^^*/

$(document).ready(function() {
	var statusOrder;
    var overlay = $('.overlay');
    var modal_form = $('a.modal_auth, a.modal_order');
    //var close = $('.close, .overlay');
    var close = $('.close');
    var modal = $('.modal');

    modal_form.click( function(event){
        //tel = $.cookie('tel');
        //password = $.cookie('password');
        tel = get_cookie('tel');
		password = get_cookie('password');
        if ((tel!='') && (password!='')) {
            AuthUser(tel,password);
        } else {
            event.preventDefault();
            modal.find('input[type=text]').val('');
            modal.find('div.error-msg').html('');
            var div = $(this).attr('href');
            overlay.fadeIn(100,
                function(){
                    $(div)
                        .css('display', 'block')
                        .animate({opacity: 1}, 100);
                });
        }
    });
	close.click( function(){
		modal
		.animate({opacity: 0}, 100,
			function(){
				$(this).css('display', 'none');
				overlay.fadeOut(100);
			}
		);
	});

     $("#auth input[type=text],#order input.one.pod").keydown(function(event) {
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
            (event.keyCode == 65 && event.ctrlKey === true) ||
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 return;
        }
        else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });

    $('#order div.auto_type span:first').click(function() {
        $('#order div.auto_type div:first').css('display','block');
    });

    $('#order div.auto_type ul li').click(function() {
        $('#order div.auto_type input[name=auto_type]').val($(this).attr('data-rowid'));
        $('#order div.auto_type span:first').html($(this).html()+'&nbsp;<span data-icon="l" class="icon"></span>');
        $('#order div.auto_type div:first').css('display','none');
        empty = GetEmptyFieldCount();
        if (empty==0) ChangePrice(); else HideSendButton();
    });


    $(document).on('click','div.list li',function() {
        ftype = $(this).parent('ul').attr('data-ftype');
        $('#order input[name='+ftype+']').val($(this).attr('data-rowid'));
        $(this).closest('div.block').find('input[name=street]').val($(this).html());
        $(this).closest('div.block').find('input.house').val($(this).attr('data-dom'));
        $(this).closest('div.block').find('input.one.korp').val($(this).attr('data-korp'));
        $(this).closest('div.block').find('div.list').removeClass('active');
        empty = GetEmptyFieldCount();
        if (empty>0) {
            HideSendButton();
        } else {
            ChangePrice();
        }

    });

     $('#order input#bag, #order input#animals').click(function() {
        empty = GetEmptyFieldCount();
        if (empty==0) ChangePrice(); else HideSendButton();
    });

    $(document).on('keyup','div.block input[type=text]',function() {
        if(($(this).val()=='') && ($(this).attr('name')=='street')) {
            $(this).closest('div.block').find('input').val('');
        }
        empty = GetEmptyFieldCount();
        if (empty==0)
            ShowPriceButton();
        else {
            HideSendButton();
        }
    });

    $(document).on('click','input.send_order.price',function(){
        $('#order input.send_order').css('display','none'); index=0;
        $('#order div.withlist input[type=hidden]').each(function(i,elem) {
            index++;
        });
        price = 0;  //alert(index);
        for (var i = 1; i < index; i++) {
            s1 = $('#order input[name=street'+i+']').val();
            h1 = $('#order input[name=house'+i+']').val();
            s2 = $('#order input[name=street'+(i+1)+']').val();
            h2 = $('#order input[name=house'+(i+1)+']').val();
            if (GetPrice(s1,h1,s2,h2)!='error') {
                price = price + GetPrice(s1,h1,s2,h2);
            } else { price = 'error'; break; }
        }
        atype = $('#order input[name=auto_type]').val();
        cena_bag = $('#order input[name=cena_bag]').val();
        comfort = $('#order input[name=stat_drive_avto_vip]').val();
		if(atype == 2) price = (parseInt(price) + (parseInt(price) * (parseInt(comfort)/100)));
        if($('#order input[name=bag]:checked').length > 0) {
			if (atype==2) {
				bg = (parseInt(cena_bag) + (parseInt(cena_bag) * (parseInt(comfort)/100)));
			    price = parseInt(price) + parseInt(bg);
			}
			else
			{
				price = parseInt(price) + parseInt(cena_bag);
			}
        }
        if($('#order input[name=animals]:checked').length > 0) {
			if (atype==2) {
				bg = (parseInt(cena_bag) + (parseInt(cena_bag) * (parseInt(comfort)/100)));
			    price = parseInt(price) + parseInt(bg);
			}
			else
			{
				price = parseInt(price) + parseInt(cena_bag);
			}
        }
        price = (Math.ceil((parseInt(price))/10))*10;

        if (price=='error') {
            $('#auth div.error-msg').html('Не удалось определить цену');
            $('#order input.send_order').css('display','block');
        } else {
            if($('#order input[name=lgota]').val()=='true') {
                newprice = 1*price - 70;
                price = price+' - 70 = '+newprice;
                $('#order input[name=price]').val(newprice);
            } else {
                $('#order input[name=price]').val(price);
            }
            $('#order input.send_order').val('Заказать машину ('+price+' руб.)');
            ShowSendButton();
        }
    });

    $(document).on('click','input.send_order.send',function(){
        id = SendOrder();
        if((id=='error') || (id==''))
            $('#order div.error-msg').html('При отправке заказа произошла ошибка.');
        else {
            obj = $(this).parent('p');
            obj.html('<img src="loader.gif">');
            obj.css('text-align','center');
            statusOrder=setInterval(function(){ OrderStatusControl(id,obj); }, 5000);
        }
    });

    $(document).on('keyup','div.block input[name=street]',function(event) {
       str = $(this).val().toLowerCase();
       block = $(this).closest('div.block');
       list = block.find('div.list');
       ftype = block.find('div.withlist input[type=hidden]').attr('name');
       if(str.length>0) {
           GetStreets(list,str,ftype)
           list.addClass('active');
       } else {list.removeClass('active');}
    });


    $("#auth input.getpass").click(function(){
        tel = $('#auth input[name=tel]').val();
        if (tel.length==10) {
           $.ajax({
               type:"POST",
               url:"api/get_password.php",
               dataType: "JSON",
               data: "tel="+tel,
               success: function(res){
                   if(res.error=='yes') {
                      $('#auth div.error-msg').html(res.error_type);
                      $('#auth div.hidden-msg.passw').css('display','none');
                   } else {
                      $('#auth div.error-msg').html('');
                      $('#auth div.hidden-msg.passw').html('Пароль был отправлен по SMS.');
                      $('#auth div.hidden-msg.passw').css('display','block');
                   }
               },
               error: function (jqXHR, exception) {
                    error = GetErrorMessage(jqXHR,exception);
                    alert(error);
               },
           });
        } else $('#auth div.error-msg').html('Телефон введен не корректно');
    });


    $('#order div.addblock').click(function() {
       block = $('div.order_block_cont').clone(true); index = 0;
       $('#order input.send_order').css('display','none');
       $('#order div.block').each(function(i,elem) {
         index++;
         $(this).find('div.close_block').css('display','none');
         obj = $(this);
       });
       index++;
       if (index<6) {
            obj.find('p:first').html('<span data-icon="b" class="icon"></span>&nbsp;Промеж. пункт');
            obj.find('input.one.pod').closest('div').css('display','none');
            block.find('input[name=street_]').attr('name','street'+index);
            block.find('ul[data-ftype=street_]').attr('data-ftype','street'+index);
            block.find('input[name=house_]').attr('name','house'+index);
            block.find('input[name=korp_]').attr('name','korp'+index);
            block.find('input[name=pod_]').attr('name','pod'+index);
            block.find('input.one.pod').closest('div').css('display','none');
           $(block.html()).insertBefore($(this));
       }
       if (index==5) {
         $(this).css('display','none');
       }
    });


    $("#auth input.send").click(function(){
        tel = $('#auth input[name=tel]').val();
        pass = $('#auth input[name=password]').val();
        if ((tel.length==10) && (pass.length==4)) {
           $.ajax({
               type:"POST",
               url:"api/login.php",
               dataType: "JSON",
               data:$('#auth form').serialize(),
               success: function(res){
                   if(res.error=='yes') {
                        $('#auth div.error-msg').html(res.error_type);
                   } else {
					   var date = new Date;
						date.setDate(date.getDate() + 1);

						document.cookie = 'tel='+tel+'; path=/;expires='+date.toUTCString();
						document.cookie = 'password='+pass+'; path=/;expires='+date.toUTCString();
                        $('#order input[name=password]').val($('#auth input[name=password]').val());
                        $('#order input[name=tel]').val(res.userphone);
                        if (res.lgota)
                            $('#order input[name=lgota]').val(res.lgota);
                        else
                            $('#order input[name=lgota]').val('');

                        if (res.vip)
                            $('#order input[name=vip]').val(res.vip);
                        else
                            $('#order input[name=vip]').val('');

                        if (res.userblock=='true') {
                            $('#auth div.error-msg').html('Извините, но вы были заблокированы');
                        } else {
                            $('#auth div.error-msg').html('');
                        if (($('#order input[name=password]').val()!='') && ($('#order input[name=tel]').val()!='')) {
                            ShowOrderAfterAuth();
                        } else
                            $('#auth div.error-msg').html('Не удалось авторизоваться');
                        }
                   }
               },
               error: function (jqXHR, exception) {
                    error = GetErrorMessage(jqXHR,exception);
                    alert(error);
               },
           });
        } else $('#auth div.error-msg').html('Данные введены не корректно');
    });

    $(document).on('click','div.block div.close_block',function() {
       $(this).parent('div').remove(); curobj = $(this); index = 0;
       $('#order div.block').each(function(i,elem) { obj = $(this); index++; });
       obj.find('p:first').html('<span data-icon="b" class="icon"></span>&nbsp;Пункт прибытия');
       obj.find('div.close_block').css('display','block');
       obj.find('input.one.pod').closest('div').css('display','none');
       $('#order div.addblock').css('display','block');
       empty = GetEmptyFieldCount();
        if (empty==0) {
            $('#order input.send_order').css('display','block');
            $('#order input.send_order').removeClass('send');
            $('#order input.send_order').addClass('price');
            $('#order input.send_order').val('Пересчитать стоимость поездки');
        } else {
            $('#order input.send_order').css('display','none');
        }
    });

    $('#auth span.taxi-icon-question-circle').mouseover(function() {
         $('#auth div.hidden-msg').stop().slideToggle('fast');
    });

    $('#auth span.taxi-icon-question-circle').mouseleave(function() {
         $('#auth div.hidden-msg').stop().slideToggle('fast');
    });


    $('#order').on('focus','div.block input[type=text]',function(){
      $('#order div.block').removeClass('active');
      $(this).closest('div.block').addClass('active');
    });

     $(document).on('click','input.cancel_order',function() {
        id_zakaz = $(this).attr('data-order');
        tel = $('#order input[name=tel]').val();
		password = $('#order input[name=password]').val();
        obj = $(this).parent('p');
        $.ajax({
            type:"POST",
            url:"api/cancel_order.php",
            dataType: "json",
            async: false,
            data: "id_zakaz="+id_zakaz+'&tel='+tel+'&password='+password,
            success: function(res){
                obj.css('color','#944343');
                obj.html('Ваш заказ был отменен');
                clearInterval(statusOrder); // завершает опрос сервера
            },
            error: function (jqXHR, exception) {
               error = GetErrorMessage(jqXHR,exception);
            },
        });
        return result;
    });
});
