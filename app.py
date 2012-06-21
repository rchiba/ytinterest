"""
    ytinterest
    ~~~~~~

    Youtube + Pinterest?

    :copyright: (c) 2012 by Ryo Chiba.
    :license: BSD, see LICENSE for more details.
"""

import os

from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)