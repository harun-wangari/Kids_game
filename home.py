from flask import Flask,redirect,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO,emit
import random

app=Flask(__name__)
socket=SocketIO(app)
words=["boy","girl","car","pan","ball","door","flower","jug","kite","house","mat","ink","spoon","ladder","egg","apple"]
@app.route("/")
def home():
    
    return render_template('home.html')

@app.route("/videos")
def videos():
    return render_template('videos.html')

@socket.on('start')
def getusername(name):
    emit('learn',words,broadcast=False)

if __name__=="__main__":
    socket.run(app,debug=True,host="0.0.0.0")