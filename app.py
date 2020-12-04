from flask import Flask, redirect, render_template, request, send_file

app = Flask(__name__)
tencent = [('QQ', 'QQ'), ('MicroMessenger', '微信')]
def checkPlatformFirst(fun, success):
    global tencent
    ag = request.headers.get('User-Agent')
    for i, n in tencent:
        if i in ag:
            return render_template('fkwechat.html', fun=fun, name=n)
    return success()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/viewThread/<i>')
def viewThread(i):
    return checkPlatformFirst(
        '分享链接',
        lambda: redirect(f'wkfg://{i}')
    )

def getfile():
    with open('./version.txt') as f:
        path = f.read().split('\n')[0]
        return send_file(path, as_attachment=True)

@app.route('/download/Android')
def dAndroid():
    return checkPlatformFirst(
        'Android 客户端下载',
        lambda: getfile()
    )

@app.route('/download/iOS')
def diOS():
    return redirect('https://apps.apple.com/cn/app/无可奉告/id1539945879')

@app.route('/code')
def code():
    return render_template('code.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
