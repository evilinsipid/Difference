function GetVerifiedCode () {
    var Account = document.getElementById('Account').value
    if (Account == '') {
        mdui.snackbar({
            position: 'top',
            message: '请输入手机号或邮箱'
        })
    } else {
        LoadIng(true,'正在发送验证码',220)

        var url = './SendVerifiedCode.php'
        var data = 'Account=' + Account

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: data,
            error:function() {
                LoadIng(false)

                mdui.snackbar({
                    position: 'top',
                    message: '请求失败-请检查网络是否正常'
                })
            },
            success:function(result) {
                LoadIng(false)

                var message = result.message

                mdui.snackbar({
                    position: 'top',
                    message: message
                })
            }
        })
    }
}

function Login () {
    var Account = document.getElementById('Account').value
    var VerificationCode = document.getElementById('VerificationCode').value

    if (Account == '') {
        mdui.snackbar({
            position: 'top',
            message: '请输入手机号或邮箱'
        })
    } else if (VerificationCode == '') {
        mdui.snackbar({
            position: 'top',
            message: '请输入验证码'
        })
    } else if (VerificationCode.length != 4) {
        mdui.snackbar({
            position: 'top',
            message: '验证码错误'
        })
    } else {
        LoadIng(true,'正在登陆',220)

        var url = './Login.php'
        var data = 'Account=' + Account + '&VerificationCode=' + VerificationCode

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: data,
            error:function() {
                LoadIng(false)

                mdui.snackbar({
                    position: 'top',
                    message: '请求失败-请检查网络是否正常'
                })
            },
            success:function(result) {
                var status = result.status
                var message = result.message

                if (status == 0) {
                    window.location.reload()
                } else {
                    LoadIng(false)

                    mdui.snackbar({
                        position: 'top',
                        message: message
                    })
                }
            }
        })
    }
}

function SetMoney (Money) {
    document.getElementById('Money').innerHTML = "<label class='mdui-textfield-label'>投喂🐟数</label><input class='mdui-textfield-input' type='number' value='" + Money + "' id='Money_input'></div>"
}

function SetMonth (Month) {
    document.getElementById('Month').innerHTML = "<label class='mdui-textfield-label'>投喂月数</label><input class='mdui-textfield-input' type='number' value='" + Month + "' id='Month_input' disabled></input>"
}

function SetPayType (PayType) {
    document.getElementById('PayType').innerHTML = "<input class='mdui-textfield-input' type='text' style='display:none' value='" + PayType + "' id='PayType_input'></input>"

    if (PayType == 0) {
        document.getElementById('PayType_alipay').innerHTML = "<label class='mdui-radio'><input type='radio' onclick='SetPayType(1)'><i class='mdui-radio-icon'></i>蓝色空投(支付宝)</label>"
    } else {
        document.getElementById('PayType_wxpay_qr').innerHTML = "<label class='mdui-radio'><input type='radio' onclick='SetPayType(0)'><i class='mdui-radio-icon'></i>绿色空投(微信)</label>"
    }
}

function Pay () {
    var Money = document.getElementById('Money_input').value
    var Month = document.getElementById('Month_input').value
    var PayType = document.getElementById('PayType_input').value

    if (Money == 0) {
        mdui.snackbar({
            position: 'top',
            message: '你不能投喂0条🐟给岛主会饿死的'
        })
    } else if (Money < 5) {
        mdui.snackbar({
            position: 'top',
            message: Money + '条🐟吃不饱的岛主会饿死的'
        })
    } else {
        LoadIng(true,'正在重定向到空投网关',220)

        if (PayType == 0) {
            PayType = 'wxpay_qr';
        } else if (PayType == 1) {
            PayType = 'alipay';
        }

        var form = $('<form method="post"></form>');
        form.append(`
        <input type="hidden" name="Money" value="${Money}">
        <input type="hidden" name="Month" value="${Month}">
        <input type="hidden" name="PayType" value="${PayType}">
        `);
        $(document.body).append(form);
        form.submit();
    }
}

function WXPayScanning (CheckID) {
    $.ajax({
        type: 'get',
        url: './WXPayCheck.php?ID=' + CheckID,
        dataType: 'json',
        success:function(result) {
            var status = result.status
            var ID = result.ID
            if (status == 0 && ID == CheckID) {
                window.location.replace('./');
            }
        }
    })
    
    setTimeout(function() {WXPayScanning(CheckID)},1000);
}

function GetCloudCode (Type) {
	LoadIng(true,'正在呼唤岛主获取口令',220)

	var form = $('<form method="post"></form>');
	form.append(`
	<input type="hidden" name="Type" value="GetCloudCode">
	`);
	$(document.body).append(form);
	form.submit();
}

function DaoJiShi(Seconds,OJS) {
    var Account = document.getElementById('Account').value
    if (Account == '') {
        mdui.snackbar({
            position: 'top',
            message: '请输入手机号或邮箱'
        })
    } else {
        if (Seconds > 1){
            Seconds--
            $(OJS).text(Seconds + '秒后再次获取验证码').attr('disabled',true)
            setTimeout(function () {
                DaoJiShi(Seconds,OJS)
            },1000)
        } else {
            $(OJS).text('获取验证码').attr('disabled',false)
        }
    }
}