import numpy as np
import os
import shutil
import tensorflow as tf
import re

class predictSymptomServices:
    def __init__(self, symptoms, model):
        """
        Create a new predict service.

        Args:
            url: The symptoms list.
        """
        self.symptoms = symptoms
        self.result = {}
        self.models = model
        
    def predict(self):
        """
        predict.

        Returns:
            The result.
        """
        result = None
        list_features = []
        list_diseases = []
        for value in self.models.features.values():
            list_features.append(value);
        for value in self.models.labels.values():
            list_diseases.append(value);
        # print(list_features)
        # print(self.symptoms)
        preprocessed_inputs = self.preprocess_inputs(self.symptoms, list_features)
        # print(preprocessed_inputs)
        if preprocessed_inputs is None:
            print("Input is not in Symptoms list")
        else: 
            predict_proba = self.models.weightModel.predict(preprocessed_inputs)
            # rs = list_diseases[np.argmax(predict_proba)]
            # print(rs, " ",  np.max(predict_proba) * 100)
            result = {list_diseases[np.argmax(predict_proba)]: str(round(np.max(predict_proba) * 100, ndigits=2))}
        return result
    
    def preprocess_inputs(self, list, all_columns):
        processed_list = [ele.lower().strip() for ele in list]
        processed_list = [re.sub(r"\s+", " ", element) for element in processed_list]
        # print(processed_list)
        preprocessed_inputs = tf.zeros(shape=[len(all_columns)])
        checkInListSymptom = 0
        for i in range(len(all_columns)):
            if all_columns[i] in processed_list:
                checkInListSymptom += 1
                preprocessed_inputs = tf.tensor_scatter_nd_update(preprocessed_inputs, [[i]], [1.0])
        if(checkInListSymptom == len(processed_list)):
            return np.expand_dims(preprocessed_inputs, axis=0)
        else: 
            return None