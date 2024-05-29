import numpy as np
import os
import shutil
import tensorflow as tf

IMAGE_HEIGHT_INPUT, IMAGE_WIDTH_INPUT = 224, 224

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
        result = []
        
        return result