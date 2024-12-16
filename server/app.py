from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../src')


# Handle GET -> serve the starter page
@app.route('/')
def home():
    return send_from_directory('../src', 'login.html')


# Handle POST
@app.route('/login', methods=['POST'])
def login():
    return send_from_directory('../src', 'index.html')


# Serve static files (CSS, images, HTML)
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../src', filename)


if __name__ == '__main__':
    app.run(port=3000)
