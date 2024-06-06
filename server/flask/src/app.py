import os
import sys
import json

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root)


from flask import Flask, request, jsonify

from src.services.predictImageServices import predictImageServices
from src.services.predictSymptomServices import predictSymptomServices
from src.models.imagesModels import imagesModels
from src.models.symptomModels import symptomModels

app = Flask(__name__)

global singleton_instance_deseaseModels
singleton_instance_deseaseModels = imagesModels()

global singleton_instance_symptomModels
singleton_instance_symptomModels = symptomModels()

@app.route("/image/predict", methods=["POST"])
def predictImages():
    try:
        global singleton_instance_deseaseModels
        imageURL = request.get_json()["imageURL"]
        # print(imageURL)
        # Run model
        # testURL = "https://firebasestorage.googleapis.com/v0/b/practicefirebase-f0570.appspot.com/o/images%2F01.jpeg?alt=media&token=e3fe96f2-18be-4f05-befc-98a8dcf1c354"
        predictSv = predictImageServices(imageURL, singleton_instance_deseaseModels)
        result = predictSv.predict()
        # Return result
        # rs = json.dumps(result)
        return jsonify(result), 200
    except:
        return jsonify("Server error"), 500

@app.route("/symptoms/predict", methods=["POST"])
def predictSymptoms():
    try:
        global singleton_instance_symptomModels
        symptoms = request.get_json()["symptoms"]
        # print(symptoms)
        predictSv = predictSymptomServices(symptoms, singleton_instance_symptomModels)
        result = predictSv.predict()
        # Return result
        if result is None:
            # return jsonify({ "messages": "Please check your symptom! It is not in symptom list."}), 400
            return jsonify({ "messages": "Vui lòng kiểm tra các triệu chứng! Có triệu chứng không thuộc danh sách triệu chứng."}), 400
        return jsonify(result), 200
    except:
        return jsonify("Server error"), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
