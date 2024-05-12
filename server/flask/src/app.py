import os
import sys
import json

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root)


from flask import Flask, request

from src.services.predictService import predictService
from src.models.deseaseModels import deseaseModels

app = Flask(__name__)

global singleton_instance
singleton_instance = deseaseModels()

@app.route("/image/predict", methods=["POST"])
def predict():
    try:
        global singleton_instance
        imageURL = request.get_json()["imageURL"]
        print(imageURL)
        # Run model
        # testURL = "https://firebasestorage.googleapis.com/v0/b/practicefirebase-f0570.appspot.com/o/images%2F01.jpeg?alt=media&token=e3fe96f2-18be-4f05-befc-98a8dcf1c354"
        predictSv = predictService(imageURL, singleton_instance)
        result = predictSv.predict()
        # Return result
        rs = json.dumps(result)
        return rs, 200
    except:
        return "Server error", 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
