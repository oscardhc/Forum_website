var userInfo = []
var allCata = ['C','D','G','K','O','T','Z']
var allCity = ['北京','北京南','北京西','常州','成都','成都东','大同','广州','广州东','广州南','贵阳北','桂林北','哈尔滨','汉口','杭州东','合肥南','衡阳','济南','济南西','佳木斯','昆明南','兰州西','洛阳龙门','牡丹江','南仓','南京南','南宁','齐齐哈尔','青岛','山海关','上海','上海虹桥','深圳北','沈阳','沈阳北','沈阳南','石家庄','苏家屯','太原','天津','无锡','武昌','武汉','西安','西安北','鹰潭','长春','长沙南','郑州','郑州东','重庆北','株洲']
var captcha = []

function execCommand(cmd, done) {
    $.post('/exec', {'cmd': cmd}, function (d) {
        // alert(d.status === '-1')
        done(d)
    })
}

var errorDialog = new mdui.Dialog('#errorDialog');
document.querySelector('#errorDialog').addEventListener('opened.mdui.dialog', function () {
    document.querySelector('#cancelBtn').focus()
    // document.querySelector('#errorMsg').textContent = document.activeElement.id
})

function openError(msg) {
    // mdui.alert(msg, 'ERROR');
    document.querySelector('#errorMsg').textContent = msg
    errorDialog.open()
}

var loginDialogue = new mdui.Dialog('#exampleDialog')
function openLogin() {
    getCaptcha()
    loginDialogue.open()
    $('#capinput').focus()
    $('#emailinput').focus()
}


var processDialogue = new mdui.Dialog('#processDialogue')

function eraseBtnClicked () {
    var nm = document.querySelector('#emailinput').value
    var ps = document.querySelector('#passwdinput').value

    // alert(location.href)

    // alert(nm + ps)
    loginDialogue.close()

    // document.querySelector('#baseDiv').setAttribute('class', 'disabled')

    var cp = $('#capinput').val()
    if (Number(cp) != Number(captcha.val).toFixed(1)) {
        openError('验证码错误！')
        // errorDialog.open()
        return
    }

    processDialogue.open()
    var classVal = document.querySelector("body").getAttribute("class")
    document.querySelector("body").setAttribute('class', classVal + ' disabled')

    $.post('/login', {'user': nm, 'password': ps}, function (d) {
        // alert(d.status === '-1')
        processDialogue.close()
        document.querySelector("body").setAttribute('class', classVal)

        if (d.status === '-1') {
            openError('用户名或密码错误')
        } else {
            localStorage.removeItem('userInfo', JSON.stringify(userInfo))
            // console.log(location.href)
            var url = location.href.replace('#mdui-dialog','')
            // console.log(url)
            location.href = url
            location.reload(true)
            // history.go(0)
        }
    })

}

var signupDialogue = new mdui.Dialog('#signupDialog')

function registerBtnClicked () {
    let nm = document.querySelector('#userinputR').value
    let ps1 = document.querySelector('#passwdinputR1').value
    let ps2 = document.querySelector('#passwdinputR2').value
    let em = document.querySelector('#emailinputR').value
    let ph = document.querySelector('#phoneinputR').value

    signupDialogue.close()

    if (ps1 !== ps2) {
        document.querySelector('#errorMsg').textContent = "两次输入密码不一致"
        errorDialog.open()
    } else {
        processDialogue.open()

        $.post('/register', {'name': nm, 'password': ps1, 'email': em, 'phone': ph }, function (d) {
            // alert(d.status === '-1')
            processDialogue.close()

            if (d.status === '-1') {
                openError('注册失败')
            } else {
                // document.execCommand('Refresh')
                openError('注册成功，您的用户ID为' + d.id)
                localStorage.removeItem('userInfo', JSON.stringify(userInfo))
                // var url = location.href.replace('#mdui-dialog','')
                // alert(url)
                // location.href = url
            }
        })
    }

}


var logoutbtn = document.querySelector('#logoutbtn')
function logout() {
    localStorage.removeItem('userInfo')
    $.post('/logout', {}, function (d) {
        // alert('logged out!')
        // location.reload()
        location.href = "/"
        // alert('reloaded!')
    })
}

if (logoutbtn) {
    logoutbtn.onclick = logout
}

function ClickUsername() {
    if (event.keyCode == 13) {
        var pswd = document.querySelector('#passwdinput')
        pswd.focus()
        event.returnValue = false
        return false
    }
}

function ClickPassword(func) {
    if (event.keyCode == 13) {
        // alert("enter pressed")
        // alert(func)
        func()
        event.returnValue = false
        return false
    }
}

// var headicon = document.querySelector('#headicon')
// if (headicon) {
//     headicon.onclick = function () {
//         location.href = "/account"
//     }
// }

var hitokoto = document.querySelector('#hitokoto')
if (hitokoto) {
    fetch('https://v1.hitokoto.cn/?c=a ')
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            hitokoto.innerHTML = "&nbsp &nbsp &nbsp &nbsp" +  data.hitokoto;
            document.querySelector('#hitokotoSource').innerHTML = "—— " + data.from
        })
}

var data = [
    // ['c100','2018-03-28 08:00','2018-03-28 08:23',[['一等座',2000,765.50],['二等座',2000,765.49],['三等座',2000,765.48]],'c','name1'],
    // ['c200','2018-03-28 10:00','2018-03-28 10:23',[['一等座',2000,965.50],['二等座',2000,965.49],['三等座',2000,965.48]],'c','name2'],
    // ['c300','2018-03-29 10:00','2018-03-29 10:23',[['一等座',2000,2265.50],['二等座',2000,265.49],['三等座',2000,265.48]],'c','name3']
]

var tagname = [
    '车次','出发站','发车日期','发车时间','到达站','到达日期','到达时间','余票'
]

function createPanel() {
    var plc = document.querySelector('#panelPlace')
    var row = data.length

    plc.innerHTML = ""

    for (var i=0;i<row;++i) {
        var pnl = document.createElement('div')
        pnl.setAttribute('class', 'mdui-panel-item mdui-hoverable')
        pnl.setAttribute('id', 'panel' + i)
        var hed = document.createElement('div')
        hed.setAttribute('class', 'mdui-panel-item-header')
        hed.innerText = data[i][0]
        hed.innerHTML += '<i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>'
        var bod = document.createElement('div')
        bod.setAttribute('class', 'mdui-panel-item-body')
        // bod.innerText = data[i]

        var lst = document.createElement('ul')
        lst.setAttribute('class', 'mdui-list')

        for (var j=0;j<8;j++) {
            var c = document.createElement('li')
            c.setAttribute('class', 'mdui-list-item mdui-ripple')
            c.innerText = tagname[j] + data[i][j]
            lst.append(c)
        }

        var btn = document.createElement('button')
        btn.setAttribute('class', 'mdui-btn mdui-ripple mdui-color-theme-accent')
        btn.innerText = "购买"

        bod.setAttribute('align', 'right')

        bod.append(lst)
        bod.append(btn)

        pnl.append(hed)
        pnl.append(bod)
        plc.append(pnl)
    }
}

if (document.querySelector('#panelPlace')) {
    createPanel()
}

// console.log($('#fromInput').editableSelect)

// $('#fromInput').editableSelect();

var profileDialog = new mdui.Dialog('#profileDialog')
var confirmPasswordDialog = new mdui.Dialog('#comfirmPasswordDialog')

function profileBtnClicked() {
    profileDialog.open()
}

function profileConfirmBtnClicked() {
    profileDialog.close()
    confirmPasswordDialog.open()
}

function profileSubmitBtnClicked() {
    confirmPasswordDialog.close()
    processDialogue.open()
    execCommand('modify_profile' + ' ' + userId + ' ' + $('#profileUsername').val() + ' ' + $('#profilePassword').val() + ' ' + $('#profileEmail').val() + ' ' + $('#profilePhone').val(), function (d) {
        let res = d.result;
        // alert(JSON.stringify(userInfo))
        processDialogue.close()
        localStorage.removeItem('userInfo')
        var url = location.href.replace('#mdui-dialog','')
        location.href = url
    })

}

// alert('user = ' + user)

function getUserInfo(userId, d = userInfo) {
    if (!localStorage.getItem('userInfo')) {
        // alert(userId);
        execCommand('query_profile ' + userId, function (dd) {
            let res = dd.result;
            d = res.split(" ")
            // console.log(d)
            // console.log(JSON.stringify(d))
            localStorage.setItem('userInfo', JSON.stringify(d))
            $('.userName').html(d[0])
            $('.userEmail').html(d[1])
            $('.userPhone').html(d[2])
            $('.userPriv').html(d[3])
            // alert(JSON.stringify(d))
        })
    } else {
        // alert(localStorage.getItem('userInfo'))
        d = JSON.parse(localStorage.getItem('userInfo'))
        // alert(userInfo)
        $('.userName').html(d[0])
        $('.userEmail').html(d[1])
        $('.userPhone').html(d[2])
        $('.userPriv').html(d[3] == "2" ? "管理员" : "注册用户")
        // document.querySelector('#userName').innerText = userInfo[0]
        // document.querySelector('#userEmail').innerText = userInfo[1]
        // document.querySelector('#userPhone').innerText = userInfo[2]
        // document.querySelector('#userPriv').innerText = userInfo[3]
    }

}

function getCaptcha() {
    $.post('/captcha', {}, function (d) {
        captcha = d
        $('#capLable').html('$\\displaystyle\\int_{x=0}^{1}' + captcha.diff + '=?$（保留一位小数）')
        $('#capinput').val(Number(captcha.val).toFixed(1))
        console.log("验证码:" + captcha.val)
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    })
}

getCaptcha()